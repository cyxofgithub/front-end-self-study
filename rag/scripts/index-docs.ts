import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, basename, extname } from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { ChromaClient } from 'chromadb';

// ============ Configuration ============

const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..');
const CHROMA_HOST = process.env.CHROMA_HOST || 'http://localhost:8000';
const COLLECTION_NAME = process.env.CHROMA_COLLECTION || 'frontend-docs';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text';

const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/code/**',
  '**/demo/**',
  '**/client/**',
  '**/server/**',
  '**/.vitepress/**',
  '**/.git/**',
  '**/.cursor/**',
  '**/.pnpm-store/**',
  '**/dist/**',
  '**/*.assets/**',
  '**/rag/**',
];

const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;
const BATCH_SIZE = 20;

// ============ Types ============

interface DocChunk {
  id: string;
  text: string;
  metadata: {
    filePath: string;
    title: string;
    heading: string;
    chunkIndex: number;
    fileHash: string;
  };
}

// ============ Markdown Parsing ============

function stripFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const parsed = matter(content);
  return { data: parsed.data as Record<string, unknown>, content: parsed.content };
}

function extractTitle(frontmatter: Record<string, unknown>, content: string, filePath: string): string {
  if (frontmatter.title && typeof frontmatter.title === 'string') {
    return frontmatter.title;
  }
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  return basename(filePath, extname(filePath));
}

function splitByHeadings(content: string): { heading: string; text: string }[] {
  const sections: { heading: string; text: string }[] = [];
  const lines = content.split('\n');
  let currentHeading = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      if (currentLines.length > 0) {
        const text = currentLines.join('\n').trim();
        if (text) sections.push({ heading: currentHeading, text });
      }
      currentHeading = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    const text = currentLines.join('\n').trim();
    if (text) sections.push({ heading: currentHeading, text });
  }

  return sections;
}

function chunkText(text: string, maxSize: number, overlap: number): string[] {
  if (text.length <= maxSize) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxSize;
    if (end < text.length) {
      const lastNewline = text.lastIndexOf('\n', end);
      if (lastNewline > start + maxSize / 2) {
        end = lastNewline;
      }
    } else {
      end = text.length;
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
    if (start < 0) start = 0;
    if (end === text.length) break;
  }

  return chunks.filter(c => c.length > 0);
}

function fileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex');
}

// ============ Document Processing ============

function processFile(absolutePath: string): DocChunk[] {
  const relativePath = relative(PROJECT_ROOT, absolutePath);
  const raw = readFileSync(absolutePath, 'utf-8');
  const hash = fileHash(absolutePath);
  const { data: frontmatter, content } = stripFrontmatter(raw);
  const title = extractTitle(frontmatter, content, absolutePath);
  const sections = splitByHeadings(content);

  const chunks: DocChunk[] = [];

  for (let s = 0; s < sections.length; s++) {
    const section = sections[s];
    const textChunks = chunkText(section.text, CHUNK_SIZE, CHUNK_OVERLAP);
    for (let i = 0; i < textChunks.length; i++) {
      const chunkId = `${relativePath}::${s}:${section.heading || 'root'}::${i}`;
      chunks.push({
        id: chunkId,
        text: textChunks[i],
        metadata: {
          filePath: relativePath,
          title,
          heading: section.heading || title,
          chunkIndex: i,
          fileHash: hash,
        },
      });
    }
  }

  return chunks;
}

// ============ Ollama Embedding ============

async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (const text of texts) {
    const resp = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
    });

    if (!resp.ok) {
      throw new Error(`Ollama embedding failed: ${resp.status} ${await resp.text()}`);
    }

    const data = (await resp.json()) as { embedding: number[] };
    embeddings.push(data.embedding);
  }

  return embeddings;
}

// ============ ChromaDB Storage ============

async function storeChunks(chunks: DocChunk[]): Promise<void> {
  const client = new ChromaClient({ path: CHROMA_HOST });

  const isClean = process.argv.includes('--clean');
  if (isClean) {
    try {
      await client.deleteCollection({ name: COLLECTION_NAME });
      console.log(`Deleted existing collection: ${COLLECTION_NAME}`);
    } catch {
      // Collection may not exist
    }
  }

  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { 'hnsw:space': 'cosine' },
  });

  const existingItems = await collection.get();
  const existingHashes = new Map<string, string>();
  if (existingItems.ids.length > 0 && existingItems.metadatas) {
    for (let i = 0; i < existingItems.ids.length; i++) {
      const meta = existingItems.metadatas[i];
      if (meta?.filePath && meta?.fileHash) {
        existingHashes.set(meta.filePath as string, meta.fileHash as string);
      }
    }
  }

  const newChunks = chunks.filter(chunk => {
    const existingHash = existingHashes.get(chunk.metadata.filePath);
    return existingHash !== chunk.metadata.fileHash;
  });

  if (newChunks.length === 0) {
    console.log('All documents are up to date, no indexing needed.');
    return;
  }

  const filesToUpdate = new Set(newChunks.map(c => c.metadata.filePath));
  if (existingItems.ids.length > 0 && existingItems.metadatas) {
    const idsToDelete: string[] = [];
    for (let i = 0; i < existingItems.ids.length; i++) {
      const meta = existingItems.metadatas[i];
      if (meta?.filePath && filesToUpdate.has(meta.filePath as string)) {
        idsToDelete.push(existingItems.ids[i]);
      }
    }
    if (idsToDelete.length > 0) {
      await collection.delete({ ids: idsToDelete });
      console.log(`Removed ${idsToDelete.length} outdated chunks`);
    }
  }

  console.log(`Indexing ${newChunks.length} chunks from ${filesToUpdate.size} files...`);

  for (let i = 0; i < newChunks.length; i += BATCH_SIZE) {
    const batch = newChunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(c => c.text);

    process.stdout.write(`  Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(newChunks.length / BATCH_SIZE)}...`);
    const embeddings = await embedTexts(texts);
    console.log(' done');

    await collection.add({
      ids: batch.map(c => c.id),
      embeddings,
      documents: texts,
      metadatas: batch.map(c => c.metadata),
    });
  }

  const finalCount = await collection.count();
  console.log(`Indexing complete. Total chunks in collection: ${finalCount}`);
}

// ============ Main ============

async function main(): Promise<void> {
  console.log('=== RAG Document Indexer ===');
  console.log(`Project root: ${PROJECT_ROOT}`);
  console.log(`ChromaDB: ${CHROMA_HOST}`);
  console.log(`Embedding model: ${EMBEDDING_MODEL}`);
  console.log();

  const mdFiles = await glob('interview/**/*.md', {
    cwd: PROJECT_ROOT,
    ignore: EXCLUDE_PATTERNS,
    absolute: true,
  });

  console.log(`Found ${mdFiles.length} markdown files`);

  const allChunks: DocChunk[] = [];
  let skipped = 0;

  for (const file of mdFiles) {
    try {
      const stat = statSync(file);
      if (stat.size === 0) {
        skipped++;
        continue;
      }
      const chunks = processFile(file);
      if (chunks.length > 0) {
        allChunks.push(...chunks);
      }
    } catch (err) {
      console.warn(`Warning: Failed to process ${relative(PROJECT_ROOT, file)}: ${(err as Error).message}`);
      skipped++;
    }
  }

  console.log(`Processed into ${allChunks.length} chunks (${skipped} files skipped)`);
  console.log();

  await storeChunks(allChunks);
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

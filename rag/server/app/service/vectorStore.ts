import { Service } from 'egg';
import { ChromaClient, Collection } from 'chromadb';

interface SearchResult {
  id: string;
  document: string;
  metadata: {
    filePath: string;
    title: string;
    heading: string;
    chunkIndex: number;
  };
  distance: number;
}

export default class VectorStoreService extends Service {
  private client: ChromaClient | null = null;
  private collection: Collection | null = null;

  private getClient(): ChromaClient {
    if (!this.client) {
      this.client = new ChromaClient({ path: this.config.chromadb.host });
    }
    return this.client;
  }

  private async getCollection(): Promise<Collection> {
    if (!this.collection) {
      const client = this.getClient();
      this.collection = await client.getOrCreateCollection({
        name: this.config.chromadb.collection,
        metadata: { 'hnsw:space': 'cosine' },
      });
    }
    return this.collection;
  }

  async search(embedding: number[], topK: number): Promise<SearchResult[]> {
    const collection = await this.getCollection();

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
    });

    if (!results.ids[0] || results.ids[0].length === 0) {
      return [];
    }

    const searchResults: SearchResult[] = [];
    for (let i = 0; i < results.ids[0].length; i++) {
      searchResults.push({
        id: results.ids[0][i],
        document: results.documents[0]?.[i] || '',
        metadata: {
          filePath: (results.metadatas[0]?.[i]?.filePath as string) || '',
          title: (results.metadatas[0]?.[i]?.title as string) || '',
          heading: (results.metadatas[0]?.[i]?.heading as string) || '',
          chunkIndex: (results.metadatas[0]?.[i]?.chunkIndex as number) || 0,
        },
        distance: results.distances?.[0]?.[i] || 0,
      });
    }

    return searchResults;
  }
}

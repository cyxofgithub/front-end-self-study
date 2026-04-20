import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
const logEl = document.getElementById('log');
const compressButton = document.getElementById('compressBtn');
const watermarkButton = document.getElementById('watermarkBtn');

function log(message) {
    logEl.textContent += `${message}\n`;
    logEl.scrollTop = logEl.scrollHeight;
}

function downloadFile(data, fileName, mimeType) {
    const blob = new Blob([data.buffer ?? data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
}

ffmpeg.on('log', ({ message }) => log(message));

let loaded = false;
async function ensureLoaded() {
    if (loaded) return;

    const coreAssetURL = '/ffmpeg/ffmpeg-core.js';
    const wasmAssetURL = '/ffmpeg/ffmpeg-core.wasm';

    const coreURL = await toBlobURL(coreAssetURL, 'text/javascript');
    const wasmURL = await toBlobURL(wasmAssetURL, 'application/wasm');

    log('加载 WASM 核心...');
    await ffmpeg.load({ coreURL, wasmURL });
    loaded = true;

    log('加载完成');
}

async function compressVideo() {
    const videoInput = document.getElementById('videoInput');
    const file = videoInput?.files?.[0];
    if (!file) {
        alert('请先选择视频文件');
        return;
    }

    try {
        await ensureLoaded();
        log('开始压缩...');

        await ffmpeg.writeFile('input.mp4', await fetchFile(file));
        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-c:v',
            'libx264',
            '-crf',
            '28',
            '-preset',
            'medium',
            '-c:a',
            'aac',
            '-b:a',
            '128k',
            'output_compressed.mp4',
        ]);

        const data = await ffmpeg.readFile('output_compressed.mp4');
        downloadFile(data, '压缩后的视频.mp4', 'video/mp4');
        log('压缩完成，已下载');

        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('output_compressed.mp4');
    } catch (error) {
        log(`错误: ${error.message}`);
        alert(error.message);
    }
}

async function addWatermark() {
    const videoInput = document.getElementById('videoInput2');
    const watermarkInput = document.getElementById('watermarkInput');
    const videoFile = videoInput?.files?.[0];
    const watermarkFile = watermarkInput?.files?.[0];

    if (!videoFile || !watermarkFile) {
        alert('请同时选择视频和水印图片');
        return;
    }

    try {
        await ensureLoaded();
        log('开始添加水印...');

        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
        await ffmpeg.writeFile('watermark.png', await fetchFile(watermarkFile));
        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-i',
            'watermark.png',
            '-filter_complex',
            '[0:v][1:v]overlay=main_w-overlay_w-10:main_h-overlay_h-10',
            '-c:a',
            'copy',
            'output_watermark.mp4',
        ]);

        const data = await ffmpeg.readFile('output_watermark.mp4');
        downloadFile(data, '带水印的视频.mp4', 'video/mp4');
        log('水印添加完成，已下载');

        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('watermark.png');
        await ffmpeg.deleteFile('output_watermark.mp4');
    } catch (error) {
        log(`错误: ${error.message}`);
        alert(error.message);
    }
}

compressButton?.addEventListener('click', compressVideo);
watermarkButton?.addEventListener('click', addWatermark);

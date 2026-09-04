const wabt = require('wabt');
const fs = require('fs');
const path = require('path');

const watFiles = ['add.wat', 'multiply.wat', 'max.wat'];

async function build() {
  const wabtApi = await wabt();
  const dir = __dirname;

  for (const watFile of watFiles) {
    const watPath = path.join(dir, watFile);
    const wasmFile = watFile.replace('.wat', '.wasm');
    const wasmPath = path.join(dir, wasmFile);

    const watSource = fs.readFileSync(watPath, 'utf8');
    const module = wabtApi.parseWat(watPath, watSource);
    const { buffer } = module.toBinary({});
    fs.writeFileSync(wasmPath, Buffer.from(buffer));
    console.log(`Compiled ${watFile} -> ${wasmFile}`);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

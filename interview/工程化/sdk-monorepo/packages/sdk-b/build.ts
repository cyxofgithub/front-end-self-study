#!/usr/bin/env tsx
import { rollup } from 'rollup'
import config from './rollup.config'

async function build() {
  const cfg = config
  const bundle = await rollup(cfg)
  
  if (cfg.output) {
    const outputs = Array.isArray(cfg.output) ? cfg.output : [cfg.output]
    for (const output of outputs) {
      await bundle.write(output)
    }
  }
  
  await bundle.close()
}

build().catch(console.error)

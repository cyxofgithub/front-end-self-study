#!/usr/bin/env tsx
import { rollup, type RollupOptions } from 'rollup'
import config from './rollup.config'

async function build() {
  const configs = Array.isArray(config) ? config : [config]
  
  for (const cfg of configs) {
    const bundle = await rollup(cfg as RollupOptions)
    if (Array.isArray(cfg.output)) {
      for (const output of cfg.output) {
        await bundle.write(output)
      }
    } else if (cfg.output) {
      await bundle.write(cfg.output)
    }
    await bundle.close()
  }
}

build().catch(console.error)

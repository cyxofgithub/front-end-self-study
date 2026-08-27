#!/bin/zsh

set -euo pipefail

project_dir="/Users/chenyuanxin/Desktop/cache/front-end-self-study"
node_dir="/Users/chenyuanxin/.nvm/versions/node/v22.22.1/bin"
pnpm_dir="/Users/chenyuanxin/Library/pnpm"

export PATH="$node_dir:$pnpm_dir:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
cd "$project_dir"
exec pnpm dev

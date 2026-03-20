## pnpm 设计原理

### 软硬链接的区别

| 特性             | 硬链接（Hard Link）                                  | 软链接（Symbolic Link / 软链）                            |
|------------------|-----------------------------------------------------|----------------------------------------------------------|
| 指向对象         | 具体文件（不能指向目录，跨文件系统也不行）           | 文件 / 目录都可以（支持跨文件系统）                       |
| 本质             | 给源文件新增一个“文件别名”，共享同一个 inode         | 一个独立的小文件，记录的是源路径的字符串                  |
| 寻址逻辑         | 直接指向磁盘数据，无路径跳转                         | 按记录的路径间接寻址，需解析源路径                        |
| 依赖树适配性     | 仅能复用文件，无法构建目录级的依赖关系               | 可灵活链接不同目录，构建任意嵌套的依赖树                  |
| Node 解析兼容性 | 无法适配 Node 的模块查找规则                        | 完美适配 Node 对 node_modules 的解析逻辑                  |

### pnpm 硬链接与软连接 的组织关系

.pnpm 下的文件用硬链接链接全局仓库，node_modules 用 软连接连接 .pnpm 下的目录

```plaintext
your-project/
├── node_modules/                  # 根目录，仅放显式依赖的软链（无幽灵依赖）
│   ├── react -> ./.pnpm/react@18.2.0/node_modules/react  # 软链：指向虚拟存储的 react 目录
│   └── react-dom -> ./.pnpm/react-dom@18.2.0/node_modules/react-dom  # 软链：指向虚拟存储的 react-dom 目录
│
├── .pnpm/                         # 虚拟存储目录：所有包的硬链+依赖软链都在这里
│   ├── react@18.2.0/              # react 版本隔离目录
│   │   └── node_modules/
│   │       ├── react/             # react 包目录（内部文件全是硬链）
│   │       │   ├── index.js 🔗 ~/.pnpm-store/v3/files/xx/xxx...  # 硬链：指向全局存储的文件
│   │       │   ├── package.json 🔗 ~/.pnpm-store/v3/files/yy/yyy...
│   │       │   └── ...（所有文件均为硬链）
│   │       └── loose-envify -> ../../loose-envify@1.4.0/node_modules/loose-envify  # 软链：复用子依赖
│   │
│   ├── react-dom@18.2.0/          # react-dom 版本隔离目录
│   │   └── node_modules/
│   │       ├── react-dom/         # react-dom 包目录（内部文件全是硬链）
│   │       │   ├── index.js 🔗 ~/.pnpm-store/v3/files/zz/zzz...
│   │       │   └── ...
│   │       ├── react -> ../../react@18.2.0/node_modules/react  # 软链：复用已有的 react
│   │       └── loose-envify -> ../../loose-envify@1.4.0/node_modules/loose-envify  # 软链：复用子依赖
│   │
│   └── loose-envify@1.4.0/        # loose-envify 版本隔离目录
│       └── node_modules/
│           └── loose-envify/      # loose-envify 包目录（内部文件全是硬链）
│               ├── index.js 🔗 ~/.pnpm-store/v3/files/aa/aaa...
│               └── ...
│
└── ~/.pnpm-store/                 # 全局内容寻址存储（所有项目共享）
    └── v3/files/
        ├── xx/xxx...（react 的文件哈希目录）
        ├── yy/yyy...（react 的 package.json 哈希目录）
        ├── zz/zzz...（react-dom 的文件哈希目录）
        └── aa/aaa...（loose-envify 的文件哈希目录）
```

**为什么要区分硬链接与软连接？**

硬链接无法直接指向目录，而 node_modules 包的查找规则需要通过目录查询

### yarn、npm 设计的时候为什么用扁平化的方式

解决路径过长（旧系统有长度限制），依赖重复安装问题

# 文档索引

## 前端文档
`frontend/architecture.md` - 官网前端架构、目录结构与工程约束，修改任何前端代码时必读

## 全局重要记忆
- 本机存在两个 node：`/opt/homebrew/bin/node`（arm64 v25.5）与 `/usr/local/bin/node`（x64 v22.19，Rosetta）。服务类进程（hub start）可能解析到 x64 版，导致 rolldown 等原生绑定缺失报错；启动 vite 相关服务时显式使用 `/opt/homebrew/bin/node`。
- 官网 `base: './'` 相对路径构建；vite preview 只监听 IPv6 localhost，端口探测用 `localhost` 而非 `127.0.0.1`。

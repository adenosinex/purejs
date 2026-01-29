# PureJS 项目 — Vercel 部署说明

包含两个独立小项目：

- /magnet/ — 磁力复制器（静态，可直接使用）
- /fitness/ — 运动记录生成器（带内置默认运动列表，静态可用）

部署建议：
1. 将仓库连接到 Vercel（Import Project）。
2. 选择框架: "Other" 或静态站点，**不需要构建命令**（或留空）。
3. 输出目录设为 `/` 即可。

说明：
- 我已把依赖脚本改为 CDN 链接，确保在 Vercel 上静态可用。
- 如果你有后端 API（/api/fitness/exercises），Vercel 可通过 Serverless Function 提供；当前项目在无法访问 API 时会使用本地默认数据以保持可用性。
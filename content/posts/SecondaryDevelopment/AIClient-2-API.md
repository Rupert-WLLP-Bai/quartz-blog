## 二次开发功能

### 1. Kiro 账号剩余额度查询
**开发时间**: 2026.01.16 19:00

**功能描述**:
- 批量查询 Kiro 凭证池中所有账号的使用情况
- 显示每个账号的使用量、限额、使用百分比和区域信息
- 使用 Go 语言实现，支持并发查询提升性能
- 编译为独立二进制文件（8MB），无需额外依赖

**技术实现**:
- Goroutine 异步并发请求 API
- 遍历 `configs/kiro/` 目录下的凭证文件
- 实现简洁的 CLI 界面，使用表格展示结果

**使用方式**:
```bash
npm run kiro:usage
```

---

### 2. API 请求统计与分析看板
**开发时间**: 2026.01.16 22:00

**功能描述**:
- 实时收集和分析所有 API 请求的统计数据
- 追踪模型调用次数、Token 使用量、成本估算
- 按账号 UUID 统计使用情况，支持账号排名
- 提供 Web 可视化看板，实时展示统计数据

**核心功能**:
- **请求日志记录**: 记录每个请求的模型、Token、耗时、状态
- **Token 趋势分析**: 1 分钟粒度的 Token 使用趋势图（展示过去 1 小时）
- **成本估算**: 基于 Claude 4.5 系列定价自动计算成本
- **账号排名**: 按使用量对 Provider 账号进行排名
- **实时监控**: WebSocket 推送最新请求数据
- **时区支持**: 显示时间自动转换为 UTC+8（北京时间）

**技术架构**:

*数据收集层*:
- `src/handlers/request-handler.js`: 请求拦截入口，生成 `statsRequestId`
- `src/utils/common.js`: Token 提取和记录，解析 Claude `message_delta` 事件
- `src/services/stats-collector.js`: 统计收集器，批量异步写入避免阻塞主服务

*数据存储层*:
- `src/services/stats-database.js`: SQLite3 数据库模块
  - `request_logs` 表: 存储每个请求的详细信息
  - `provider_usage_ranking` 表: Provider 使用排名
  - `model_pricing` 表: 模型定价配置（Claude 4.5 系列）
- 数据库文件位置: `data/stats.db`

*可视化层*:
- `analytics/dashboard/server.js`: Express + WebSocket 服务器（端口 3001）
  - API 端点: `/api/stats/summary`, `/api/stats/models`, `/api/stats/tokens/trend` 等
  - WebSocket: 实时推送新请求事件
- `analytics/dashboard/public/`: 前端页面
  - Chart.js 实现数据可视化
  - 支持暗色主题切换
  - Flatpickr 日期选择器支持自定义时间范围

**使用方式**:
```bash
# 启动主服务（收集数据）
npm start

# 启动看板服务（查看数据）
cd analytics/dashboard
npm install
npm start

# 访问 http://localhost:3001
```

**分支管理**:
- Fork 上游仓库到个人仓库
- 创建 `feat/log-tracking` 功能分支
- 创建 `feature/dashboard-ux-overhaul` 分支改进 UX
- 合并到 `dev` 分支进行开发测试
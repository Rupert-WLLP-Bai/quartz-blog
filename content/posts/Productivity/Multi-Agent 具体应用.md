---
title: Multi-Agent 具体应用
date: 2026-01-17
tags:
  - AI
  - Agent
  - Productivity
  - OpenSource
  - Tools
  - Automation
  - OpenCode
---
## git worktree 配合多 agent

### 使用场景
在不同目录下同时 checkout 一个 repo 的多个分支，让多个 agent 同时实现 feature 或做 hotfix。相比传统的 `git stash` 工作流，worktree 更适合多任务并行。

### 核心优势
- **共享对象数据库**：节省磁盘空间，所有 worktree 共享 `.git/objects`
- **独立工作目录**：每个文件夹有不同的 HEAD，指向不同分支
- **环境隔离**：编译产物（如 `node_modules`、`target`）互不影响

### 常用命令
```bash
git worktree add ../feature-x feature-x    # 创建新工作树
git worktree list                          # 查看所有工作树
git worktree remove ../feature-x           # 删除工作树
```

### 存储机制

|**类别**|**内容**|**存储位置**|**作用**|
|---|---|---|---|
|**共享区**|Objects, Refs, Config|`.git/objects/`, `.git/refs/`|所有 Agent 共享历史记录、远程分支、提交记录|
|**隔离区**|HEAD|`.git/worktrees/<name>/HEAD`|每个工作树指向不同分支，实现并行开发|
|**隔离区**|Index (Staging Area)|`.git/worktrees/<name>/index`|独立暂存区，互不干扰|
|**隔离区**|Logs|`.git/worktrees/<name>/logs/HEAD`|记录各自的操作历史（Reflog）|

### 并发安全
- **分支锁定**：不能在两个工作树 checkout 同一分支
- **独立索引**：每个工作树有独立的 index 文件
- **GC 安全**：垃圾回收时会考虑所有工作树的引用

### 最佳实践
- 将 worktree 放在项目根目录的上一级，避免 IDE 扫描大量重复代码
- 为不同 feature 创建独立分支（如 `feature/xxx`），完成后再 merge

## oh my opencode
### 1. Sisyphus 的设计
简单来说可以理解为一个多agent的合作系统
![[file-2026-01-18-12-06-58-557.png]]

### 2. ultrawork模式是怎么做的，为什么需要这样设计的

## claude code subagent
https://github.com/VoltAgent/awesome-claude-code-subagents?tab=readme-ov-file
提示词是怎么做的

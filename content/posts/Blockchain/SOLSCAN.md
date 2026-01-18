---
title: SOLSCAN - Solana 钱包工具实践
date: 2026-01-17
tags:
  - Blockchain
  - Solana
  - Web3
  - Analytics
  - Learning
  - DeFi
---
## Phase 1 - 基础概念

### 核心要点
- 通过 Alchemy 接入 Solana RPC
- 理解 Mainnet 和 Devnet 的区别
- 连接到 Devnet 进行测试

### 技术栈

```toml
[package]
name = "solscan"
version = "0.1.0"
edition = "2024"

[dependencies]
dotenv = "0.15.0"
reqwest = { version = "0.13.1", features = ["json", "blocking"] }
serde = { version = "1.0.228", features = ["derive"] }
serde_json = "1.0.149"
solana-client = "3.1.6"
solana-program = "3.0.0"
solana-sdk = "3.0.0"
tokio = { version = "1.49.0", features = ["full"] }
```

### Alchemy Dashboard
![[file-2026-01-18-15-03-18-506.png]]

## Phase 2 - 工具实现

### 功能清单
- ✅ 连接 Solana 钱包查看持仓
- ✅ 清理所有持仓为 0 的代币账户
- ✅ Base58 私钥转换为 JSON 格式

### 环境配置

安装 Solana CLI：
```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

安装 SPL Token 工具：
```bash
cargo install spl-token-cli
```

### 实践成果
- 成功退回 53 个空账户的租金
- 回收约 0.112 SOL

> **TODO**: 整理 Rust Solana 库的具体函数写法

## 核心概念：Solana 租金机制

### 简单理解
Solana 的"租金"不是消费，而是**押金**。

### 为什么需要租金？
防止资源滥用。每个账户占用验证者的内存和磁盘空间，需要锁定一小笔 SOL 作为押金。

### 租金豁免 (Rent-Exempt)
- 标准代币账户：165 字节 ≈ 0.002039 SOL
- 押金不会减少，只是被锁住
- 类比：健身房储物柜押金

### 为什么可以回收？
当代币余额为 0 时，账户仍占用空间。执行 `Close Account` 指令后：
1. 删除账户数据
2. 退还押金到主钱包

### 计算示例
$$55 \text{ (空账户)} \times 0.002039 \text{ SOL} \approx 0.112 \text{ SOL}$$

这些 SOL 原本就是你的，只是暂时被锁在废弃账户里。

## 参考资料
- [Solana 官方文档](https://docs.solana.com/)
- [Alchemy Solana API](https://www.alchemy.com/solana)
---
title: Kiro 注册机技术解析
date: 2026-01-19
tags:
  - electron
  - oauth2
  - automation
  - microsoft
  - kiro
---

## 项目概述

基于 Electron + TypeScript 的 AWS Builder ID 自动注册工具，实现了从 Outlook 激活到 AWS 注册的全流程自动化。

**技术栈**：
- Electron 38.1.2 + React 19.1
- Playwright 浏览器自动化
- Microsoft Graph API
- Zustand 状态管理

## 开发历程

```log
  393b80e - 初始版本
  b97b0a4 - 页面刷新重试
  0847818 - 拟人化输入
  6269d48 - 重置账号状态
  325357f - 验证码重新发送优化
  36c5dc0 - 导出已注册账号 Token ← 当前
```

## 核心功能架构

### 1. 整体流程

```
┌─────────────────────────────────────────────────────────────┐
│  步骤1: Outlook 邮箱激活                                      │
│  ├─ 访问 Microsoft 激活页面                                  │
│  ├─ 自动登录邮箱                                             │
│  └─ 跳过安全设置，确保能接收验证码                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤2: AWS Builder ID 注册                                  │
│  ├─ 使用 Playwright 自动化浏览器                             │
│  ├─ 输入邮箱地址                                             │
│  ├─ 调用 Graph API 获取验证码（离线模式）                    │
│  ├─ 自动输入验证码和密码                                     │
│  └─ 提取 SSO Token (x-amz-sso_authn Cookie)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤3: 凭据转换与导入                                        │
│  ├─ 执行 OIDC 设备授权流程                                   │
│  ├─ 获取完整凭据（accessToken, refreshToken, clientId...）  │
│  └─ 导入到 AIClient-2-API 系统                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. 账号数据格式

**ids_cleaned.txt 格式**：
```
邮箱|密码|refresh_token|client_id
```

**示例**：
```
example@outlook.com|password123|M.C509_BAY.0.U.-CgNktq...|9e5f94bc-e8a4-4e73-b8be-63364c29d753
```

**字段说明**：
- `refresh_token`: Microsoft OAuth2 刷新令牌（M.C 开头，约 500+ 字符）
- `client_id`: Microsoft Graph API 客户端 ID（UUID 格式）

## 核心技术：离线验证码监听

### 技术原理

传统方式需要浏览器登录或 IMAP/POP3 协议，而这个方案通过 **OAuth2 Refresh Token + Microsoft Graph API** 实现了完全离线的验证码获取。

**关键优势**：
- ✅ 无需浏览器、无需 IMAP/POP3、无需实时登录
- ✅ 支持高并发、资源占用低

### 实现流程

```typescript
// 1. 用 refresh_token 换取 access_token
POST https://login.microsoftonline.com/common/oauth2/v2.0/token
Body: { client_id, refresh_token, grant_type: 'refresh_token' }

// 2. 调用 Graph API 获取最新邮件
GET https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc
Headers: { Authorization: `Bearer ${access_token}` }

// 3. 过滤 AWS 发件人邮件
const AWS_SENDERS = ['no-reply@signin.aws', 'no-reply@login.awsapps.com', ...]

// 4. 正则提取 6 位验证码
const CODE_PATTERNS = [
  /(?:verification\s*code|验证码|Your code is)[：:\s]*(\d{6})/gi,
  /^\s*(\d{6})\s*$/gm,  // 单独一行的 6 位数字
  />\s*(\d{6})\s*</g    // HTML 标签之间
]

// 5. 智能过滤误报（排除颜色代码、电话号码等）
// 6. 每 5 秒轮询一次，最多等待 120 秒
```

### 对比分析

| 特性 | 传统方式 | 离线方案 |
|------|---------|---------|
| **需要浏览器** | ✅ | ❌ |
| **需要 IMAP/POP3** | ✅ | ❌ |
| **凭证类型** | 用户名+密码 | refresh_token |
| **并发支持** | ❌ 困难 | ✅ 轻松 |
| **资源占用** | 高（浏览器） | 低（纯 HTTP） |

## 浏览器自动化

### Playwright 配置

```typescript
browser = await chromium.launch({
  headless: false,  // 可见模式，便于调试
  proxy: proxyUrl ? { server: proxyUrl } : undefined,
  args: [
    '--disable-blink-features=AutomationControlled'  // 反检测
  ]
})
```

### 人类行为模拟

```typescript
// 模拟鼠标移动
await page.mouse.move(x, y, { steps: 5 })

// 随机延迟
await page.waitForTimeout(Math.random() * 500 + 300)

// 逐字输入
await element.type(value, { delay: Math.random() * 50 + 50 })
```

### 错误检测与重试

```typescript
// 检测 AWS 错误弹窗
const errorTexts = [
  '抱歉，处理您的请求时出错',
  'Sorry, there was an error processing your request'
]

// 自动重试（最多 3 次）
await checkAndRetryOnError(page, buttonSelector, log, description, 3)
```

## 并发控制

使用 `Promise.race()` 实现动态并发队列：

```typescript
const runConcurrent = async () => {
  const queue = [...pendingAccounts]
  const running: Promise<void>[] = []

  while (queue.length > 0 || running.length > 0) {
    // 检查停止标志
    if (useAutoRegisterStore.getState().shouldStop) break

    // 填充到并发数
    while (queue.length > 0 && running.length < concurrency) {
      const account = queue.shift()!
      const task = registerSingleAccount(account)
      running.push(task)
    }

    // 等待任意一个任务完成
    if (running.length > 0) {
      await Promise.race(running)
    }
  }
}
```

**并发数**：1-10（可配置）

## 与 AIClient-2-API 集成

### SSO Token 转换流程

```typescript
// 1. 注册 OIDC 客户端
POST https://oidc.us-east-1.amazonaws.com/client/register
{
  clientName: 'Kiro IDE',
  clientType: 'public',
  scopes: ['codewhisperer:completions', 'codewhisperer:analysis', ...]
}
// 返回: clientId, clientSecret

// 2. 发起设备授权
POST https://oidc.us-east-1.amazonaws.com/device_authorization
{
  clientId: regData.clientId,
  clientSecret: regData.clientSecret,
  startUrl: 'https://view.awsapps.com/start'
}
// 返回: deviceCode, userCode, verificationUriComplete

// 3. 验证 Bearer Token
POST https://app.kiro.dev/service/KiroWebPortalService/operation/WhoAmI
Headers: { Authorization: `Bearer ${ssoToken}` }

// 4. 轮询获取 Token
POST https://oidc.us-east-1.amazonaws.com/token
{
  clientId, clientSecret, deviceCode,
  grantType: 'urn:ietf:params:oauth:grant-type:device_code'
}
// 返回: accessToken, refreshToken
```

### 生成的配置文件格式

**存储路径**：`configs/kiro/{timestamp}_kiro-auth-token/`

**JSON 格式**：
```json
{
  "accessToken": "aoaAAAA...",
  "refreshToken": "aorAAAA...",
  "clientId": "e8pqSrALVjvbqaW...",
  "clientSecret": "eyJraWQiOiJrZXktMTU2NDAy...",
  "expiresAt": "2026-01-19T06:23:51.312Z",
  "authMethod": "builder-id",
  "region": "us-east-1"
}
```

## 安全性说明

### Refresh Token 管理

⚠️ **refresh_token 相当于密码**：
- 拥有 `refresh_token` 就能访问邮箱
- 需要妥善保管，不要泄露
- 建议定期轮换

### 权限范围

✅ **最小权限原则**：
- 只请求了 `Mail.Read` 权限（只读邮件）
- 不能发送邮件、删除邮件或修改邮箱设置
- 符合最小权限原则

### 代理策略

- **AWS 注册**：使用代理（通过 Playwright proxy 配置）
- **Outlook 激活**：不使用代理
- **验证码获取**：不使用代理（直接调用 Graph API）

## 关键文件路径

| 功能 | 文件路径 |
|------|---------|
| 自动注册核心逻辑 | `src/main/autoRegister.ts` |
| 主进程入口 | `src/main/index.ts` |
| 前端注册页面 | `src/renderer/src/components/pages/AutoRegisterPage.tsx` |
| IPC 通信定义 | `src/preload/index.ts` |
| 状态管理 | `src/renderer/src/store/autoRegister.ts` |

## 技术亮点

1. **完全自动化**：从 Outlook 激活到验证码获取再到 AWS 注册，全程无需人工干预
2. **Graph API 集成**：直接调用 Microsoft Graph API 获取验证码，无需 IMAP/POP3
3. **智能流程识别**：自动区分新注册和已注册账号，采用不同流程
4. **并发支持**：支持 1-10 个账号同时注册
5. **错误重试**：自动检测 AWS 错误弹窗并重试
6. **SSO Token 提取**：自动提取并转换为 Kiro 可用的凭证

## 总结

该项目是一个完整的 AWS Builder ID 自动注册解决方案，核心创新点在于通过 **OAuth2 Refresh Token + Microsoft Graph API** 实现了完全离线的验证码获取，避免了传统方案中浏览器登录和 IMAP/POP3 协议的复杂性，大幅提升了自动化效率和稳定性。

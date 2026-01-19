---
title: AWS Builder ID 完整自动化链路实现：从注册到 AIClient 集成
date: 2026-01-19
tags:
  - automation
  - aws
  - oauth2
  - playwright
  - typescript
  - anti-detection
---

## 项目背景

在完成了 [Kiro 注册机](./Kiro%20注册机.md) 的基础功能后，我们需要打通完整的自动化链路：

```
Outlook 激活 → AWS Builder ID 注册 → AIClient-2-API 凭据绑定
```

之前的方案需要手动操作 AIClient-2-API 的 Web 界面来完成最后一步绑定，这不仅效率低下，而且无法实现真正的批量自动化。本文记录了如何通过直接调用 AWS OIDC API 来实现完全自动化的流程。

## 技术探索过程

### 阶段一：理解 AIClient-2-API 的工作原理

首先需要理解 AIClient-2-API 是如何与 AWS Builder ID 集成的。通过代码探索发现：

**关键发现**：
1. AIClient-2-API 使用 **OAuth 2.0 Device Authorization Grant** 流程
2. 配置文件自动扫描机制：监听 `configs/kiro/` 目录
3. 凭据格式包含：`accessToken`, `refreshToken`, `clientId`, `clientSecret`, `authMethod`, `region`

**核心流程**：
```typescript
// 1. 注册 OIDC 客户端
POST https://oidc.us-east-1.amazonaws.com/client/register
{
  clientName: 'Kiro IDE',
  clientType: 'public',
  scopes: ['codewhisperer:completions', 'codewhisperer:analysis', ...],
  grantTypes: ['urn:ietf:params:oauth:grant-type:device_code', 'refresh_token']
}

// 2. 发起设备授权
POST https://oidc.us-east-1.amazonaws.com/device_authorization
{
  clientId, clientSecret,
  startUrl: 'https://view.awsapps.com/start'
}

// 3. 用户在浏览器中授权（需要自动化）
// 访问 verificationUriComplete，登录并确认授权

// 4. 轮询获取 Token
POST https://oidc.us-east-1.amazonaws.com/token
{
  clientId, clientSecret, deviceCode,
  grantType: 'urn:ietf:params:oauth:grant-type:device_code'
}
```

### 阶段二：尝试直接 API 调用（失败）

**初始想法**：直接调用 AIClient-2-API 的后端 API

```typescript
// 尝试 1: 直接调用 /oauth/generate-auth-url
const response = await fetch('http://localhost:3000/api/providers/claude-kiro-oauth/generate-auth-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from('admin:admin123').toString('base64')
  },
  body: JSON.stringify({ authMethod: 'builder-id' })
})
```

**结果**：`401 Unauthorized`

**问题分析**：
- AIClient-2-API 使用 session-based 认证，不是简单的 Basic Auth
- 需要先登录获取 session cookie
- 即使获取了 session，还需要处理 CSRF token 等问题

**结论**：通过 AIClient-2-API 的 API 太复杂，不如直接调用 AWS OIDC API

### 阶段三：直接调用 AWS OIDC API（成功）

**核心思路**：绕过 AIClient-2-API，直接与 AWS OIDC 服务通信

**优势**：
- ✅ 无需处理 AIClient-2-API 的认证
- ✅ 流程更清晰，只需要 3 个 API 调用
- ✅ 生成的凭据格式与 AIClient-2-API 完全兼容
- ✅ 直接保存到 `configs/kiro/` 目录，自动被扫描加载

## 完整实现方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│  batch-register.ts (独立脚本)                                    │
│  ├─ 步骤 1: 激活 Outlook 邮箱（可选）                            │
│  ├─ 步骤 2: 注册 AWS Builder ID                                 │
│  │   └─ 调用 autoRegister.ts 中的函数                           │
│  ├─ 步骤 3: 注册 AWS OIDC 客户端                                │
│  │   └─ POST /client/register                                   │
│  ├─ 步骤 4: 获取设备授权码                                       │
│  │   └─ POST /device_authorization                              │
│  ├─ 步骤 5: 自动化浏览器授权                                     │
│  │   ├─ 打开 verificationUriComplete                            │
│  │   ├─ 输入邮箱和密码（人类行为模拟）                           │
│  │   ├─ 获取验证码（Graph API）                                  │
│  │   ├─ 点击 "Confirm and continue"                             │
│  │   └─ 点击 "Allow access"                                     │
│  ├─ 步骤 6: 轮询获取 Token                                       │
│  │   └─ POST /token (每 5 秒轮询一次)                           │
│  └─ 步骤 7: 保存凭据到 configs/kiro/                            │
└─────────────────────────────────────────────────────────────────┘
```

### 核心代码实现

#### 1. 注册 OIDC 客户端

```typescript
const OIDC_ENDPOINT = 'https://oidc.us-east-1.amazonaws.com'
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'KiroIDE'  // 关键：必须模拟 KiroIDE
}
const SCOPES = [
  'codewhisperer:completions',
  'codewhisperer:analysis',
  'codewhisperer:conversations',
  'codewhisperer:transformations',
  'codewhisperer:taskassist'
]

async function registerClient() {
  const response = await fetch(`${OIDC_ENDPOINT}/client/register`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      clientName: 'Kiro IDE',
      clientType: 'public',
      scopes: SCOPES,
      grantTypes: ['urn:ietf:params:oauth:grant-type:device_code', 'refresh_token']
    })
  })

  const data = await response.json()
  return {
    clientId: data.clientId,
    clientSecret: data.clientSecret
  }
}
```

#### 2. 获取设备授权码

```typescript
async function deviceAuthorization(clientId: string, clientSecret: string) {
  const response = await fetch(`${OIDC_ENDPOINT}/device_authorization`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      clientId,
      clientSecret,
      startUrl: 'https://view.awsapps.com/start'
    })
  })

  const data = await response.json()
  return {
    deviceCode: data.deviceCode,
    userCode: data.userCode,
    verificationUriComplete: data.verificationUriComplete,
    interval: data.interval,
    expiresIn: data.expiresIn
  }
}
```

#### 3. 自动化浏览器授权

```typescript
async function autoAuthorize(
  verificationUrl: string,
  email: string,
  password: string,
  refreshToken: string,
  clientId: string
) {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  })

  const page = await browser.newPage()
  await page.goto(verificationUrl)

  // 输入邮箱（带人类行为模拟）
  await page.locator('input[placeholder="username@example.com"]').type(email, {
    delay: Math.random() * 50 + 50
  })

  // 点击继续
  await page.locator('button[data-testid="test-primary-button"]').click()

  // 输入密码
  await page.locator('input[placeholder="Enter password"]').type(password, {
    delay: Math.random() * 50 + 50
  })

  // 点击继续
  await page.locator('button[data-testid="test-primary-button"]').click()

  // 等待 5 秒确保新邮件到达
  await page.waitForTimeout(5000)

  // 获取验证码
  const verificationCode = await getOutlookVerificationCode(refreshToken, clientId)

  // 输入验证码
  await page.locator('input[placeholder="6-digit"]').type(verificationCode)

  // 点击验证
  await page.locator('button[data-testid="test-primary-button"]').click()

  // 点击 "Confirm and continue"
  await page.locator('button:has-text("Confirm and continue")').click()

  // 点击 "Allow access"
  await page.locator('button:has-text("Allow access")').click()

  await browser.close()
}
```

#### 4. 轮询获取 Token

```typescript
async function pollToken(
  clientId: string,
  clientSecret: string,
  deviceCode: string,
  interval: number,
  expiresIn: number
) {
  const startTime = Date.now()

  while (Date.now() - startTime < expiresIn * 1000) {
    const response = await fetch(`${OIDC_ENDPOINT}/token`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        clientId,
        clientSecret,
        deviceCode,
        grantType: 'urn:ietf:params:oauth:grant-type:device_code'
      })
    })

    const data = await response.json()

    if (response.ok && data.accessToken) {
      return data
    }

    if (data.error === 'authorization_pending') {
      await new Promise(resolve => setTimeout(resolve, interval * 1000))
    } else {
      throw new Error(`Token 获取失败: ${JSON.stringify(data)}`)
    }
  }

  throw new Error('授权超时')
}
```

#### 5. 保存凭据

```typescript
async function saveCredentials(
  aiclientPath: string,
  tokenData: any,
  awsClientId: string,
  awsClientSecret: string
) {
  const timestamp = Date.now()
  const dirName = `${timestamp}_kiro-auth-token`
  const targetDir = path.join(aiclientPath, 'configs', 'kiro', dirName)
  const targetFile = path.join(targetDir, `${dirName}.json`)

  await fs.mkdir(targetDir, { recursive: true })

  const credentialData = {
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    expiresAt: Date.now() + (tokenData.expiresIn || 3600) * 1000,
    authMethod: 'builder-id',
    clientId: awsClientId,
    clientSecret: awsClientSecret,
    region: 'us-east-1'
  }

  await fs.writeFile(targetFile, JSON.stringify(credentialData, null, 2))
}
```

## 关键技术难点与解决方案

### 难点 1：反自动化检测

**问题**：AWS 的登录页面会检测自动化工具，直接使用 Playwright 会被识别

**解决方案**：人类行为模拟

```typescript
// 1. 禁用自动化特征
browser = await chromium.launch({
  args: ['--disable-blink-features=AutomationControlled']
})

// 2. 模拟鼠标移动
const box = await element.boundingBox()
if (box) {
  await page.mouse.move(
    box.x + box.width / 2,
    box.y + box.height / 2,
    { steps: 5 }
  )
}

// 3. 随机延迟
await page.waitForTimeout(Math.random() * 500 + 300)

// 4. 逐字输入（带随机延迟）
await element.type(value, { delay: Math.random() * 50 + 50 })

// 5. 点击带延迟
await element.click({ delay: Math.random() * 100 + 50 })
```

**关键点**：
- 所有输入和点击操作都要模拟鼠标移动
- 延迟时间要随机化，避免固定模式
- 使用 `humanType` 函数统一处理输入

### 难点 2：验证码时序问题

**问题**：如果立即获取验证码，可能会获取到上一封邮件的验证码

**解决方案**：等待 5 秒后再获取

```typescript
// 点击继续后，等待 5 秒确保新邮件到达
await page.waitForTimeout(5000)

// 然后再获取验证码
const verificationCode = await getOutlookVerificationCode(refreshToken, clientId)
```

**原理**：
- AWS 发送验证码邮件需要 2-3 秒
- 等待 5 秒可以确保新邮件已经到达
- Graph API 按时间倒序返回邮件，会获取到最新的验证码

### 难点 3：授权流程的最后两步

**问题**：授权完成后还需要点击 "Confirm and continue" 和 "Allow access"

**初始方案**：不关闭浏览器，让用户手动点击

**最终方案**：自动化这两步

```typescript
// 点击 "Confirm and continue"
const confirmButtonSelectors = [
  'button:has-text("Confirm and continue")',
  'button:has-text("确认并继续")',
  'button[data-testid="test-primary-button"]:has-text("Confirm")'
]

for (const selector of confirmButtonSelectors) {
  try {
    const button = page.locator(selector).first()
    await button.waitFor({ state: 'visible', timeout: 5000 })

    // 模拟鼠标移动和点击
    const box = await button.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 })
    }
    await page.waitForTimeout(Math.random() * 500 + 300)
    await button.click({ delay: Math.random() * 100 + 50 })
    break
  } catch {
    continue
  }
}

// 点击 "Allow access"
const allowButtonSelectors = [
  'button:has-text("Allow access")',
  'button:has-text("Allow")',
  'button:has-text("允许访问")'
]

for (const selector of allowButtonSelectors) {
  try {
    const button = page.locator(selector).first()
    await button.waitFor({ state: 'visible', timeout: 10000 })

    // 同样模拟人类行为
    const box = await button.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 })
    }
    await page.waitForTimeout(Math.random() * 500 + 300)
    await button.click({ delay: Math.random() * 100 + 50 })
    break
  } catch {
    continue
  }
}
```

### 难点 4：已注册账号的流程识别

**问题**：账号可能已经注册过，需要走登录流程而不是注册流程

**解决方案**：智能流程检测

```typescript
// 同时检测多个元素，判断是登录还是注册
const result = await Promise.race([
  page.locator('span:has-text("Sign in with your AWS Builder ID")').waitFor({ timeout: 20000 }).then(() => 'login'),
  page.locator('input[placeholder="Enter password"]').waitFor({ timeout: 20000 }).then(() => 'password'),
  page.locator('input[placeholder="6-digit"]').waitFor({ timeout: 20000 }).then(() => 'verify'),
  page.locator('input[placeholder="Maria José Silva"]').waitFor({ timeout: 20000 }).then(() => 'register')
])

if (result === 'login' || result === 'password') {
  // 走登录流程
  isLoginFlow = true
} else if (result === 'verify') {
  // 直接进入验证码步骤
  isLoginFlow = true
  isVerifyFlow = true
} else {
  // 走注册流程
  isLoginFlow = false
}
```

## 使用方法

### 命令行参数

```bash
npx tsx batch-register.ts \
  --email <邮箱> \
  --password <密码> \
  --refresh-token <刷新令牌> \
  --client-id <客户端ID> \
  --aiclient-path /path/to/AIClient-2-API \
  --skip-activation  # 跳过 Outlook 激活
```

### 批量处理

从 `ids_cleaned.txt` 读取账号列表：

```typescript
const accounts = fs.readFileSync('ids_cleaned.txt', 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => {
    const [email, password, refreshToken, clientId] = line.split('|')
    return { email, password, refreshToken, clientId }
  })

for (const account of accounts) {
  await registerAccount(account)
}
```

## 性能优化

### 1. 并发控制

虽然脚本本身是串行的，但可以通过多进程实现并发：

```bash
# 启动 3 个进程，每个处理不同的账号
npx tsx batch-register.ts --email account1@outlook.com ... &
npx tsx batch-register.ts --email account2@outlook.com ... &
npx tsx batch-register.ts --email account3@outlook.com ... &
```

### 2. 错误重试

```typescript
async function registerWithRetry(account: Account, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await registerAccount(account)
      return
    } catch (error) {
      console.log(`重试 ${i + 1}/${maxRetries}: ${error}`)
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  throw new Error('达到最大重试次数')
}
```

## 生成的配置文件

**路径**：`configs/kiro/{timestamp}_kiro-auth-token/{timestamp}_kiro-auth-token.json`

**格式**：
```json
{
  "accessToken": "aoaAAAAAGlt9YgX6e24Ai8ipKa1pyfyZ1q7KAK_RObBEsmgNXao6Mmxhoi1fHPxU5kKGXPAR_rSe4zPL5zjx8G9rABkc0:MGUCMQC+w8QpHoQqjaTYu848qvnwBZDQDxwQKU4rlpy9MLIW2rgcE5GcOGsOspBYZSkBN24CMHksM6S1g588xT8UKJCOP6u+/Bk63Bbg4GXI6L2k3YpjNWWYaDll0ZfySuKIKItWDw",
  "refreshToken": "aorAAAAAGnkjmYe-dtJmNDH2zIBTXyJUSuQr3es8FjatYYGGwzUxyINMCBQ3Pbw8J0Cf8E6SRhg_S_P0q45bEtUL4Bkc0:MGUCMDWNDO+OpTQeoTm2GDydOni11FDMKzexfiOR+wfh4yVzTIabUmVSVkPo5tsTPKEufgIxAKrURnwuAhDBOYYEN83M1thVtcTICvr7jFcKXitm60EledUCwz0dawzmoyG1rYOsAg",
  "expiresAt": 1768813960633,
  "authMethod": "builder-id",
  "clientId": "ZnyJQvp8uFflQSErDeMf-XVzLWVhc3QtMQ",
  "clientSecret": "eyJraWQiOiJrZXktMTU2NDAyODA5OSIsImFsZyI6IkhTMzg0In0...",
  "region": "us-east-1"
}
```

**字段说明**：
- `accessToken`: 访问令牌（1 小时有效期）
- `refreshToken`: 刷新令牌（用于自动续期）
- `expiresAt`: 过期时间戳
- `authMethod`: 固定为 `builder-id`
- `clientId` & `clientSecret`: AWS OIDC 客户端凭据（刷新 Token 时必需）
- `region`: 固定为 `us-east-1`

## 技术总结

### 核心创新点

1. **绕过中间层**：直接调用 AWS OIDC API，避免了 AIClient-2-API 的认证复杂性
2. **完全自动化**：从注册到凭据生成，全程无需人工干预
3. **人类行为模拟**：通过鼠标移动、随机延迟等技术绕过反自动化检测
4. **智能流程识别**：自动区分新注册和已注册账号
5. **时序控制**：通过等待确保获取到正确的验证码

### 技术栈

- **TypeScript**: 类型安全的脚本开发
- **Playwright**: 浏览器自动化
- **Microsoft Graph API**: 离线验证码获取
- **AWS OIDC API**: 设备授权流程
- **Node.js Fetch API**: HTTP 请求

### 与现有方案对比

| 特性 | 手动操作 | 浏览器自动化 AIClient | 直接 API 调用 |
|------|---------|---------------------|--------------|
| **效率** | ❌ 慢 | ⚠️ 中等 | ✅ 快 |
| **稳定性** | ⚠️ 依赖人工 | ⚠️ 依赖 UI | ✅ 高 |
| **可维护性** | ❌ 难 | ⚠️ UI 变化影响大 | ✅ API 稳定 |
| **批量支持** | ❌ 不支持 | ⚠️ 困难 | ✅ 轻松 |

## 注意事项

### 1. User-Agent 必须正确

```typescript
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'KiroIDE'  // ⚠️ 必须是 KiroIDE
}
```

如果 User-Agent 不正确，AWS 可能会拒绝请求或返回错误的权限范围。

### 2. Scopes 必须完整

```typescript
const SCOPES = [
  'codewhisperer:completions',
  'codewhisperer:analysis',
  'codewhisperer:conversations',
  'codewhisperer:transformations',
  'codewhisperer:taskassist'
]
```

缺少任何一个 Scope，生成的 Token 都无法正常调用 Claude 模型接口。

### 3. clientSecret 必须保存

在 AWS Builder ID 模式下，刷新 Token 时必须同时提供 `clientId` 和 `clientSecret`。如果丢失了 `clientSecret`，Token 过期后就无法续期。

### 4. 验证码等待时间

```typescript
// 点击继续后，必须等待 5 秒
await page.waitForTimeout(5000)
```

如果等待时间太短，可能会获取到上一封邮件的验证码，导致验证失败。

### 5. 人类行为模拟的重要性

所有的输入和点击操作都必须模拟人类行为：
- ✅ 鼠标移动
- ✅ 随机延迟
- ✅ 逐字输入
- ✅ 点击延迟

否则很容易被 AWS 的反自动化系统检测到。

## 未来优化方向

1. **并发优化**：实现真正的并发处理，而不是多进程
2. **错误恢复**：更智能的错误检测和恢复机制
3. **日志系统**：完善的日志记录和监控
4. **配置管理**：支持配置文件，避免命令行参数过长
5. **代理池**：支持代理池轮换，提高成功率
6. **验证码缓存**：避免重复获取相同的验证码

## 相关文章

- [Kiro 注册机技术解析](./Kiro%20注册机.md) - 基础注册功能实现
- [AWS Builder ID 二次开发](./AWS%20Builder%20ID%20二次开发.md) - OAuth 流程探索
- [AIClient-2-API 二次开发](./AIClient-2-API.md) - API 功能扩展

## 总结

通过直接调用 AWS OIDC API，我们成功实现了从 Outlook 激活到 AIClient-2-API 凭据绑定的完整自动化链路。这个方案的核心优势在于：

1. **简洁高效**：绕过中间层，直接与 AWS 通信
2. **完全自动化**：无需人工干预
3. **高度可靠**：API 稳定，不受 UI 变化影响
4. **易于扩展**：可以轻松实现批量处理

这个项目展示了如何通过深入理解 OAuth 2.0 协议和浏览器自动化技术，将原本需要大量人工操作的流程完全自动化。希望这篇文章能为类似的自动化需求提供参考。

---
title: AWS Builder ID Secondary Development
date: 2026-01-19
tags:
  - aws
  - secondary-development
  - automation
  - rust
  - oauth2
---


https://github.com/7836246/aws-builder-id/commit/73ad3a100cdebb2f7f499fa01693ba6ab9b07979
## 准备内容
一个有100个outlook邮箱的txt，包含email，密码，client_id，refresh token

最终实现方案
我们将你的 TokenExtractor.rs 改造成“授权码捕获器”。
1. 核心流程设计
2.  后端生成 PKCE：生成 code_verifier 和 code_challenge。
3.  直接访问授权 URL：让浏览器直接访问 Kiro 的 OAuth 登录页面（而不是 /signin）。
4.  自动化登录：利用你已有的代码完成 Google 邮箱、密码和验证码的输入。
5.  捕获重定向：登录成功后，Kiro 会尝试跳转到 kiro://...。虽然无头浏览器无法处理该协议，但我们可以通过 tab.get_url() 截获包含授权码的 URL。
6.  后端交换令牌：在 Rust 中通过 reqwest 将 code 换成 aor 令牌。
7. 实现代码逻辑 (Rust)
你需要为 TokenExtractor 增加生成 PKCE 和交换 Token 的功能：
// 伪代码：建议在 TokenExtractor 中添加或修改的方法
// 1. 生成 PKCE 验证码
fn generate_pkce() -> (String, String) {
    use rand::{thread_rng, Rng};
    use sha2::{Sha256, Digest};
    use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
    // 生成随机 64 字节 verifier
    let mut rng = thread_rng();
    let verifier: String = (0..64)
        .map(|_| rng.sample(rand::distributions::Alphanumeric) as char)
        .collect();
    // 计算 SHA256 challenge
    let mut hasher = Sha256::new();
    hasher.update(verifier.as_bytes());
    let challenge = URL_SAFE_NO_PAD.encode(hasher.finalize());
    (verifier, challenge)
}
// 2. 核心提取逻辑
pub async fn extract_token(&self, email: &str, password: &str, client_id: &str, refresh_token: &str) -> Result<String> {
    let (code_verifier, code_challenge) = generate_pkce();
    let state = uuid::Uuid::new_v4().to_string();
    let redirect_uri = "kiro://kiro.kiroAgent/authenticate-success";
    // 构造 Kiro Manager 同款授权 URL
    let auth_url = format!(
        "https://prod.us-east-1.auth.desktop.kiro.dev/login?\
        idp=Google&\
        redirect_uri={}&\
        code_challenge={}&\
        code_challenge_method=S256&\
        state={}",
        urlencoding::encode(redirect_uri),
        code_challenge,
        state
    );
    let browser = self.automation.launch_browser()?;
    let tab = browser.new_tab()?;
    self.automation.apply_fingerprint_protection(&tab)?;
    println!("🌐 访问 OAuth 授权页面...");
    tab.navigate_to(&auth_url)?;
    
    // --- 此处插入你已有的自动化登录代码 (Email -> Password -> Graph API Code) ---
    // ... 
    // ... (处理 Google 登录表单)
    // 3. 轮询捕获重定向 URL
    println!("⏳ 等待重定向捕获授权码...");
    let mut captured_code = String::new();
    for _ in 0..60 { // 最多等待 30 秒
        let current_url = tab.get_url();
        if current_url.contains("code=") && current_url.contains("authenticate-success") {
            // 解析 URL 获取 code
            if let Some(code) = extract_param(&current_url, "code") {
                captured_code = code;
                break;
            }
        }
        std::thread::sleep(std::time::Duration::from_millis(500));
    }
    if captured_code.is_empty() {
        return Err(anyhow!("未能捕获授权码 (Code Capture Timeout)"));
    }
    // 4. 后端请求交换 Token
    println!("🚀 正在交换 aor 令牌...");
    let client = reqwest::Client::new();
    let res = client.post("https://prod.us-east-1.auth.desktop.kiro.dev/oauth/token")
        .json(&serde_json::json!({
            "code": captured_code,
            "code_verifier": code_verifier,
            "redirect_uri": redirect_uri
        }))
        .send()
        .await?;
    let token_data: serde_json::Value = res.json().await?;
    let aor_token = token_data["refreshToken"]
        .as_str()
        .ok_or_else(|| anyhow!("返回数据中没有 refreshToken"))?;
    println!("✅ 成功获得 aor 令牌!");
    Ok(aor_token.to_string())
}
为什么这个方案能成？
8.  绕过存储难题：你不再需要去猜测 localStorage 的 Key，也不需要处理加密的存储数据。
9.  协议天然隔离：当浏览器重定向到 kiro:// 时，系统会因为找不到处理程序而让浏览器“卡”在那个 URL 上。这正合我们意，我们可以通过 tab.get_url() 稳稳地读出 URL 里的 code。
10.  完全兼容：由于使用的参数（redirect_uri、client_id等）与 Kiro-account-manager 完全一致，服务器颁发的令牌在功能上与其完全等价。
需要注意的细节：
*   依赖库：确保 Cargo.toml 中有 uuid, sha2, base64, urlencoding, reqwest。
*   重定向处理：headless_chrome 在遇到非法协议导航时可能会触发错误，你可以用 try 块包裹导航动作，或者直接通过轮询 URL 的方式忽略该错误。
*   时间戳：由于你已经有了 GraphApiClient 处理验证码，整个流程应该是全自动的。
这种“主动 OAuth 诱导 + 协议捕获”的模式是集成此类桌面端认证的最优解。
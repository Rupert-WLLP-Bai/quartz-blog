---
title: 使用Rust实现systemd配置文件解析工具
date: 2023-05-24T12:03:46.000Z
tags: [Rust, Linux, OpenEuler, OpenSource]
---
## Gitee Issue

### 开发指导

参考：https://gitee.com/openeuler/open-source-summer/issues/I6XKVU?from=project-issue

当前rust支持toml格式，systemd与toml格式有不少异同，例如，

- systemd的所有值不需要添加引号，
- 对于特定的值解析方式不同，date、time、bool等类型

因此该题目详细的实现要求如下：

1. 能够识别解析.service，.socket, .target, .mount等systemd支持的后缀
2. 将配置文件中的键值对，加载并解析成对应的数据结构，可直接使用，参赛者无须关心使用者如何定义该struct。譬如

```rust
#[derive(Config, Default, Clone, Debug, Serialize, Deserialize)]
pub(super) struct SectionService {
    pub Type: ServiceType,
    pub ExecStart: Option<VecDeque<ExecCommand>>,
    pub ExecStartPre: Option<VecDeque<ExecCommand>>,
    pub ExecStartPost: Option<VecDeque<ExecCommand>>,
    pub ExecStop: Option<VecDeque<ExecCommand>>,
    pub ExecStopPost: Option<VecDeque<ExecCommand>>,
    pub ExecReload: Option<VecDeque<ExecCommand>>,
    pub ExecCondition: Option<VecDeque<ExecCommand>>,
    pub Sockets: Option<Vec<String>>,
    pub WatchdogSec: u64,
    pub PIDFile: Option<PathBuf>,
    pub RemainAfterExit: bool,
}
```

1. 该题目重点是提供类似如下宏的使用方式，`#[derive(Config)]`, 可参考confique的实现。
2. 对于不支持的键和值类型，给出告警信息，如不符合systemd date类型的值。
3. 可选的提供一个简单的命令行界面，让用户可以输入配置文件路径并查看解析结果。便于调试和用户校验。

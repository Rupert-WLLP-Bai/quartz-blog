---
title: Sysmaster Systemd Parser
date: 2026-01-16
tags: [SecondaryDevelopment, Rust, Linux, OpenSource, SystemD]
---
## Standalone Version
### 项目背景及要求
[[使用Rust实现systemd配置文件解析工具]]
### 具体实现方式

#### 宏系统架构

项目采用**三层宏系统**解析 systemd 配置文件，类似 serde 的设计思路：

**1. UnitConfig（顶层）** - 完整的 unit 文件
```rust
#[derive(UnitConfig, Default, Debug)]
struct ServiceUnit {
    Unit: UnitSection,
    Service: ServiceSection,
    Install: InstallSection,
}
```

**2. UnitSection（中层）** - 配置段落（如 `[Service]`）
```rust
#[derive(UnitSection, Default, Debug)]
struct ServiceSection {
    #[entry(default = String::new())]
    pub Type: String,

    #[entry(append)]  // 支持多值累加
    pub ExecStart: Vec<String>,

    #[entry(default = false)]
    pub RemainAfterExit: bool,
}
```

**3. UnitEntry（底层）** - 自定义类型解析
```rust
#[derive(UnitEntry)]
enum ServiceType {
    Simple,
    Forking,
    Oneshot,
}
```

#### 工作流程

1. **编译期**：宏生成 `__parse_unit()` 和 `__parse_section()` 方法
2. **运行期**：`UnitParser` 迭代 sections → `SectionParser` 迭代 key-value pairs
3. **类型安全**：所有字段必须实现 `UnitEntry` trait（标准类型通过 `impl_for_types!` 宏自动实现）

#### 核心代码组织

```
systemd-parser-macros/src/
├── lib.rs                    # 宏入口
├── unit_parser/
│   ├── unit.rs              # UnitConfig 展开
│   ├── section.rs           # UnitSection 展开
│   ├── entry.rs             # UnitEntry 展开
│   └── attribute.rs         # 属性解析
```

#### 关键特性

- `#[entry(default = expr)]` - 设置默认值
- `#[entry(append)]` - Vec 字段支持多值累加
- `#[entry(parser = fn)]` - 自定义解析函数
- `Option<T>` - 可选字段
- 底层使用 `nom` 解析器组合子处理 INI 格式

### TODO
1. 覆盖率测试
2. 支持更复杂的配置
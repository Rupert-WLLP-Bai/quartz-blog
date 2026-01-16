---
title: Rust圣经学习记录
date: 2023-05-21T21:08:17.000Z
tags: [Rust, ProgrammingLanguage, MemorySafety, Multithreading, Generics, Cargo]
---

# Rust Course

![](https://rustacean.net/assets/cuddlyferris.png)

## 安装环境

### Linux/macOS

参考: https://rsproxy.cn/，字节跳动的镜像仓库

```bash
curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh
```

### Windows

下载:https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe

### VsCode插件

`rust-analyzer`,`Error Lens`,`Even Better TOML`,`CodeLLDB`

### 镜像源配置

crates.io 镜像

~/.cargo/config:

```toml
[source.crates-io]
# To use sparse index, change 'rsproxy' to 'rsproxy-sparse'
replace-with = 'rsproxy'

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"
[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"

[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"

[net]
git-fetch-with-cli = true             
```

Rustup 镜像

~/.zshrc or ~/.bashrc:

```bash
export RUSTUP_DIST_SERVER="https://rsproxy.cn"
export RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup"                        
```

### Hello World

```rust
fn greet_world() {
    let southern_germany = "Grüß Gott!";
    let chinese = "世界，你好";
    let english = "World, hello";
    let regions = [southern_germany, chinese, english];
    for region in regions.iter() {
        println!("{}", &region);
    }
}

fn main() {
    greet_world();
}
```

## 基础入门

### 变量绑定与解构

#### 变量命名

在Rust中，变量命名要遵循一些规则：

- 变量名由字母、数字和下划线组成。
- 变量名必须以字母或下划线开头。
- 变量名区分大小写。

一些有效的变量名示例：

```rust
let age = 25;
let full_name = "John Doe";
let is_valid = true;
```

#### 变量绑定

变量绑定是将值与变量关联起来的过程。在Rust中，使用`let`关键字进行变量绑定。

```rust
let x = 10; // 将值10绑定到变量x上
```

#### 变量不可变性

在Rust中，默认情况下，变量是不可变的。这意味着一旦将值绑定到变量上，就不能再更改该值。

```rust
let x = 10;
x = 20; // 错误！变量x是不可变的，不能重新赋值
```

如果希望变量是可变的，可以使用`mut`关键字。

```rust
let mut x = 10; // 使用mut关键字声明可变变量x
x = 20; // 可以重新赋值给可变变量x
```

#### 变量遮蔽

变量遮蔽是指在内层作用域中定义与外层作用域中同名的变量，从而隐藏外层作用域中的变量。这样做不会改变外层作用域中的变量的值，而是创建了一个新的、具有相同名称的变量。

```rust
let x = 10; // 外层作用域中的变量x

{
    let x = 20; // 内层作用域中的变量x，遮蔽了外层作用域中的变量x
    println!("Inner x: {}", x); // 输出 20
}

println!("Outer x: {}", x); // 输出 10，外层作用域中的变量x仍然可见
```

变量遮蔽通常用于解决命名冲突或在特定作用域中使用不同的变量值。

### 基本类型

#### 数值

#### 字符、布尔、单元

#### 语句、表达式

#### 函数

### 所有权和借用(重点!!)

### 复合类型

### 流程控制

### 模式匹配

---
title: Rust-Roadmap
date: 2026-01-03T14:17:37.000Z
tags: [Rust, Learning, Roadmap]
cover: ../../assets/rust-roadmap.png
---

# Rust Roadmap

## 01-basics

### Variable Shadowing

变量遮蔽, x的生命周期只在各自的作用域内有效:

```rust
    fn test_variable_scopes() {
        let x = 5;
        {
            let x = x * 2;
            assert_eq!(x, 10);
        }
        assert_eq!(x, 5);
    }
```

类似地, 改变类型也是允许的:

```rust
    let _x = 5;         // i32
    let _x = _x + 1;    // i32
    let _x = "six";     // &str
```

### Basic Types

- i8, i16, i32, i64, i128, isize: 有符号整数类型, 其中isize根据系统架构决定大小(32位系统为4字节, 64位系统为8字节)
- u8, u16, u32, u64, u128, usize: 无符号整数类型, 其中usize根据系统架构决定大小(32位系统为4字节, 64位系统为8字节)
- f32, f64: 浮点数类型
- char: 字符类型, 占4字节, 支持Unicode
- bool: 布尔类型

### Casting & Conversion

Rust 不允许隐式类型转换, 需要显式转换:

#### Numeric Casting

1. 方式1: as

```rust
    let x: i32 = 5;
    let y: f64 = x as f64;
```

2. 方式2: from, try_from

- u32::from(my_u8): 安全转换 (从小变大).
- u8::try_from(my_u32): 风险转换 (从大变小, 可能溢出), 返回 **Result**, 用 match 处理结果.

```rust
    use std::convert::TryFrom;
    let my_u8: u8 = 100;
    let my_u32: u32 = u32::from(my_u8); // 安全转换
    let my_u32_large: u32 = 300;
    let my_u8_converted: Result<u8, _> = u8::try_from(my_u32_large); // 风险转换
    match my_u8_converted {
        Ok(value) => println!("Converted value: {}", value),
        Err(e) => println!("Conversion failed: {}", e),
    }
```

#### String Conversion

1. to_string()

```rust
    let num = 42;
    let num_str = num.to_string();
```

2. parse()

```rust
    let guess: u32 = "42"           // &'static str
        .parse()                    // Result<u32, ParseIntError>
        .expect("Not a number!");   // expect 解包, 若失败则 panic
```

parse::<T>() 显式指定目标类型T, 或者使用类型注解让编译器推断类型.


3. char::from_u32()

```rust
    let c = char::from_u32(0x1F600); // 返回 Option<char>
    match c {
        Some(character) => println!("Character: {}", character),
        None => println!("Invalid Unicode scalar value"),
    }
```

### Binding

使用 @ 绑定模式匹配中的值, `变量` @ `模式`, 这样可以在匹配的同时获取值:

```rust
    let age = 25;
    match age {
        0 => println!("I'm not born yet"),
        n @ 1..=12 => println!("I'm a child of age {}", n),
        n @ 13..=19 => println!("I'm a teenager of age {}", n),
        n => println!("I'm an old person of age {}", n),
    }
```

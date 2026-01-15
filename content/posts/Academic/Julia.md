---
title: Julia
date: 2023-05-21T13:36:51.000Z
tags: [Academic, 编程语言, 数据科学, 数值计算, 计算机编程, Julia, 数据科学与工程, 数值计算与科学计算]
---

# Julia

Julia是一种高性能动态语言，具有灵活的语法和库生态系统，旨在通过高效地利用计算机硬件来加速科学计算、数值分析和数据科学任务。Julia解决了多重派发和类型推断等问题，从而使得编写高性能代码变得更加容易。

## 简介

Julia是由MIT开发的，旨在成为一种优雅而高效的科学计算语言。与Python和R等其他常用的数据科学工具不同，Julia旨在通过与C/Fortran相媲美的性能进行快速计算，并且让研究人员和工程师可以轻松地将其工作整合到现有的计算机科学环境中。

## 安装

Julia可以从其官方网站（https://julialang.org/downloads/）上下载并安装。安装完成后，您可以在命令行中输入“julia”以启动Julia REPL（Read-Eval-Print Loop）。

## 入门

要开始使用Julia，您需要了解其基本语法、变量、函数、类型和模块。您可以通过阅读Julia官方文档或参考《Julia高级编程》等书籍来学习。

以下是一个简单的例子，该例子演示了如何编写一个函数并调用它：

```julia
# 定义一个函数
function greet(name)
    println("Hello, $(name)!")
end

# 调用函数
greet("Julia")
```

## PkgServer 使用说明

切换 PkgServer **只需要修改环境变量 `JULIA_PKG_SERVER`** 即可，下面以默认服务器`https://pkg.julialang.org` 为例来简单说明其使用方式，根据您自己的网络情况切换不同的 PkgServer 即可。若成功配置，则通过`versioninfo()`能看到对应的环境变量，例如：

```julia
julia> versioninfo()
Julia Version 1.4.2
Commit 44fa15b150* (2020-05-23 18:35 UTC)
Platform Info:
  OS: macOS (x86_64-apple-darwin18.7.0)
  CPU: Intel(R) Core(TM) i9-9880H CPU @ 2.30GHz
  WORD_SIZE: 64
  LIBM: libopenlibm
  LLVM: libLLVM-8.0.1 (ORCJIT, skylake)
Environment:
  JULIA_PKG_SERVER = https://pkg.julialang.org
```

不同的系统和命令行有不同的永久设定环境变量的方式，通过搜索引擎能找到很多这方面的帮助。这里只以 Bash 和 Powershell 为例进行说明。

### 临时使用

- Windows Powershell: `$env:JULIA_PKG_SERVER = 'https://pkg.julialang.org'`
- Linux/macOS Bash: `export JULIA_PKG_SERVER="https://pkg.julialang.org"`

也可以通过 [PkgServerClient 32](https://github.com/johnnychen94/PkgServerClient.jl) 来切换镜像：

```julia
julia> using PkgServerClient # 在 using 时会自动切换到最近的服务器

julia> PkgServerClient.set_mirror("BFSU") # 手动指定为 BFSU 镜像

julia> PkgServerClient.registry_response_time() # 查看所有服务器的延迟
Dict{String, Float64} with 8 entries:
  "BFSU"      => 0.0323085
  "OpenTUNA"  => 0.146376
  "SJTUG"     => 0.0093373
  "USTC"      => 0.230767
  "SUSTech"   => 0.269097
  "TUNA"      => 0.184747
  "JuliaLang" => Inf
  "NJU"       => 0.0445983
```

### 永久使用

#### 通用方法

这里提供一种针对 Julia 的全平台通用的方式： `$JULIA_DEPOT_PATH/config/startup.jl` ( 默认为 `~/.julia/config/startup.jl` ) 文件定义了每次启动 Julia 时都会执行的命令，编辑该文件，根据需要选择以下两种中的一种即可：

```julia
# 每次打开 Julia 都使用固定的 pkg server
ENV["JULIA_PKG_SERVER"] = "https://pkg.julialang.org"
# 每次打开 Julia 都自动切换到最近的 pkg server
if VERSION >= v"1.4"
    try
        using PkgServerClient
    catch e
        @warn "error while importing PkgServerClient" e
    end
end
```

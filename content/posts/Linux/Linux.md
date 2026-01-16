---
title: Linux常用工具
date: 2022-11-20T19:40:11.000Z
tags: [Linux, DevelopmentTool, Shell]
---

- [valgrind](#valgrind)
  - [简介](#简介)
  - [安装](#安装)
  - [工具](#工具)
  - [使用](#使用)
    - [memcheck](#memcheck)
- [dust](#dust)
- [hyperfine](#hyperfine)
- [duf](#duf)
- [bottom](#bottom)
- [exa](#exa)
- [zoxide](#zoxide)
- [ripgrep](#ripgrep)
- [httpie](#httpie)
  - [安装](#安装-1)
  - [使用](#使用-1)
    - [POST](#post)
- [procs](#procs)
- [awk](#awk)
- [sed](#sed)
- [grep](#grep)
- [fzf](#fzf)
- [fd](#fd)
- [ps](#ps)
- [ssh](#ssh)
- [vim](#vim)
- [git](#git)



## valgrind

<center>
    <font color=#FF4500>
Linux程序内存监测分析软件
    </font>
</center>

### 简介
valgrind是一个用于Linux程序内存监测分析的软件，它可以检测程序中的内存泄漏、内存访问越界等问题，是一个非常有用的工具。它可以检测程序中的内存泄漏、内存访问越界等问题，是一个非常有用的工具。

### 安装
```bash
sudo apt install valgrind
```

### 工具
- memcheck：内存检测工具，可以检测内存泄漏、内存访问越界等问题
- cachegrind：缓存检测工具，可以检测程序中的缓存使用情况
- helgrind：线程检测工具，可以检测程序中的线程问题
- callgrind：函数调用检测工具，可以检测程序中的函数调用情况
- massif：内存使用检测工具，可以检测程序中的内存使用情况

### 使用

#### memcheck
```bash
valgrind --tool=memcheck --leak-check=full --show-leak-kinds=all ./a.out
```

以上命令可以检测程序a.out中的内存泄漏、内存访问越界等问题。

其中，<font color="red">--tool=memcheck</font>表示使用memcheck工具，<font color="red">--leak-check=full</font>表示检测内存泄漏，<font color="red">--show-leak-kinds=all</font>表示显示所有内存泄漏的类型。

![valgrind_memcheck_1.png](https://s2.loli.net/2022/11/22/5HLECBdQetuF1xI.png)

![valgrind_memcheck_2.png](https://s2.loli.net/2022/11/22/pDTmkdO3eB54uF7.png)

## dust

## hyperfine

## duf

## bottom

## exa

## zoxide

## ripgrep

## httpie

<center>
    <font color="red">
    命令行HTTP客户端
    </font>
</center>

### 安装
```shell
brew install httpie
```

OR

```shell
pip install --upgrade pip setuptools
pip install --upgrade httpie
```

### 使用

#### POST
1. 使用重定向进行JSON的提交
    ```shell
    https -v POST 150.158.80.33:7191/api/Login/Login --verify=no < login.json
    ```


## procs

## awk

## sed

## grep

## fzf

## fd

## ps

## ssh

## vim

## git

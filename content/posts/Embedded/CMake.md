---
title: CMake
date: 2021-12-15T20:14:50.000Z
tags: [Embedded, C++, 跨平台, 构建工具, MSVC, 编码, CMake]
---

# CMake 跨平台项目管理

## 常见问题

### 1. 文件编码

1. 文件编码是UTF-8，在Windows控制台默认GBK的代码页输出会出现乱码，故需要在main函数最开始位置加入启用Windows控制台UTF-8代码页的命令，即：

```c++
#ifdef _WIN32
    system("chcp 65001");
#endif
```

2. 由于在Windows上编译成VS工程文件时可能会出现字符集的问题，故在顶层CMakeLists.txt中加入了用MSVC编译时的一些选项，即：

```cmake
# MSVC设置
add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
# 指定为C++11 版本
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 11)
```

3. 默认用UTF-8，LF写代码

### 2. 如何添加第三方库？

在CMake中添加第三方库有两种方式：手动添加和使用自动化工具。

手动添加：

假设我们需要添加一个名为"libfoo"的库，它包含头文件和库文件，那么可以按照以下步骤进行：

1. 在CMakeLists.txt中添加库的路径：

   ```cmake
   include_directories(${CMAKE_SOURCE_DIR}/include) # 头文件目录
   link_directories(${CMAKE_SOURCE_DIR}/lib) # 库文件目录
   ```

2. 编写链接库的指令：

   ```cmake
   target_link_libraries(my_project libfoo)
   ```

使用自动化工具：

一些大型的第三方库会提供自己的CMake模块（cmake-modules），可以通过`find_package`命令来寻找并导入这些模块，例如：

```cmake
find_package(OpenCV REQUIRED)
target_link_libraries(my_project ${OpenCV_LIBS})
```

### 3. 如何添加测试？

在CMake中，可以使用CTest框架来添加测试。CTest允许将测试代码与项目代码分开管理，测试可以被单独运行或作为构建过程的一部分运行。

以下是一个示例：

```cmake
enable_testing()

add_executable(test_foo test/test_foo.cpp)
target_link_libraries(test_foo libfoo)

add_test(NAME MyTest COMMAND test_foo)
```

这段代码启用了测试模块，然后定义了一个名为"test_foo"的测试，并将其链接到"libfoo"库文件。最后，使用`add_test`命令将测试添加到测试套件中。

### 4. 如何进行交叉编译？

在CMake中，可以通过设置交叉编译器路径和系统名称来进行交叉编译，例如：

```cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_C_COMPILER /path/to/cross-compiler)
set(CMAKE_CXX_COMPILER /path/to/cross-cxx-compiler)
```

需要指定正确的系统名称和交叉编译器路径，才能成功进行交叉编译。

### 5. 如何生成IDE工程文件？

CMake可以根据不同的IDE生成相应的工程文件，例如Visual Studio、Xcode和Qt Creator等。

以下是一些示例：

```bash
# 生成Visual Studio项目文件
cmake -G "Visual Studio 16 2019" ..

# 生成Xcode项目文件
cmake -G Xcode ..

# 生成Qt Creator项目文件
cmake -G "Qt Creator" ..
```

需要注意的是，不同的IDE支持的CMake版本可能有所不同，需要根据实际情况选择合适的CMake版本和IDE版本。

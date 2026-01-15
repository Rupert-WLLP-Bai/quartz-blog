---
title: Bazel
date: 2022-11-24T11:13:24.000Z
tags: [Linux, Bazel, C++, 构建工具]
---

# Bazel

Bazel是一个非常流行的构建工具，特别适合用于构建大型的软件项目，本文将详细介绍它的基本概念和如何使用它来构建C++项目。

## 什么是Bazel？

Bazel是一个由Google开发的构建工具，它的主要目标是提高构建速度和可重现性。与其他构建工具相比，Bazel最大的优点是它能够利用缓存系统来加速构建过程，并且只会重新构建那些需要更新的部分。

## Bazel的核心概念

在开始使用Bazel之前，我们需要了解一些其核心概念：

### Target

在Bazel中，Target是指一个构建目标，它可以是一个二进制文件、一个库文件、一个测试文件或者其他一些需要构建的东西。每个Target都必须有一个唯一的名称，这个名称会被用于管理依赖关系和构建顺序。

例如，如果你正在编写一个C++应用程序，那么你可能会有多个Target，比如：

- 一个名为"my_app"的二进制Target，用于生成可执行文件。
- 一个名为"my_lib"的库Target，用于生成静态或动态库文件。
- 若干个名为"my_test1"、"my_test2"等的测试Target，分别用于测试不同的组件或模块。

### Rule

在Bazel中，Rule是指一组规则，用于定义如何构建一个Target。每个Rule都包含了一些声明，例如需要构建的Target类型、依赖的其他Target、需要执行的命令行参数等。

例如，对于上面提到的"my_app" Target，你可以创建一个名为"cc_binary"的Rule，来告诉Bazel如何构建这个Target：

```
cc_binary(
    name = "my_app",
    srcs = ["main.cpp", "util.cpp"],
    hdrs = ["util.h"],
    deps = [":my_lib"],
)
```

上面的代码使用了cc_binary规则来定义了一个名为"my_app"的Target，这个Target由两个源码文件main.cpp和util.cpp以及一个头文件util.h组成，并且依赖于另外一个名为"my_lib"的库Target。

### Workspace

在Bazel中，Workspace是指一个项目的根目录，包括所有的源代码文件和构建规则。Workspace还包括了一些配置文件，用于指定构建参数和依赖项等。

例如，在你的项目根目录下，你可以创建一个名为"WORKSPACE"的文件，来告诉Bazel如何获取和管理依赖项：

```
workspace(name = "my_workspace")

http_archive(
    name = "protobuf",
    urls = ["https://github.com/protocolbuffers/protobuf/releases/download/v3.17.0/protobuf-all-3.17.0.tar.gz"],
    sha256 = "e1a8c53b4d49f63267a9fa2d5682f36b7e845b48ee3acff6b9cd3e0d1ce0f638",
)
```

上面的代码定义了一个名为"my_workspace"的Workspace，并且使用http_archive规则来下载和安装一个名为"protobuf"的依赖项。

总之，Bazel的核心概念包括Target、Rule和Workspace，这些概念共同协作来实现高效、可重复和可扩展的构建过程。理解这些概念是学习和使用Bazel的关键。

## 如何使用Bazel构建C++项目

### Hello-World

现在我们来看一下如何使用Bazel来构建一个C++项目。假设我们的项目包含两个源文件：`main.cc`和`hello.cc`，并且我们想要将它们编译成一个可执行文件。首先，我们需要创建一个名为`WORKSPACE`的文件夹，并在其中添加以下内容：

```
workspace(name = "myproject")
```

这会告诉Bazel我们正在构建一个名为“myproject”的项目。接下来，我们需要在`WORKSPACE`目录中创建一个`BUILD`文件，该文件包含有关如何构建我们的项目的规则。具体而言，我们希望将`main.cc`和`hello.cc`编译成一个名为“hello”的可执行文件。因此，我们可以在BUILD文件中添加以下内容：

```
cc_binary(
    name = "hello",
    srcs = ["main.cc", "hello.cc"],
)
```

这个规则告诉Bazel如何构建一个名为“hello”的可执行文件，并指定了需要编译的源文件列表。现在我们已经准备好构建我们的项目了，只需在终端中输入以下命令即可：

```
bazel build //:hello
```

这个命令会使用Bazel构建我们的项目。注意，“//”表示我们正在构建项目根目录下的Target，“hello”是我们要构建的Target名称。如果一切正常，Bazel将会在项目根目录下生成一个名为“bazel-bin”的文件夹，其中包含我们的可执行文件。

### 构建静态库和动态库

除了构建可执行文件，Bazel还支持构建静态库和动态库。例如，我们可以按照以下方式在BUILD文件中定义一个静态库：

```
cc_library(
    name = "mylib",
    srcs = ["hello.cc"],
)
```

这个规则将编译`hello.cc`源文件并生成名为“libmylib.a”的静态库文件。同样地，我们也可以以类似的方式定义动态库：

```
cc_library(
    name = "mylib",
    srcs = ["hello.cc"],
    linkshared = True,
)
```

这个规则将生成名为“libmylib.so”的动态库文件。

### 一个经典的项目结构

对于大型项目，通常需要按照一定的结构组织源代码和构建规则。以下是一个基本的C++项目结构：

- `src`: 包含所有源代码文件
- `include`: 包含所有头文件
- `lib`: 包含所有生成的静态库和动态库文件
- `test`: 包含所有测试文件

我们可以按照以下方式在WORKSPACE目录下创建BUILD文件来定义如何构建这个项目：

```
cc_library(
    name = "mylib",
    srcs = glob(["src/**/*.cc"]),
    hdrs = glob(["include/**/*.h"]),
)

cc_test(
    name = "mylib_test",
    srcs = glob(["test/**/*_test.cc"]),
    deps = [":mylib"],
)
```

这个规则将编译所有位于`src`目录下的`.cc`源文件并生成一个名为“libmylib.a”的静态库文件。`hdrs`参数告诉Bazel在编译时需要包含哪些头文件。我们还定义了一个测试Target，它依赖于`mylib`库，并编译所有位于`test`目录下的`_test.cc`测试文件。

### 集成GoogleTest和Glog

#### 从本地引用

Bazel可以很容易地集成第三方库，例如GoogleTest和Glog。假设我们已经将这些库下载并解压到项目根目录的`third_party`目录中（通常不应该将第三方库的源代码放入git等版本控制系统中），我们可以按照以下方式在WORKSPACE目录下添加BUILD文件来引用它们：

```
new_local_repository(
    name = "gtest",
    path = "/path/to/gtest",
    build_file = "/path/to/gtest/BUILD.bazel",
)

new_local_repository(
    name = "glog",
    path = "/path/to/glog",
    build_file = "/path/to/glog/BUILD.bazel",
)
```

这个规则告诉Bazel在构建过程中如何引用GoogleTest和Glog库。注意，我们需要指定`build_file`参数来告诉Bazel如何构建这些库。

现在，我们可以按照以下方式在我们的测试Target中使用GoogleTest：

```
cc_test(
    name = "mylib_test",
    srcs = glob(["test/**/*_test.cc"]),
    deps = [
        ":mylib",
        "@gtest//:gtest_main",
    ],
)
```

`@gtest//:gtest_main`告诉Bazel从名为“gtest”的本地存储库中使用`gtest_main`目标来构建我们的测试Target。同样地，我们也可以按照以下方式在我们的库Target中使用Glog：

```
cc_library(
    name = "mylib",
    srcs = glob(["src/**/*.cc"]),
    hdrs = glob(["include/**/*.h"]),
    deps = ["@glog//:glog"],
)
```

`@glog//:glog`告诉Bazel从名为“glog”的本地存储库中使用`glog`目标来构建我们的库Target。

#### http_archive

`http_archive`是Bazel中的一个命令，可以从远程URL下载并解压缩源代码，并在`WORKSPACE`文件中定义外部依赖项。这个命令通常用于引入第三方库，例如GoogleTest和Glog。

参考：https://github.com/Rupert-WLLP-Bai/BazelBuild/tree/main/gtest_glog

`BUILD`文件

```
cc_test(
  name = "hello_test",
  size = "small",
  srcs = ["hello_test.cc"],
  deps = [
    "@com_google_googletest//:gtest_main",
    "@com_github_google_glog//:glog",
  ],
)
```

`WORKSPACE`文件

```
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
  name = "com_google_googletest",
  urls = ["https://github.com/google/googletest/archive/609281088cfefc76f9d0ce82e1ff6c30cc3591e5.zip"],
  strip_prefix = "googletest-609281088cfefc76f9d0ce82e1ff6c30cc3591e5",
)


http_archive(
    name = "com_github_gflags_gflags",
    sha256 = "34af2f15cf7367513b352bdcd2493ab14ce43692d2dcd9dfc499492966c64dcf",
    strip_prefix = "gflags-2.2.2",
    urls = ["https://github.com/gflags/gflags/archive/v2.2.2.tar.gz"],
)

http_archive(
    name = "com_github_google_glog",
    sha256 = "21bc744fb7f2fa701ee8db339ded7dce4f975d0d55837a97be7d46e8382dea5a",
    strip_prefix = "glog-0.5.0",
    urls = ["https://github.com/google/glog/archive/v0.5.0.zip"],
)
```

`hello_test.cc`

```c++
#include <gtest/gtest.h>
#include "glog/logging.h"
#include "glog/stl_logging.h"

// // Demonstrate some basic assertions.
// TEST(HelloTest, BasicAssertions) {
//   // Expect two strings not to be equal.
//   EXPECT_STRNE("hello", "world");
//   // Expect equality.
//   EXPECT_EQ(7 * 6, 42);
// }

int main(int argc, char* argv[]) {
    google::InitGoogleLogging(argv[0]);

    // Log both to log file and stderr
    FLAGS_alsologtostderr = true;

    std::vector<int> x = {1, 2, 3, 4};
    std::map<int, int> y = {{1, 2}, {2, 3}};

    LOG(INFO) << "ABC, it's easy as "
              << "{" << x << "}";
    LOG(INFO) << "ABC, it's easy as " << y;

    LOG(INFO) << "This is an info  message";
    LOG(WARNING) << "This is a warning message";
    LOG(INFO) << "Hello, world again!";
    // LOG(ERROR) << "This is an error message";
    // LOG(FATAL) << "This is a fatal message";
    // CHECK(5 == 4) << "Check failed!";

    return 0;
}
```

在上面的例子中，我们使用`http_archive`命令从不同的远程URL下载和解压缩了两个不同的库：GoogleTest和Glog。这些命令在`WORKSPACE`文件中被定义，因此它们对整个Bazel工程都可用。

对于每个`http_archive`命令，我们需要提供以下信息：

- `name`: 库的名称，用于在其他地方引用它。
- `urls`: 一个包含一个或多个远程URL的列表，用于指定要下载的库的位置。
- `sha256`: 一个SHA-256哈希值，用于验证下载文件的完整性。
- `strip_prefix`（可选）：一个目录前缀，用于解压缩后将其删除。这通常用于确保库的源代码位于正确的目录层次结构中。
- `build_file`（可选）：一个BUILD文件路径，用于自定义库的构建过程。如果库已经包含一个BUILD文件，则不需要这个参数。

在`cc_test`规则的`deps`属性中，我们可以通过`@<repository_name>//:<target_name>`的方式来引用外部依赖项，其中`repository_name`是`http_archive`命令中指定的`name`属性，而`target_name`是库Target的名称。例如，以下语句：

```
deps = [
    "@com_google_googletest//:gtest_main",
    "@com_github_google_glog//:glog",
],
```

告诉Bazel在构建`hello_test`测试Target时，需要链接GoogleTest和Glog库。

## 将 Bazel 与 IDE 集成

### 自动补全源代码

#### C 语言系列（C++、C、Objective-C 和 Objective-C++）

[`hedronvision/bazel-compile-commands-extractor`](https://github.com/hedronvision/bazel-compile-commands-extractor) 可在各种可扩展编辑器中启用自动补全、智能导航、快速修复等功能，包括 VSCode、Vim、Emacs、Atom 和 Sublime。它让语言服务器（如 clangd 和 ccls）和其他类型的工具发挥作用，可以借鉴 Bazel 对 `cc` 和 `objc` 代码如何编译（包括如何针对其他平台配置交叉编译）的理解。

#### Java

[`georgewfraser/java-language-server`](https://github.com/georgewfraser/java-language-server) - 支持 Bazel 构建的项目的 Java 语言服务器 (LSP)

## 参考

https://github.com/Rupert-WLLP-Bai/BazelBuild

https://bazel.build/?hl=zh-cn

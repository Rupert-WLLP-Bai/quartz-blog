---
title: Maven
date: 2021-10-27T11:11:33.000Z
tags: [Java, Framework, BuildTool]
---

# Maven
## 使用
1. 设置编码为UTF-8
```xml
<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
<maven.compiler.encoding>UTF-8</maven.compiler.encoding>
```
2. 添加本地仓库
在<settings>后加上
```xml
<localRepository>G:\Maven\repo</localRepository>
```
3. 设置镜像源
```xml
<mirror>
    <id>nexus-aliyun</id>
    <mirrorOf>*</mirrorOf>
    <name>Nexus aliyun</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>
```

4. Maven的命令
- mvn -version                 查看maven的版本及配置信息
- mvn archetype:create   -DgroupId=    DartifactId=    构建java项目
- mvn archetype:create   -DgroupId=    DartifactId=    -DarchetypeArtifactId=maven-archetype-webapp 创建web项目
- mvn compile                编译项目代码
- mvn package               打包项目
- mvn package -Dmaven.test.skip=true   打包项目时跳过单元测试
- mvn test                      运行单元测试
- mvn clean                    清除编译产生的target文件夹内容，可以配合相应命令一起使用，如mvn clean package， mvn clean test
- mvn install                   打包后将其安装在本地仓库
- mvn deploy                  打包后将其安装到pom文件中配置的远程仓库
- mvn eclipse:eclipse      将maven生成eclipse项目结构
- mvn eclipse:clean         清除maven项目中eclipse的项目结构
- mvn site                       生成站点目录
- mvn dependency:list      显示所有已经解析的所有依赖
- mvn dependency:tree     以树的结构展示项目中的依赖
- mvn dependency:analyze  对项目中的依赖进行分析，依赖未使用，使用单未引入
- mvn tomcat:run              启动tomcat


5. 配置JUnit5的pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-engine</artifactId>
        <version>5.8.2</version>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.junit.platform</groupId>
        <artifactId>junit-platform-runner</artifactId>
        <version>1.8.2</version>
        <scope>test</scope>
    </dependency>

</dependencies>

<build>
    <plugins>
        <plugin>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
        </plugin>
        <plugin>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>2.22.2</version>
        </plugin>
    </plugins>
</build>

<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
</properties>
```

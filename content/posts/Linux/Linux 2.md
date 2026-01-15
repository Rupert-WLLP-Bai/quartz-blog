---
title: Linux配置记录
date: 2021-11-17T18:59:52.000Z
tags: [Linux, 系统配置]
---

# 关于Linux的一些记录

## ssh的配置
1.  本地客户端生成公钥
2.  将公钥传到远端authorized_key
3.  本地通过ssh xxx@x.x.x.x访问

## oh-my-zsh的配置

### 下载安装
1. wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
2. chmod +x install.sh
3. vim install.sh
4. 修改源
> REPO=${REPO:-mirrors/oh-my-zsh}
> REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}
5. ./install.sh

### 配置插件和主题
1. git clone https://gitee.com/yuhldr/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
2. git clone https://gitee.com/yuhldr/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions



## CentOS 7配置

### 换源

> sudo vim /etc/yum.repos.d/CentOS-Base.repo 

```
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the
# remarked out baseurl= line instead.
#
#


[base]
name=CentOS-$releasever - Base
baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos/$releasever/os/$basearch/
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os
enabled=1
gpgcheck=1
gpgkey=file:/etc/pki/rpm-gpg/RPM-GPG-KEY-7

#released updates
[updates]
name=CentOS-$releasever - Updates
baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos/$releasever/updates/$basearch/
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates
enabled=1
gpgcheck=1
gpgkey=file:/etc/pki/rpm-gpg/RPM-GPG-KEY-7



#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras
baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos/$releasever/extras/$basearch/
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras
enabled=1
gpgcheck=1
gpgkey=file:/etc/pki/rpm-gpg/RPM-GPG-KEY-7



#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus
baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos/$releasever/centosplus/$basearch/
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus
gpgcheck=1
enabled=0
gpgkey=file:/etc/pki/rpm-gpg/RPM-GPG-KEY-7
```

## 基础命令

1. du folder_name 递归查看文件夹的大小
2. wc -l $(find . -name "\*.h" -o -name "\*.cpp")	统计当前目录(及其子目录下)的.h,.cpp文件行数
3. grep

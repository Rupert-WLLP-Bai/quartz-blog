---
title: ArchLinux 相关记录
date: 2023-06-06T13:12:19.000Z
tags: [Linux, Arch Linux, VMware, VS Code, 操作系统, 开发工具]
---

# 在VMware上安装Arch Linux并使用VS Code连接

## 介绍

Arch Linux是一个轻量级的Linux发行版，以其简洁性和灵活性而闻名。本教程将指导您如何在VMware虚拟机中安装Arch Linux，并使用VS Code作为开发环境连接到该虚拟机。

## 步骤一：准备工作

在开始安装之前，请确保您已完成以下准备工作：

1. 下载并安装VMware Workstation Player或VMware Workstation Pro。您可以从VMware官方网站获取适用于您的操作系统的版本。

2. 下载Arch Linux ISO镜像。您可以从Arch Linux官方网站的下载页面获取最新版本的ISO镜像。

3. 创建新的虚拟机。打开VMware Workstation，点击"创建新的虚拟机"，然后按照向导指示进行设置。在选择操作系统时，选择"Linux"，然后选择"**其他 Linux 5.x 内核64位**"

## 步骤二：安装Arch Linux

1. 启动虚拟机并挂载Arch Linux ISO镜像。在VMware Workstation中，选择您创建的Arch Linux虚拟机，然后点击"Play Virtual Machine"以启动虚拟机。在虚拟机启动过程中，选择"Power on to Firmware"以进入虚拟机的BIOS设置。在BIOS设置中，将ISO镜像文件添加到虚拟光驱中。

2. 安装Arch Linux。在虚拟机启动后，按照屏幕上的提示进行安装。您可以参考Arch Linux官方安装指南以获取更详细的安装步骤和配置选项。

3. 配置网络连接。安装完成后，通过DHCP或手动配置网络连接，确保虚拟机可以访问互联网。

4. 更新系统。使用以下命令更新系统软件包：

   ```bash
   sudo pacman -Syu
   ```

   这将安装最新的软件包和更新系统。

5. 添加用户

  ```bash
  sudo useradd -m -G wheel norfloxaciner
  ```

6. 设置密码

  ```bash
  passwd
  ```

  ```
  sudo passwd norfloxaciner
  ```

## 安装系统

参考: https://archlinuxstudio.github.io/ArchLinuxTutorial/#/rookie/basic_install

**安装之前可以先使用VS Code连接虚拟机**

以下是在虚拟机中安装Arch Linux的步骤，包括使用fdisk进行分区的详细说明：

1. 下载Arch Linux ISO：从Arch Linux官方网站下载最新的ISO镜像文件。

2. 创建虚拟机：使用虚拟机软件（如VirtualBox、VMware等）创建一个新的虚拟机，配置虚拟机的内存、硬盘大小等参数。

3. 安装Arch Linux：将下载的Arch Linux ISO镜像文件挂载到虚拟机上，并启动虚拟机。

4. 设置语言和键盘布局：选择适合的语言和键盘布局，根据提示执行相关命令进行设置。

5. 确认网络连接：使用`ping`命令确认虚拟机是否能够访问互联网。

6. 分区：使用`fdisk`命令对虚拟机的磁盘进行分区。以下是使用`fdisk`进行分区的步骤：

   a. 运行以下命令启动`fdisk`工具：
      ```bash
      fdisk /dev/sda
      ```

   b. 输入`o`命令，创建一个新的DOS分区表。

   c. 输入`n`命令，创建一个新分区。按照提示选择分区的类型、起始扇区和大小。

   d. 重复上述步骤创建其他分区（如根分区、交换分区等），如果需要的话。

   e. 输入`w`命令，保存分区表并退出`fdisk`工具。

7. 格式化分区：使用`mkfs`命令对分区进行格式化。例如，如果你创建了一个根分区，可以使用以下命令对其进行格式化：
   ```bash
   mkfs.ext4 /dev/sda1
   ```

8. 挂载分区：使用`mount`命令将分区挂载到文件系统上。例如，将根分区挂载到`/mnt`目录：
   ```bash
   mount /dev/sda1 /mnt
   ```

9. 安装基本系统：运行以下命令安装基本的Arch Linux系统文件：
   ```bash
   pacstrap /mnt base linux linux-firmware
   ```

10. 生成fstab文件：运行以下命令生成fstab文件，用于自动挂载分区：
    ```bash
    genfstab -U /mnt >> /mnt/etc/fstab
    ```

11. 切换到新系统：运行以下命令切换到新安装的Arch Linux系统：
    ```bash
    arch-chroot /mnt
    ```

12. 配置系统：在chroot环境中，可以进行一些系统配置，例如设置时区、语言、网络等。根据需求执行相关命令。

13. 安装引导程序：根据使用的引导程序（如GRUB、systemd-boot等），安装相应的引导程序并进行相应的配置。

14. 设置root密码：使用`passwd`命令设置root用户的密码

15. 完成安装：退出chroot环境并重新启动虚拟机：
    ```bash
    exit
    umount -R /mnt
    reboot
    ```

这些步骤提供了在虚拟机中安装Arch Linux的基本指南。请注意，安装过程可能因个人需求和具体环境而有所不同。建议在执行任何重要操作之前仔细阅读Arch Linux的官方文档并备份重要数据。

## 配置镜像源

配置镜像源可以加快软件包的下载速度。您可以选择使用国内的镜像源进行配置。

1. 编辑`/etc/pacman.d/mirrorlist`文件，选择一个适合您的地理位置的镜像源。可以使用以下命令打开文件进行编辑：

   ```bash
   sudo nano /etc/pacman.d/mirrorlist
   ```

2. 将适合您地理位置的镜像源移动到文件的顶部。您可以使用快捷键`Ctrl + K`剪切行，然后使用`Ctrl + U`粘贴行到顶部。

   ```
   Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
   ```

3. 保存并关闭文件。使用快捷键`Ctrl + X`，然后按下`Y`确认保存。

4. 更新系统软件包以应用新的镜像源配置：

   ```bash
   sudo pacman -Sy
   ```

现在您的Arch Linux系统将使用新的镜像源进行软件包下载。

## 安装Oh My Zsh及其插件

Oh My Zsh是一个强大的命令行工具，提供了丰富的主题和插件，可以提高命令行的效率和易用性。

1. 安装Oh My Zsh。使用以下命令安装Oh My Zsh：

   ```bash
   sudo pacman -S zsh
   sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
   ```

   上述命令将安装Zsh和Oh My Zsh，并将Zsh设置为默认的shell。

2. 安装插件。Oh My Zsh支持各种插件，可以根据个人需求进行安装。以下是一些常用的插件的安装方法：

   - **zsh-autosuggestions**：自动补全建议插件。使用以下命令安装：

     ```bash
     git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
     ```

   - **zsh-syntax-highlighting**：语法高亮插件。使用以下命令安装：

     ```bash
     git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
     ```

3. 配置插件。编辑`~/.zshrc`文件并设置插件。使用以下命令打开文件进行编辑：

   ```bash
   nano ~/.zshrc
   ```

4. 找到`plugins=(...)`行，并将需要启用的插件添加到括号内，用空格分隔。例如：

   ```bash
   plugins=(zsh-autosuggestions zsh-syntax-highlighting)
   ```

5. 保存并关闭文件。使用快捷键`Ctrl + X`，然后按下`Y`

确认保存。

6. 应用配置更改：

   ```bash
   source ~/.zshrc
   ```

现在您已经成功安装了Oh My Zsh和一些常用插件。您可以自定义配置文件，选择合适的主题，并进一步根据个人需求进行配置。

希望这些步骤对您有所帮助！

## 结论

通过本教程，您已经学会了在VMware虚拟机上安装Arch Linux，并使用VS Code连接到该虚拟机。现在您可以开始在Arch Linux上进行开发和编程了。祝您使用愉快！

参考链接：
- [Arch Linux官方网站](https://archlinux.org/)
- [Arch Linux官方安装指南](https://wiki.archlinux.org/title/Installation_guide)
- [VS Code官方网站](https://code.visualstudio.com/)
- [VMware官方网站](https://www.vmware.com/)

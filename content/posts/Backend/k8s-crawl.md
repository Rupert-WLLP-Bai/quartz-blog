## GitHub Repo
## Phase 1 - 启动
1. 安装OrbStack，在Mac M系列表现更好
```bash
   brew install orbstack
   open -a OrbStack
```
2. 安装minikube
```shell
minikube start --vm-driver docker --container-runtime=docker
```
3.  启动minikube
```shell
minikube start --vm-driver docker --container-runtime=docker
```

``` bash
😄  Darwin 15.5 (arm64) 上的 minikube v1.37.0
✨  根据用户配置使用 docker 驱动程序
📌  使用具有 root 权限的 Docker Desktop 驱动程序
👍  在集群中 "minikube" 启动节点 "minikube" primary control-plane
🚜  正在拉取基础镜像 v0.0.48 ...
💾  正在下载 Kubernetes v1.34.0 的预加载文件...
    > preloaded-images-k8s-v18-v1...:  332.38 MiB / 332.38 MiB  100.00% 10.43 M
    > index.docker.io/kicbase/sta...:  450.06 MiB / 450.06 MiB  100.00% 9.80 Mi
❗  minikube was unable to download gcr.io/k8s-minikube/kicbase:v0.0.48, but successfully downloaded docker.io/kicbase/stable:v0.0.48@sha256:7171c97a51623558720f8e5878e4f4637da093e2f2ed589997bedc6c1549b2b1 as a fallback image
🔥  创建 docker container（CPU=2，内存=3072MB）...
🐳  正在 Docker 28.4.0 中准备 Kubernetes v1.34.0…
🔗  配置 bridge CNI (Container Networking Interface) ...
🔎  正在验证 Kubernetes 组件...
    ▪ 正在使用镜像 gcr.io/k8s-minikube/storage-provisioner:v5
🌟  启用插件： storage-provisioner, default-storageclass
🏄  完成！kubectl 现在已配置，默认使用"minikube"集群和"default"命名空间
```

4. build and push (cwllp1230)
``` bash
docker build . -t cwllp1230/hellok8s:v1
docker run -p 3000:3000 --name hellok8s -d cwllp1230/hellok8s:v1
curl http://localhost:3000 
```
## Phase 2 - Pod
首先了解Pod的概念，作用
[[Kubernetes#Pod]]
## 速查表

| **分类**     | **常用命令**                        | **功能描述**               | **2026 实战秘籍**                                 |
| ---------- | ------------------------------- | ---------------------- | --------------------------------------------- |
| **基础生命周期** | `minikube start`                | 启动集群                   | 加上 `--driver=orbstack` 获得最佳性能                 |
|            | `minikube stop`                 | 停止集群 (不删数据)            | 只是关机，配置和镜像都会保留                                |
|            | `minikube delete`               | **彻底删除集群**             | 清理所有数据和虚拟机，重置环境必备                             |
|            | `minikube pause`                | 暂停集群                   | 停止所有容器的 CPU 占用，不关机                            |
|            | `minikube status`               | 查看集群状态                 | 快速检查控制面、Kubelet 是否运行正常                        |
| **多集群管理**  | `minikube start -p <name>`      | 创建指定名称的集群              | 例如 `-p dev` 和 `-p test` 同时运行                  |
|            | `minikube profile <name>`       | 切换当前操作的集群              | 在多个实验环境之间无缝跳转                                 |
| **镜像同步**   | `minikube image load <name>`    | **加载本地镜像**             | **2026年首选**：直接将本地 build 的镜像塞进集群               |
|            | `eval $(minikube docker-env)`   | 环境变量重定向                | 让本地 Docker 直接操作集群内部的镜像库                       |
|            | `minikube image ls`             | 查看集群内已缓存镜像             | 检查你的镜像是否真的已经同步进去                              |
| **网络与访问**  | `minikube service <name>`       | 自动打开服务链接               | 自动在浏览器中弹出你的 Web 应用页面                          |
|            | `minikube tunnel`               | **开启 LoadBalancer 隧道** | 解决外部 IP 处于 `<pending>` 状态的必杀技                 |
|            | `minikube ip`                   | 查看集群运行 IP              | 用于直接访问节点或配置 SSH 登录                            |
|            | `kubectl port-forward ...`      | 端口转发                   | 临时绕过复杂网络直接访问 Pod/Service                      |
| **高级扩展**   | `minikube addons list`          | 查看插件列表                 | 检查 Ingress, Dashboard, GPU 等是否开启              |
|            | `minikube addons enable <name>` | 开启特定功能                 | 例如 `enable ingress` 或 `enable metrics-server` |
|            | `minikube dashboard`            | 启动图形化管理界面              | 网页直观查看 Pod 状态和 CPU/内存占用                       |
| **排难与底层**  | `minikube logs -f`              | 实时查看集群日志               | 控制面组件（API Server 等）报错时的首选排查手段                 |
|            | `minikube ssh`                  | 进入节点内部 Shell           | 像操作普通 Linux 一样进入 K8s 节点内部                     |
|            | `minikube update-check`         | 检查版本更新                 | 保持工具处于最新状态以支持新特性                              |
|            |                                 |                        |                                               |
## References
https://guangzhengli.com/courses/kubernetes
https://orbstack.dev

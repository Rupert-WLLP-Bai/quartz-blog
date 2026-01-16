---
title: 6.11-腾讯-CSIG-运营开发-暑期实习-一面
date: 2025-06-26T15:54:48.000Z
tags: [Recruitment, Tencent, TencentCSIG, Interview]
---

# 6.11 腾讯 一面 （6.17挂）

1. 实习三个项目分别讲
2. 项目中Redis的作用
3. 缓存击穿，穿透，雪崩
4. Raft的原理，项目中怎么实现的
5. 介绍etcd
6. ReadIndex怎么做的，有什么作用
7. 时钟漂移导致脏读是怎么来的
8. 故障恢复怎么做的
9. 什么情况会导致leader挂掉
10. 快照压缩和恢复怎么做的
11. 测试的时候，数据量大概有多少 （500MB）
12. KV底层用的什么数据结构存储 （哈希，map[string] string）
13. 多台机器上部署测试结果，本机200ms没有考虑网络的问题
14. PebbleDB，LSM Tree 和 B+ Tree，为什么这里使用LSM Tree
15. 磁盘为什么比内存慢（只答了硬件本身的区别和寻道）
16. Write Ahead Log，落盘怎么实现，遇到断电问题怎么解决，日志写在哪里
17. 延迟双删解决什么问题
18. 动态注册和服务发现是怎么做的
19. StatefulSet和Headless Service解决什么问题
20. select,poll,epoll 是怎么实现的，水平触发和垂直触发
21. epoll的数据结构，具体什么作用
22. Python GC是怎么做的
23. 编译型和解释型的区别，各自优势，应用场景
24. 浅拷贝和深拷贝
25. ACID 
26. 事务隔离级别
27. MVCC在不可重复读和读取已提交的作用
28. 数据库很慢从哪些方面排查（操作系统，网络等方面考虑） 

## 嵌入式项目细节
- 构建双 ESP32-C5 架构的 Wi-Fi CSI 感知系统，实现信道状态信息的采集、传输与板载处理 
- 基于 ESP-DSP 库在 MCU 上实现 FFT 与频域特征提取，完成呼吸率估计（MAE = 1.04）与运动检测（准确率达 95%） 
- 自建数据集并调优采样率，实现模型量化部署，边缘推理延迟控制在 50ms 内，功耗降低约 30% 
- 利用 FreeRTOS 事件循环与回调机制构建多任务处理系统，保障算法实时性与系统稳定性 
- 通过 MQTT 实时上传处理结果，结合 Web 前后端实现可视化监控与交互展示

### 实现上的细节
**发送端和接收端**
1. 发送端，发送无线帧
2. 接收端，负责CSI（信道状态信息）数据采集
3. 使用WiFi进行数据传输
4. wifi_csi_rx_cb 函数作为CSI回调，捕获传入的信道状态信息
5. 通过esp_wifi_set_csi_config配置CSI采集参数
6. 使用CSI_Q数组缓存采集到的CSI数据

**wifi_csi_rx_cb 函数做了什么**
1. 校验info和info->buf是否为空
2. 通过全局变量CSI_Q_ENABLE控制串口打印数据（调试用）或者调用csi_process函数（主要逻辑）
3. 存储RSSI（接收信号强度）到环形缓冲区，用 memmove 把 [1] 到 [N-1] 的数据向前移动一位 → 覆盖 [0] 到 [N-2]，然后将新数据 current_rssi 写入到最后一个位置 [N-1]，这里不能使用memcpy，因为dest和src之间是重叠的内存区域，memcpy会导致数据覆盖顺序错误。
4. 校验发送端的MAC地址
5. 采集前100包的AGC和FFT接受增益，然后配置宏 CONFIG_GAIN_CONTROL 和 CONFIG_FORCE_GAIN，强制锁定接受增益（自动增益会让 CSI 的幅值波动更大、重现性差，固定增益后，能使相同动作/呼吸在不同时刻 CSI 表现更一致，更适合后续机器学习或 FFT 特征匹配等任务）

**ESP-DSP库实现的板载信号处理**
*   **呼吸率估计**
    1. 信号预处理，获取直流分量（减去平均值）
    2. 带通滤波，使用ESP-DSP的biquad滤波器
    3. 自相关计算检测周期性
    4. 计算呼吸率
*   **运动检测**
    1. 计算标准差
    2. 阈值设置为1.0，高于阈值为运动状态

**数据集构建与模型优化**
- 自建数据集：
  - 采集了用于评估的动作检测数据（evaluation_motion和evaluation_static）
  - 采集了用于呼吸率估计的数据，包含了ground truth参考值
  - 设置了采样率优化，代码中显示：BREATH_SAMPLE_RATE_HZ = 50
- 模型量化：
  - 使用ESP-DSP库而非完整的FFT实现，优化计算性能
  - 代码中使用了float32而非double，减少计算开销
  - 优化了滤波参数：LOW_PASS_CUTOFF = 0.5f, HIGH_PASS_CUTOFF = 0.1f

**FreeRTOS多任务处理系统**
- 事件驱动模型：
  - WiFi事件处理：wifi_event_handler
  - CSI回调机制：wifi_csi_rx_cb
  - MQTT事件处理：mqtt_event_handler
- 回调处理
  ```c
  ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, &instance_any_id));
  ESP_ERROR_CHECK(esp_wifi_set_csi_rx_cb(wifi_csi_rx_cb, NULL));
  esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
  ```

**MQTT实时上传与可视化展示**
- 注册事件处理程序，定义mqtt_event_handler 进行错误处理
- 实现了断线重连机制：check_mqtt_connection()
- 备用服务器自动切换：broker.emqx.io作为公共备用服务器
- 使用vTaskDelay，每1秒发送一次，防止资源耗尽

## 分布式KV项目细节
**2. 项目中 Redis 的作用**
- 缓存热点 Key，减少 Raft+Pebble 的读压力；
- 降低高频访问数据的尾延迟（P99，从几十 ms 降到个位 ms）；
- 对读路径进行加速，不参与写一致性流程。

**3. 缓存击穿 / 穿透 / 雪崩**
- 击穿：一个热点 Key 失效，大量请求打到 DB；
  - 解决：加互斥锁 / 设置不过期热点；
- 穿透：请求的是根本不存在的数据；
  - 解决：布隆过滤器 / 空值缓存；
- 雪崩：大量缓存同一时间失效，DB 崩；
  - 解决：设置过期时间随机化 / 异步预热。

**4. Raft 原理 + 项目实现**
- 原理：一致性日志复制 + Leader 选举 + 状态机应用；
- 实现：
  - 使用 etcd/raft 库；
  - 定期心跳检测；
  - RequestVote 发起选举；
  - 日志复制 & Apply 到状态机；
  - 支持快照（snapshot）与恢复。

**5. 介绍 etcd**
- CNCF 项目，使用 Raft 保证强一致；
- 用作分布式配置、服务注册中心；
- 本项目中借用其 Raft 实现库（etcd/raft）。

**6. ReadIndex 是什么，有何作用**
- 作用：保证线性一致读（读时不落后于最新 commit 日志）；
- 实现：发起 ReadIndex 请求，由 Leader 加上当前 commit index 广播一次；
  - 成员收到确认后，Follower 可在该 index 前安全读。

**7. 时钟漂移导致脏读是怎么来的**
- 若不使用 ReadIndex 而直接使用本地读，本地时间偏差导致返回旧数据；
- 特别在**租约读（LeaseRead）**中，过期租约 + 时钟漂移可能返回脏数据。

**8. 故障恢复怎么做的**
- Follower 超时发起选举，重新选 Leader；
- 快照压缩 + WAL 恢复状态；
- 数据回放时，状态机恢复到一致状态。

**9. 什么情况会导致 Leader 挂掉**
- 网络隔离、宕机、进程崩溃、长时间 GC、磁盘卡顿；
- Raft 心跳超时后，Follower 发起新一轮选举。

**10. 快照压缩与恢复怎么做的**
- 每 10,000 条日志后触发 snapshot；
  - 触发：raftNode.TakeSnapshot()；
  - 保存：状态机 encode 后写入磁盘；
- 恢复：
  - Raft 加载快照；
  - StateMachine 解码快照，重建 KV 状态。

**11. 测试数据量（如 500MB）**
- 使用并发写入压力测试工具（自研或 k6）；
- 模拟 500MB 数据写入，观察写延迟和 GC；
- 同步测试 Redis 命中率 + Raft follower 压力。

**12. KV 底层数据结构**
- 内存层：map[string]string（读缓存）；
- 持久化层（Pebble）：LSM Tree（Key 排序 + 写放大优化）；
- Redis：自带 dict 哈希结构。

**13. 多机测试，本地无网络延迟**
- 本机测试 RTT 小于 1ms；
- 实际生产集群应部署在不同节点，考虑 RTT、网络丢包对 Raft 延迟影响；
- 本地 200ms 是逻辑处理 + Raft 心跳检测的估算值。

**14. 为什么使用 PebbleDB（LSM Tree）而非 B+ Tree？**
- LSM Tree 写性能更高（顺序写 WAL + Memtable）；
- 更适合高写入吞吐 KV 场景；
- B+ Tree 适合频繁读随机更新，对磁盘 IO 更敏感。

**15. 磁盘比内存慢的原因**
- 内存是电子级访问（ns），磁盘有机械臂寻道（ms）；
- SSD 虽快，但仍需页管理 + 写放大；
- CPU → DRAM（100ns）→ SSD（100μs）→ HDD（ms）差几个量级。

**16. WAL 日志落盘与断电恢复**
- 每次写操作前先写 WAL 文件；
- WAL 使用 fsync 或 fdatasync 保证落盘；
- 断电后从 WAL 重放恢复；
- WAL 文件一般写在 /data/wal/ 或指定 Pebble 路径中。

**17. 延迟双删解决的问题**
- 防止缓存与 DB 不一致；
- 逻辑：更新 DB → 删除缓存 → 延迟再删一次；
- 解决：并发读请求更新缓存的问题（缓存提前被读回）。

**18. 动态注册与服务发现怎么做的**
- 每个节点启动时注册自身 IP/ID 到 etcd；
- 其他节点监听 etcd 变化，更新集群拓扑；
- 通过 Headless Service 或 etcd watch 实现服务发现。

**19. StatefulSet 和 Headless Service 的作用**
- StatefulSet：有序部署 + 稳定网络 ID（pod-0, pod-1）；
- Headless Service：无负载均衡，返回所有 Pod DNS；
- 用于节点间 Raft 通信（必须知道具体 Peer 地址）。

---
tags:
  - X-Algorithm
  - Recommendation-System
  - Machine-Learning
  - Information-Retrieval
  - Two-Tower-Model
  - Open-Source
---

## 候选检索阶段

Light Ranker（轻量排序）阶段负责从海量可用内容池中进行候选推文的初步检索。与对少量项目进行计算密集型打分的 [[Heavy Ranker (Phoenix)]] 不同，Light Ranker 必须高效地筛选数百万条推文，以找到几千条相关的候选推文。

该阶段聚合了来自两个主要来源的内容：**In-Network (Thunder)** 和 **Out-of-Network (Phoenix Retrieval)**。

## 1. Thunder (In-Network 检索)
**Thunder** 是一个高效的内存存储系统，专为检索用户明确关注的账户内容而设计。它作为 [[System Architecture]] 的 "In-Network"（关注流）来源。

### 功能
在 `thunder/thunder_service.rs` 中实现，Thunder 优先考虑速度和时效性。
- **来源**: 严格从用户的社交图谱（关注列表）中获取推文。
- **机制**:
    1.  接收包含 `user_id` 和 `following_user_ids` 的请求。
    2.  查询内存中的 `PostStore` (`get_all_posts_by_users`) 以查找关注账户的最新推文。
    3.  过滤掉之前看过的推文 (`exclude_tweet_ids`)。
- **打分**: Thunder 使用轻量级启发式算法，而不是深度神经网络。主要的打分函数是 **Recency (时效性)**。
    ```rust
    fn score_recent(mut light_posts: Vec<LightPost>, max_results: usize) -> Vec<LightPost> {
        // 按创建时间排序（最新的在前）
        light_posts.sort_unstable_by_key(|post| Reverse(post.created_at));
        light_posts.into_iter().take(max_results).collect()
    }
    ```

## 2. Phoenix Retrieval (Out-of-Network 检索)
对于用户社交图谱之外的内容（"Out-of-Network"），系统使用 **双塔神经网络架构 (Two-Tower Neural Architecture)**。这允许基于用户兴趣和历史互动进行语义检索，而不仅仅是基于社交连接。

### 架构原理
在 `phoenix/recsys_retrieval_model.py` 中实现。双塔模型的核心思想是将“用户”和“推文”映射到同一个高维向量空间。如果两个向量在该空间中距离很近（点积大），则认为该推文与用户兴趣匹配。

#### A. 用户塔 (User Tower)
- **目的**: 理解用户当前的兴趣状态。
- **输入**: 用户 ID 哈希 + 用户的历史互动序列（点赞了什么，回复了什么）。
- **模型**: 使用与 Heavy Ranker 相同的 **Phoenix Transformer**。这确保了检索阶段和精排阶段对用户兴趣的理解是一致的。
- **输出**: 一个 L2 归一化的 Embedding 向量 (`user_representation`)。

#### B. 候选塔 (Candidate Tower)
- **目的**: 表达推文的内容特征。
- **输入**: 推文 ID 哈希 + 作者 ID 哈希。
- **模型**: 一个简单的多层感知机 (MLP)。之所以用 MLP 而不用 Transformer，是因为需要对海量候选推文进行离线预计算，MLP 更轻量高效。
- **输出**: 一个 L2 归一化的 Embedding 向量 (`candidate_embeddings`)。

#### C. 近似最近邻搜索 (ANN Search)
在推理时，系统：
1.  实时计算用户的 `user_representation`。
2.  在预先构建的推文向量索引中，查找与用户向量 **点积 (Dot Product)** 最大的 Top-K 个推文。
    *   X 内部可能使用了类似 HNSW 或 ScaNN 的算法来实现这种大规模向量检索（虽然代码中只展示了模型定义，未展示 ANN 服务代码）。

## In-Network vs. Out-of-Network 来源对比

| 特性 | In-Network (Thunder) | Out-of-Network (Phoenix Retrieval) |
| :--- | :--- | :--- |
| **来源** | 社交图谱 (你关注的人) | 全球语料库 (机器学习发现) |
| **检索逻辑** | 确定性查找 (Lookup) | 概率性 / 语义相似度 (Similarity) |
| **打分** | 时效性 (Recency) | Embedding 点积 (Relevance) |
| **模型** | 内存索引 | 双塔神经网络 (Transformer + MLP) |
| **目的** | "不错过朋友的更新" | "发现新的相关内容" |

这两个流被合并后发送到 [[Heavy Ranker (Phoenix)]] 进行最终的统一打分。

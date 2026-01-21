---
tags:
  - X-Algorithm
  - Recommendation-System
  - Machine-Learning
  - Deep-Learning
  - Transformer
  - Open-Source
---

## 核心打分模型

**Heavy Ranker (Phoenix)** 是 "For You" Feed 流的核心打分模型，负责通过预测用户互动的概率来对候选推文进行排序。它用纯深度学习方法取代了传统的基于启发式的排序。

## 模型架构
该模型是从 xAI 的 [[System Architecture]] 移植而来的 **基于 Grok 的 Transformer**。

- **基础模型**: 修改版的 Grok-1 Transformer。
- **输入序列**: `[User Context, History Items, Candidate Items]`
- **Embedding 策略**: 使用基于哈希的 Embedding（每个用户/项目 2 个哈希），以处理海量的用户和推文词汇表，而无需巨大的 Embedding 表。

### 候选隔离 (Candidate Isolation)
这是该模型最关键的架构创新。在标准的 Transformer 中，序列中的所有 Token 通常都可以互相“看见”（Self-Attention）。但在推荐排序中，候选推文 A 的得分不应该受到候选推文 B 是否存在的影响。

Phoenix 通过 **Masked Attention** 实现了这一点：
```
Attention Mask (谁可以看谁):
- User/History  ---> 可以看 ---> User/History (全双向注意力)
- Candidates    ---> 可以看 ---> User/History (获取用户兴趣上下文)
- Candidates    ---> 不能看 ---> Other Candidates (互相隔离)
- Candidates    ---> 可以看 ---> Self (自身特征)
```
**代码体现**: 在 `phoenix/README.md` 中有详细的可视化矩阵描述。这种设计使得模型可以一次性对 Batch 中的所有候选推文进行打分，同时保持每个推文打分的独立性。

## 输入 (Inputs)
模型接受结合了用户上下文和候选推文的 Batch 数据 (`RecsysBatch`)：

1. **用户上下文 (User Context)**:
   - **用户历史**: 用户最近互动的序列 (`history_post_hashes`, `history_actions`)。
   - **用户 Embeddings**: 用户 ID 的哈希表示 (`user_hashes`)。
2. **候选集 (Candidates)**:
   - 待排序的候选推文列表 (`candidate_post_hashes`)。
   - 包含作者 Embeddings (`candidate_author_embeddings`)。
   - 包含上下文特征（例如 `product_surface`，即推文是在哪里发布的）。

**block_candidate_reduce 函数**:
模型使用 `block_candidate_reduce` 函数将分散的特征（推文 ID、作者 ID、上下文特征）通过投影矩阵（Projection Matrix）压缩成单一的 Dense Embedding，作为 Transformer 的输入 Token。

## 输出 (Outputs)
模型为每个候选推文输出特定互动行为的概率分布。这些原始概率输入到 [[Scoring Logic]] 中以计算最终权重。

### 互动概率 (Engagement Probabilities)
`PhoenixScorer` 提取以下具体预测值：
- **正向信号**: `favorite_score` (点赞), `reply_score` (回复), `retweet_score` (转推), `share_score` (分享), `click_score` (点击), `dwell_time` (停留).
- **负向信号**: `not_interested_score` (不感兴趣), `block_author_score` (拉黑作者), `mute_author_score` (静音作者), `report_score` (举报).
- **客户端行为**: `photo_expand_score` (图片展开), `profile_click_score` (头像点击).

## 关键类/函数名称

### Python (模型定义)
- **`PhoenixModel`**: 包装 Transformer 的主要 JAX/Haiku 模块。
- **`RecsysBatch`**: 定义输入张量（Hashes, Actions, Surfaces）的 NamedTuple。
- **`RecsysEmbeddings`**: 预查找 Embedding 表的容器。
- **`block_candidate_reduce`**: 将候选特征（推文、作者）组合成单个序列 Embedding 的函数。

### Rust (打分实现)
- **`PhoenixScorer`**: 在 Home Mixer 中实现打分 Trait 的结构体。
- **`score`**: 构建预测请求并调用推理服务的异步方法。
- **`extract_phoenix_scores`**: 将原始模型输出（Logits/概率）映射到下游过滤器和排序器使用的 `PhoenixScores` 结构体。

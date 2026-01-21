---
tags:
  - X-Algorithm
  - Recommendation-System
  - Machine-Learning
  - Open-Source
---

## 架构概览

核心推荐系统建立在 **Candidate Pipeline（候选人管道）** 框架之上，负责协调从内容召回到最终生成排序Feed流的整个数据流程。该架构强调了候选人召回（Sourcing）、数据丰富（Hydration）、过滤（Filtering）和打分（Scoring）之间的关注点分离。

## 高层数据流

	数据流遵循由 **Home Mixer** 管理的线性管道执行流程：

```d2
direction: down

Request: For You Feed 请求
Mixer: Home Mixer
QueryHydration: 查询数据丰富 (Query Hydration)

Request -> Mixer -> QueryHydration

候选生成: {
  label: "候选生成 (Light Ranker)"
  Sources: Sources
  Thunder: Thunder (关注流 In-Network)
  PhoenixRet: Phoenix Retrieval (发现流 Out-of-Network)

  QueryHydration -> Sources
  Sources -> Thunder
  Sources -> PhoenixRet
}

Candidates: Candidates
Thunder -> Candidates
PhoenixRet -> Candidates

Hydration: 候选数据丰富 & 特征提取
Filters: 预打分过滤 (Pre-Scoring Filters)

Candidates -> Hydration -> Filters

排序: {
  label: "排序 (Heavy Ranker)"
  Scoring: 打分阶段
  PhoenixModel: Phoenix 模型 (Grok)
  WeightedScore: 加权打分 (Weighted Scoring)

  Filters -> Scoring
  Scoring -> PhoenixModel
  Scoring -> WeightedScore
}

Selection: 选择 (Top K)
PostFilters: 可见性 & 安全过滤
Response: 排序后的 Feed

WeightedScore -> Selection -> PostFilters -> Response
```

## Candidate Pipeline 概念

系统使用定义在 `candidate-pipeline/` 中的可复用框架，将推荐步骤抽象为可组合的 Trait（特征）。这允许并行执行和易于扩展。

- **核心 Traits**:
    - `Source`: 获取初始候选集 (例如 `PhoenixSource`, `ThunderSource`)。
    - `Hydrator`: 丰富候选人元数据 (例如 `CoreDataCandidateHydrator`)。
    - `Filter`: 移除无效候选人 (例如 `DropDuplicatesFilter`)。
    - `Scorer`: 分配数值分数 (例如 `PhoenixScorer`)。
    - `Selector`: 选择最终结果集 (例如 `TopKScoreSelector`)。

## 关键组件详解

### 1. Home Mixer (编排器)
**实现**: `home-mixer/server.rs`
作为整个推荐系统的入口，Home Mixer 负责将用户的 gRPC 请求转化为推荐管道的执行。它初始化 `PhoenixCandidatePipeline`，并负责将各个独立的组件（Thunder, Phoenix, Filters）组装起来。

### 2. Thunder (In-Network 实时引擎)
**实现**: `thunder/` 目录
专为“关注流”设计的高性能内存存储。
- **功能**: 它可以亚毫秒级地返回用户关注对象的最新推文。
- **存储**: 在内存中维护了 `PostStore`，当 Kafka 推送新推文时实时更新。

### 3. Phoenix (机器学习骨干)
**实现**: `phoenix/` 目录
负责“发现流”的深度学习组件。它解决了两个问题：
1.  **召回 (Retrieval)**: 从数亿条推文中找到几千条相关的。
2.  **精排 (Heavy Ranking)**: 对这几千条推文进行精确的互动率预测。

### 4. 数据丰富 (Hydration)
在召回之后，原始候选集通常只包含推文 ID。Pipeline 会并行执行 Hydrators 来获取下游所需的特征：
- **CoreDataHydrator**: 获取推文文本、媒体信息、作者信息。
- **Feature Hydration**: 为模型准备特征（虽然 X 的模型主要依赖端到端序列，但仍需一些基础元数据）。

### 5. 过滤系统 (Filtering System)
过滤在管道的多个阶段发生，以确保内容质量和安全：
- **Pre-Scoring Filters (打分前)**:
    - `DropDuplicatesFilter`: 去重。
    - `SelfTweetFilter`: 过滤掉用户自己发的推文。
    - `MutedKeywordFilter`: 过滤包含用户屏蔽词的推文。
    - `AuthorSocialgraphFilter`: 过滤掉被用户拉黑或静音的作者。
- **Post-Selection Filters (选择后)**:
    - `VFFilter` (Visibility Filter): 最终的安全检查，过滤掉由于违规、NSFW 或其他原因不应展示的内容。
    - `DedupConversationFilter`: 确保 Feed 中不会出现同一对话串的重复部分。

### 6. 副作用 (Side Effects)
**实现**: `home-mixer/side_effects/`
在请求完成后异步执行的任务，不阻塞用户响应：
- `CacheRequestInfoSideEffect`: 缓存请求信息，用于后续的分析或上下文保持。
- **Kafka Logging**: 记录展示（Impression）日志，用于后续的模型训练反馈闭环。

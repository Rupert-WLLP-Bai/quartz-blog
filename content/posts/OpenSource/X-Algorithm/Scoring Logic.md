---
tags:
  - X-Algorithm
  - Recommendation-System
  - Machine-Learning
  - Ranking
  - Open-Source
---

## 加权打分机制

**打分逻辑 (Scoring Logic)** 将 [[Heavy Ranker (Phoenix)]] 预测的原始概率转换为用于最终推文排序的单个标量值。该逻辑在 `home-mixer/scorers/weighted_scorer.rs` 中实现。

## 打分公式

最终分数计算为各个互动概率的 **加权求和 (Weighted Sum)**，并经过归一化处理。

$$ \text{Final Score} = \text{Normalize}(\sum (\text{Weight}_i \times P(\text{Action}_i))) $$

系统优先考虑建设性的互动（回复、转推）而非被动消费（点击），同时严厉惩罚用户的负面反馈。

## 概率权重 (Weights)

`WeightedScorer` 结合了以下组件。（注意：具体的权重数值定义在 `params` 中，该文件未开源，但键名在代码中可见）。

### 正向互动信号 (Positive Engagement Signals)
这些行为会增加推文的分数：
- `P(favorite)` (点赞): 基础的正向反馈。
- `P(reply)` (回复): 权重通常高于点赞，代表深度互动。
- `P(retweet)` (转推): 代表分享意愿。
- `P(quote)` (引用推文): 代表讨论意愿。
- `P(share)`, `P(share_via_dm)`: 私密分享也是强信号。
- `P(dwell_time)`: 用户在推文上停留的时间，用于捕捉“看了但没点赞”的兴趣。

### 负向互动信号 (Negative Engagement Signals)
这些行为会大幅降低分数。**注意代码中的处理逻辑**：
- `P(not_interested)` (不感兴趣)
- `P(block_author)` (拉黑作者)
- `P(mute_author)` (静音作者)
- `P(report)` (举报)

这些概率乘以负权重后，会从总分中扣除。

## 分数校准与归一化 (Calibration & Normalization)

代码中包含两个关键的后处理步骤，确保分数在数学上是稳健的：

### 1. 负分偏移 (Offset Score)
在 `offset_score` 函数中，系统处理了负权重可能导致的总分为负的情况。
- **逻辑**: 如果 `combined_score < 0`，它会通过公式 `(score + negative_sum) / sum * offset` 将其映射到一个较小的正数区间。
- **目的**: 确保最终输出的分数总是非负的，便于后续的 Log 转换或概率解释，同时保留了负面信号的相对排序能力。

### 2. 最终归一化 (Normalize Score)
在计算出加权分数后，还会调用 `normalize_score`（来自 `score_normalizer` 模块）。这通常用于将原始的 Logits 或无界分数映射到 `[0, 1]` 区间，或者调整分布以匹配下游系统的期望（虽然具体实现未完全展示，但它是标准操作）。

## 特殊调整机制

### 作者多样性 (Author Diversity)
虽然不是加权求和的一部分，但打分管道在加权打分器之后紧接着包含一个 **Author Diversity Scorer** (`author_diversity_scorer.rs`)。
- **目的**: 防止单个作者霸占 Feed 流。
- **机制**: 
    - 遍历已排序的候选列表。
    - 记录每个作者出现的次数。
    - 如果是该作者的第 N 条推文，乘以一个衰减系数：`score * decay_factor^N`。
    - 这是一种 **"Soft Demotion" (软降权)** 策略，比直接硬删除更平滑。

### Out-of-Network (OON) 调优
`OON Scorer` 专门针对非关注人的内容调整分数，这可能是为了校准最终 Feed 中 "In-Network"（关注）和 "Out-of-Network"（发现）内容的比例。

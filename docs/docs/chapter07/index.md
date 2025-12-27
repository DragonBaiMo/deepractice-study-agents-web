---
title: 第7章：AgentX 事件驱动智能体框架
order: 0
---
# 第7章：AgentX 事件驱动智能体框架

> 从理论到实践 —— 用事件驱动架构构建生产级智能体

在第六章中，我们学习了 Deepractice 团队提出的多智能体协作方法论：4P 理论、AI 任务状态机、PATEOAS 和 AI 组织化。这些方法论回答了"应该如何设计"的问题。

本章将介绍 **AgentX** —— Deepractice 团队开发的事件驱动智能体框架。AgentX 是这些方法论的工程实现，它将第五章 PromptX 的认知能力与第六章的设计原则结合，提供了一个完整的智能体开发和运行时平台。

---

## 本章核心问题

在开始学习之前，请思考这些问题：

> **问题一**：为什么智能体需要"事件驱动"架构？传统的请求-响应模式有什么不足？

> **问题二**：如何让智能体的状态在多轮对话中保持连续？

> **问题三**：如何将 PromptX 的角色、工具、记忆能力集成到一个可运行的系统中？

> **问题四**：生产环境的智能体系统需要考虑哪些工程问题？

---

## 本章目录

| 节 | 标题 | 核心内容 | 预计阅读时间 |
|----|------|---------|-------------|
| 7.1 | [AgentX 简介与设计哲学](7.1-AgentX简介与设计哲学.md) | 事件驱动架构、Mealy Machine、四层事件模型 | 20分钟 |
| 7.2 | [快速开始](7.2-快速开始.md) | 安装配置、第一个智能体、Portagent 体验 | 15分钟 |
| 7.3 | [核心概念](7.3-核心概念.md) | AgentEngine、SystemBus、Driver/Presenter | 25分钟 |
| 7.4 | [运行时系统](7.4-运行时系统.md) | Container、Environment、Persistence | 25分钟 |
| 7.5 | [与 PromptX 集成](7.5-与PromptX集成.md) | 角色激活、工具调用、记忆管理 | 20分钟 |
| 7.6 | [本章小结](7.6-本章小结.md) | 核心回顾、学习检查、下一步 | 10分钟 |

**总计阅读时间**：约 2 小时

---

## 学习目标

完成本章学习后，你将能够：

- [ ] 理解**事件驱动架构**相比请求-响应模式的优势
- [ ] 掌握 AgentX 的**四层事件模型**：Stream、State、Message、Turn
- [ ] 理解 **Mealy Machine** 模式在智能体中的应用
- [ ] 使用 AgentX 构建一个完整的智能体应用
- [ ] 理解 **SystemBus** 的事件通信机制
- [ ] 将 **PromptX** 的认知能力集成到 AgentX 运行时

---

## 知识图谱

```
AgentX 事件驱动智能体框架
│
├── 🎯 设计哲学
│   ├── 事件驱动：所有操作通过事件通信
│   ├── Mealy Machine：(state, input) → (state, outputs)
│   ├── 分层解耦：Agent / Runtime / Environment
│   └── TypeScript 原生：类型安全的开发体验
│
├── 📦 核心包结构
│   ├── @agentxjs/agent：AgentEngine 核心引擎
│   ├── @agentxjs/runtime：运行时基础设施
│   ├── @agentxjs/network：网络通信层
│   ├── @agentxjs/ui：用户界面组件
│   └── @agentxjs/types：类型定义
│
├── 🔄 四层事件模型
│   ├── Stream Events：实时文本/工具增量
│   ├── State Events：会话生命周期
│   ├── Message Events：完整的用户/助手消息
│   └── Turn Events：分析和使用追踪
│
├── ⚙️ 运行时组件
│   ├── SystemBus：中央事件总线
│   ├── Container：智能体生命周期管理
│   ├── Environment：外部系统接口（Claude API）
│   └── Persistence：数据持久化（SQLite/Memory）
│
└── 🔗 生态集成
    ├── PromptX：角色认知系统
    ├── MCP：工具协议支持
    └── Claude SDK：LLM 交互
```

---

## 核心概念预览

### 事件驱动 vs 请求-响应

```
传统请求-响应模式：
用户 → 请求 → 服务器 → 响应 → 用户
         [同步阻塞，等待完成]

事件驱动模式：
用户 → 事件 → SystemBus → 多个处理器并行响应
         [异步非阻塞，实时流式]
```

### Mealy Machine 状态转换

```typescript
// AgentEngine 的核心转换公式
(state, input) → (state, outputs)

// 示例：处理用户消息
(idle, userMessage) → (thinking, [startThinking])
(thinking, llmChunk) → (thinking, [streamText])
(thinking, llmEnd) → (idle, [messageComplete])
```

### 四层事件模型

| 层级 | 事件类型 | 用途 |
|-----|---------|------|
| **Stream** | text_delta, tool_delta | 实时流式输出 |
| **State** | thinking_start, thinking_end | 会话状态管理 |
| **Message** | user_message, assistant_message | 完整消息记录 |
| **Turn** | turn_complete, usage_stats | 轮次统计分析 |

---

## 与其他章节的关系

```
第五章：PromptX（认知能力）
    │ 角色、工具、记忆
    ▼
第六章：Deepractice 方法论（设计原则）
    │ 4P、状态机、PATEOAS、组织化
    ▼
【第七章】：AgentX（工程实现）
    │ 事件驱动、运行时、集成
    ▼
第八章：主流多智能体框架（对比学习）
    │ AutoGen、AgentScope、CAMEL、LangGraph
    ▼
第九章：记忆与检索（能力扩展）
```

---

## 官方资源

### AgentX 项目

| 资源 | 描述 | 地址 |
|-----|------|------|
| AgentX | 事件驱动智能体框架 | [github.com/Deepractice/AgentX](https://github.com/Deepractice/AgentX) |
| Portagent | 开箱即用的智能体门户 | 通过 `npx @agentxjs/portagent` 启动 |
| NPM | 包发布地址 | [@agentxjs](https://www.npmjs.com/org/agentxjs) |

### 快速体验

```bash
# 方式一：NPX 快速启动（开发环境）
export ANTHROPIC_API_KEY=your-api-key
npx @agentxjs/portagent

# 方式二：Docker 部署（生产环境）
docker run -d \
  -e ANTHROPIC_API_KEY=your-api-key \
  -p 5200:5200 \
  agentxjs/portagent
```

---

## 开始学习

准备好了吗？让我们从理解 AgentX 的设计哲学开始，看看事件驱动架构如何改变智能体开发的方式。

**[开始学习：7.1 AgentX 简介与设计哲学](7.1-AgentX简介与设计哲学.md)**

---

[上一章：Deepractice 智能体框架体系](../chapter06/) | [返回总目录](../) | [下一章：主流多智能体框架](../chapter08/)

---

*最后更新：2025 年 12 月*

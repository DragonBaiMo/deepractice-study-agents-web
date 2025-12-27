# Deepractice Agents 文档站点

> 基于 VitePress 构建的企业级教学资料网站

[![Deploy](https://github.com/yejunhao159/deepractice-agents/actions/workflows/deploy.yml/badge.svg)](https://github.com/yejunhao159/deepractice-agents/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 简介

本项目是 Deepractice Agents 智能体开发教程的文档站点，提供：

- 📚 16 章完整教程内容
- 🗺️ 学习地图与路径规划
- 📦 外部资源聚合与管理
- 🔍 全文搜索功能
- 📱 响应式设计，支持移动端

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/yejunhao159/deepractice-agents.git
cd deepractice-agents/docs-site

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看站点。

### 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
docs-site/
├── docs/                          # 文档内容
│   ├── .vitepress/               # VitePress 配置
│   │   ├── config.ts             # 站点配置
│   │   └── theme/                # 主题定制
│   │       ├── index.ts          # 主题入口
│   │       ├── sidebar.ts        # 侧边栏配置
│   │       ├── styles/           # 自定义样式
│   │       └── components/       # 增强组件
│   ├── docs/                     # 教程章节
│   ├── learning-map/             # 学习地图
│   ├── resources/                # 资源库
│   └── public/                   # 静态资源
├── scripts/                      # 构建脚本
│   ├── prebuild.js              # 预构建
│   ├── lint-content.js          # 内容校验
│   ├── generate-nav.js          # 导航生成
│   ├── generate-search-index.js # 搜索索引
│   └── check-links.js           # 链接检查
├── .github/workflows/            # CI/CD 配置
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ 可用命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | 检查内容规范 |
| `npm run check:links` | 检查链接有效性 |
| `npm run validate` | 完整验证（lint + links） |

## 📝 内容规范

### Frontmatter 字段

每篇文档应包含以下 Frontmatter：

```yaml
---
title: 文档标题        # 必填
order: 1              # 排序号（推荐）
tags: [tag1, tag2]    # 标签（推荐）
status: stable        # 状态：draft/stable/deprecated
---
```

### 目录规范

- `docs/` 为内容根目录
- `docs/chapterXX/` 为章节目录
- 每章必须有 `README.md` 作为章首页
- 图片统一放在 `docs/images/` 或章节内 `assets/`

### 增强组件

支持以下 Markdown 增强组件：

```vue
<!-- 提示块 -->
<Callout type="info" title="提示">
  这是一条提示信息
</Callout>

<!-- 步骤块 -->
<Steps>
  <Step>第一步</Step>
  <Step>第二步</Step>
</Steps>

<!-- 演示块 -->
<Demo title="演示">
  演示内容
</Demo>

<!-- 代码运行 -->
<CodeRun language="javascript">
```javascript
console.log('Hello, World!')
```
</CodeRun>
```

## 🔄 CI/CD

项目使用 GitHub Actions 实现自动化：

1. **内容校验**：检查 Frontmatter、标题层级、图片引用
2. **链接检查**：验证内部链接有效性
3. **自动构建**：生成导航、搜索索引、站点产物
4. **自动部署**：部署到 GitHub Pages
5. **定期巡检**：每周检查外部链接

## 📊 可观测性

- 页面访问统计（可接入 Google Analytics）
- 搜索词统计
- 404 页面统计
- 构建产物大小监控

## 🔒 安全

- Markdown 渲染防 XSS
- 外部链接安全策略（nofollow、新窗口）
- CSP 内容安全策略
- 资源大小限制

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Datawhale Hello-Agents](https://github.com/datawhalechina/hello-agents) - 原始教程内容
- [Deepractice](https://github.com/yejunhao159/deepractice-agents) - 技术支持

---

**Deepractice Team** - 让 AI 开发更简单

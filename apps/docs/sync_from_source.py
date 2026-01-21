#!/usr/bin/env python3
"""
Deepractice Content Sync Script
================================
从源仓库 (deepractice-agents-main/docs) 自动同步并转换 Markdown 文件到 Nextra 项目。

功能：
1. 扫描源仓库的所有章节和 .md 文件
2. 转换为 Nextra 兼容的 .mdx 格式（添加 frontmatter）
3. 自动生成 _meta.json 配置
4. 生成 URL 友好的文件名（slug）
5. 支持增量更新和全量同步

用法：
    python sync_from_source.py [--dry-run] [--full] [--chapter CHAPTER]

参数：
    --dry-run       预览模式，不实际修改文件
    --full          全量同步（删除旧文件后重新生成）
    --chapter       只同步指定章节（如 chapter01, chapter-01）

示例：
    python sync_from_source.py --dry-run          # 预览同步
    python sync_from_source.py                    # 增量同步
    python sync_from_source.py --full             # 全量同步
    python sync_from_source.py --chapter chapter01  # 只同步第一章
"""

import os
import sys
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime


@dataclass
class FileMapping:
    """源文件到目标文件的映射"""
    source_path: Path
    target_path: Path
    slug: str
    title: str
    order: int  # 文件排序（从文件名提取的数字）


class DeepracticeContentSync:
    def __init__(
        self,
        source_dir: Path,
        target_dir: Path,
        dry_run: bool = False,
        full_sync: bool = False
    ):
        self.source_dir = source_dir
        self.target_dir = target_dir
        self.dry_run = dry_run
        self.full_sync = full_sync

        # 根目录额外页面（非章节）
        self.root_pages_meta: Dict[str, str] = {}

        # 统计
        self.stats = {
            "scanned": 0,
            "created": 0,
            "updated": 0,
            "skipped": 0,
            "errors": 0
        }

        # 章节名称映射（用于 _meta.json）
        self.chapter_titles = {
            "chapter-01": "第一章：初识智能体",
            "chapter-02": "第二章：智能体的前世今生",
            "chapter-03": "第三章：大语言模型基础",
            "chapter-04": "第四章：PromptX 框架",
            "chapter-05": "第五章：AgentX 框架",
            "chapter-06": "第六章：从单智能体到多智能体",
            "chapter-07": "第七章：Multigent 架构",
            "chapter-08": "第八章：综合实战",
            "chapter-09": "第九章：Monogent 架构",
            "chapter-10": "第十章：记忆系统",
            "chapter-11": "第十一章：工具使用",
            "chapter-12": "第十二章：多智能体协作",
            "chapter-13": "第十三章：高级主题",
            "chapter-14": "第十四章：实战项目",
            "chapter-15": "第十五章：最佳实践",
            "chapter-16": "第十六章：未来展望",
        }

    def log(self, msg: str, level: str = "INFO"):
        prefix = {"INFO": "✓", "WARN": "⚠", "ERROR": "✗", "DRY": "○", "SKIP": "→"}
        symbol = prefix.get(level, "•")
        print(f"  {symbol} {msg}")

    def normalize_chapter_name(self, name: str) -> str:
        """将 chapter01 标准化为 chapter-01"""
        match = re.match(r'^chapter(\d+)$', name, re.IGNORECASE)
        if match:
            return f"chapter-{match.group(1).zfill(2)}"
        return name

    def extract_file_info(self, filename: str) -> Tuple[int, str, str]:
        """
        从文件名提取排序号、slug 和标题
        例如: "1.1-什么是智能体.md" -> (11, "what-is-agent", "什么是智能体")
        """
        stem = Path(filename).stem

        # 跳过 README
        if stem.lower() == "readme":
            return (0, "index", "章节概览")

        # 匹配模式: X.Y-标题 或 X.Y-Title
        match = re.match(r'^(\d+)\.(\d+)-(.+)$', stem)
        if match:
            major, minor, title = match.groups()
            order = int(major) * 100 + int(minor)
            slug = self.generate_slug(title)
            return (order, slug, title)

        # 其他文件
        slug = self.generate_slug(stem)
        return (999, slug, stem)

    def generate_slug(self, title: str) -> str:
        """生成 URL 友好的 slug"""
        # 中文标题到英文 slug 的映射
        slug_map = {
            "什么是智能体": "what-is-agent",
            "智能体如何工作": "how-agent-works",
            "构建第一个智能体": "first-agent",
            "智能体应用生态": "agent-ecosystem",
            "习题与讨论": "exercises",
            "本章小结": "summary",

            "符号主义时代": "symbolic-era",
            "构建规则聊天机器人": "rule-chatbot",
            "心智社会理论": "society-of-mind",
            "学习范式演进": "learning-paradigm",
            "智能体爆发时代": "agent-explosion",

            "语言模型简史": "language-model-history",
            "Prompt工程基础": "prompt-engineering",
            "LLM的能力与边界": "llm-capabilities",
            "从LLM到智能体架构": "llm-to-agent",

            "五分钟体验PromptX": "promptx-quickstart",
            "上下文鸿沟": "context-gap",
            "语义鸿沟": "semantic-gap",
            "Nuwa角色创建": "nuwa-role",
            "Luban工具创建": "luban-tool",
            "Engram记忆网络": "engram-memory",

            "AgentX简介与设计哲学": "agentx-intro",
            "快速开始": "quick-start",
            "核心概念": "core-concepts",
            "运行时系统": "runtime-system",
            "与PromptX集成": "promptx-integration",

            "从单智能体到多智能体": "single-to-multi",
            "4P理论": "4p-theory",
            "AI任务状态机": "ai-state-machine",
            "PATEOAS": "pateoas",
            "AI组织化": "ai-organization",

            "Multigent架构深入": "multigent-deep",
            "Orchestra方法实战": "orchestra-practice",
            "运行时与调度器实现": "runtime-scheduler",

            "综合实战项目": "comprehensive-project",
            "项目一": "project-1",
            "项目二": "project-2",
            "项目三": "project-3",

            "Monogent架构深入": "monogent-deep",
            "Experience与Evolution实战": "experience-evolution",
            "七阶段管道实现": "seven-stage-pipeline",

            # Chapter 07 (paradigms)
            "环境准备与基础工具": "environment-setup",
            "ReAct范式": "react-pattern",
            "Plan-and-Solve范式": "plan-and-solve",
            "Reflection范式": "reflection",
            "范式与框架对照": "paradigm-framework-compare",

            # Chapter 09 extras
            "双基质策略设计": "dual-matrix-strategy",
            "与AgentX-PromptX集成": "agentx-promptx-integration",

            # Root pages
            "前言": "preface",
            "教材章节重构建议-完整版": "restructure-suggestions-full",
            "章节重构建议": "restructure-suggestions",
        }

        if title in slug_map:
            return slug_map[title]

        # 自动生成 slug（英文转小写连字符，中文用拼音或保留）
        slug = title.lower()
        slug = re.sub(r'[^\w\u4e00-\u9fff]+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        slug = slug.strip('-')

        return slug if slug else "page"

    def sync_root_pages(self) -> None:
        """同步源 docs 根目录下的非章节 Markdown 页面"""
        # 只处理根目录的 .md，跳过 index.md（由 sync_index 处理）
        for md_file in sorted(self.source_dir.glob("*.md")):
            self.stats["scanned"] += 1

            if md_file.name.lower() == "index.md":
                continue

            title = Path(md_file.name).stem
            slug = self.generate_slug(title)
            target = self.target_dir / f"{slug}.mdx"

            try:
                content = self.convert_md_to_mdx(md_file, title)

                if self.dry_run:
                    self.log(f"[DRY-RUN] {md_file.name} -> {target.name}", "DRY")
                else:
                    target.write_text(content, encoding="utf-8")
                    self.log(f"{md_file.name} -> {target.name}")

                self.root_pages_meta[slug] = title
                self.stats["updated"] += 1
            except Exception as e:
                self.stats["errors"] += 1
                self.log(f"错误 {md_file.name}: {e}", "ERROR")

    def sanitize_for_mdx(self, content: str) -> str:
        """清理内容使其兼容 MDX"""
        # 0. 先保护代码块
        code_blocks = []
        def save_code_block(match):
            code_blocks.append(match.group(0))
            return f"__CODE_BLOCK_{len(code_blocks) - 1}__"

        # 保存 ``` 代码块
        content = re.sub(r'```[\s\S]*?```', save_code_block, content)
        # 保存 ` 行内代码
        content = re.sub(r'`[^`]+`', save_code_block, content)

        # 1. 自闭合标签：<br> -> <br />，<hr> -> <hr />
        content = re.sub(r'<br\s*>', '<br />', content)
        content = re.sub(r'<hr\s*>', '<hr />', content)

        # 2. 修复 HTML 标签中的属性问题
        def fix_html_tag(match):
            tag = match.group(0)
            # 不处理代码块占位符
            if '__CODE_BLOCK_' in tag:
                return tag

            # 找到所有属性并修复
            # 模式：识别 attr="...任意内容直到真正的结束引号..."
            def fix_attributes(tag_content):
                result = []
                i = 0
                while i < len(tag_content):
                    # 查找属性开始 name="
                    attr_match = re.match(r'(\w+)="', tag_content[i:])
                    if attr_match:
                        attr_name = attr_match.group(1)
                        i += len(attr_match.group(0))

                        # 收集属性值直到遇到真正的结束引号
                        # 真正的结束引号后面是空格、/ 或 >
                        value_chars = []
                        while i < len(tag_content):
                            char = tag_content[i]
                            # 检查是否是结束引号
                            if char == '"':
                                # 检查后面是否是属性结束标志
                                next_char = tag_content[i+1] if i+1 < len(tag_content) else ''
                                if next_char in [' ', '/', '>', '\t', '\n', '']:
                                    break
                                else:
                                    # 不是真正的结束引号，跳过
                                    i += 1
                                    continue
                            # 跳过中文引号
                            elif char in ['"', '"', ''', ''']:
                                i += 1
                                continue
                            else:
                                value_chars.append(char)
                                i += 1

                        value = ''.join(value_chars)
                        result.append(f'{attr_name}="{value}"')
                        i += 1  # 跳过结束引号
                    else:
                        result.append(tag_content[i])
                        i += 1

                return ''.join(result)

            # 提取标签名和内容
            if tag.startswith('</'):
                return tag  # 闭合标签不处理

            # 分离 < 和 >
            inner = tag[1:-1] if tag.endswith('>') else tag[1:]
            if inner.endswith('/'):
                inner = inner[:-1]
                is_self_closing = True
            else:
                is_self_closing = False

            fixed = fix_attributes(inner)

            # 重建标签
            if tag.startswith('<img') or tag.startswith('<br') or tag.startswith('<hr'):
                return f'<{fixed} />'
            elif is_self_closing:
                return f'<{fixed} />'
            else:
                return f'<{fixed}>'

        # 匹配 HTML 标签
        content = re.sub(r'<[^>]+>', fix_html_tag, content)

        # 3. 恢复代码块
        for i, block in enumerate(code_blocks):
            content = content.replace(f"__CODE_BLOCK_{i}__", block)

        # 4. 处理 HTML 注释（MDX 不支持）
        content = re.sub(r'<!--[\s\S]*?-->', '', content)

        # 5. 修复表格中的 <br> 标签
        content = re.sub(r'\|([^|]*)<br>([^|]*)\|', r'|\1<br />\2|', content)

        return content

    def convert_md_to_mdx(self, source_file: Path, title: str) -> str:
        """将 .md 转换为 .mdx 格式"""
        content = source_file.read_text(encoding="utf-8")

        # 应用 MDX 兼容性清理
        content = self.sanitize_for_mdx(content)

        # 检查是否已有 frontmatter
        if content.startswith("---"):
            return content

        # 从内容提取第一个标题作为描述
        first_heading = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        description = first_heading.group(1) if first_heading else title

        # 清理 description 中的特殊字符
        description = description.replace('"', '\\"')

        frontmatter = f'''---
title: "{title}"
description: "{description}"
---

'''
        return frontmatter + content

    def scan_source_chapter(self, chapter_dir: Path) -> List[FileMapping]:
        """扫描源章节目录，返回文件映射列表"""
        mappings = []
        chapter_name = self.normalize_chapter_name(chapter_dir.name)
        target_chapter_dir = self.target_dir / chapter_name

        for md_file in chapter_dir.glob("*.md"):
            self.stats["scanned"] += 1
            order, slug, title = self.extract_file_info(md_file.name)

            # 确定目标文件名
            target_filename = "index.mdx" if slug == "index" else f"{slug}.mdx"
            target_path = target_chapter_dir / target_filename

            mappings.append(FileMapping(
                source_path=md_file,
                target_path=target_path,
                slug=slug,
                title=title,
                order=order
            ))

        # 按顺序排序
        mappings.sort(key=lambda m: m.order)
        return mappings

    def generate_chapter_meta(self, mappings: List[FileMapping]) -> Dict:
        """生成章节的 _meta.json"""
        meta = {}
        for m in mappings:
            meta[m.slug] = m.title
        return meta

    def sync_chapter(self, chapter_dir: Path):
        """同步单个章节"""
        chapter_name = self.normalize_chapter_name(chapter_dir.name)
        target_chapter_dir = self.target_dir / chapter_name

        print(f"\n[{chapter_name}] 同步中...")

        # 扫描源文件
        mappings = self.scan_source_chapter(chapter_dir)
        if not mappings:
            self.log(f"无 .md 文件", "SKIP")
            return

        # 全量同步时先清空目标目录
        if self.full_sync and target_chapter_dir.exists():
            if self.dry_run:
                self.log(f"[DRY-RUN] 将清空目录: {chapter_name}", "DRY")
            else:
                shutil.rmtree(target_chapter_dir)
                self.log(f"清空目录: {chapter_name}")

        # 确保目标目录存在
        if not self.dry_run:
            target_chapter_dir.mkdir(parents=True, exist_ok=True)

        # 同步文件
        for m in mappings:
            self.sync_file(m)

        # 生成 _meta.json
        meta = self.generate_chapter_meta(mappings)
        meta_path = target_chapter_dir / "_meta.json"

        if self.dry_run:
            self.log(f"[DRY-RUN] 将生成 _meta.json ({len(meta)} 条)", "DRY")
        else:
            meta_path.write_text(
                json.dumps(meta, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8"
            )
            self.log(f"生成 _meta.json ({len(meta)} 条)")

    def sync_file(self, mapping: FileMapping):
        """同步单个文件"""
        source = mapping.source_path
        target = mapping.target_path

        # 检查是否需要更新
        if target.exists() and not self.full_sync:
            source_mtime = source.stat().st_mtime
            target_mtime = target.stat().st_mtime

            if source_mtime <= target_mtime:
                self.stats["skipped"] += 1
                return

        try:
            content = self.convert_md_to_mdx(source, mapping.title)

            if self.dry_run:
                self.log(f"[DRY-RUN] {source.name} -> {target.name}", "DRY")
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding="utf-8")
                self.log(f"{source.name} -> {target.name}")

            if target.exists():
                self.stats["updated"] += 1
            else:
                self.stats["created"] += 1

        except Exception as e:
            self.stats["errors"] += 1
            self.log(f"错误 {source.name}: {e}", "ERROR")

    def generate_root_meta(self):
        """生成根目录的 _meta.json"""
        meta = {"index": "课程首页"}

        # 根目录页面（除 index 以外）
        for slug, title in sorted(self.root_pages_meta.items()):
            meta[slug] = title

        # 添加所有存在的章节
        for i in range(1, 17):
            chapter_name = f"chapter-{str(i).zfill(2)}"
            chapter_dir = self.target_dir / chapter_name
            if chapter_dir.exists() and any(chapter_dir.glob("*.mdx")):
                meta[chapter_name] = self.chapter_titles.get(chapter_name, chapter_name)

        # 添加其他目录
        for extra in ["learning-map", "resources"]:
            extra_dir = self.target_dir / extra
            if extra_dir.exists():
                meta[extra] = extra.replace("-", " ").title()

        meta_path = self.target_dir / "_meta.json"

        if self.dry_run:
            self.log(f"[DRY-RUN] 将更新根 _meta.json ({len(meta)} 条)", "DRY")
        else:
            meta_path.write_text(
                json.dumps(meta, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8"
            )
            self.log(f"更新根 _meta.json ({len(meta)} 条)")

    def sync_index(self):
        """同步根 index.mdx（如果源有 index.md）"""
        source_index = self.source_dir / "index.md"
        target_index = self.target_dir / "index.mdx"

        if source_index.exists():
            content = self.convert_md_to_mdx(source_index, "智能体工程化实战")

            if self.dry_run:
                self.log(f"[DRY-RUN] 将更新 index.mdx", "DRY")
            else:
                target_index.write_text(content, encoding="utf-8")
                self.log(f"更新 index.mdx")

    def run(self, chapter_filter: Optional[str] = None) -> bool:
        """执行同步"""
        print("\n" + "=" * 60)
        print("Deepractice Content Sync")
        print("=" * 60)
        print(f"源目录: {self.source_dir}")
        print(f"目标目录: {self.target_dir}")

        if self.dry_run:
            print("\n[DRY-RUN 模式] 不会实际修改文件")
        if self.full_sync:
            print("[FULL 模式] 全量同步")

        # 验证源目录
        if not self.source_dir.exists():
            self.log(f"源目录不存在: {self.source_dir}", "ERROR")
            return False

        # 获取章节列表
        chapters = sorted([
            d for d in self.source_dir.iterdir()
            if d.is_dir() and d.name.lower().startswith("chapter")
        ], key=lambda d: d.name)

        if chapter_filter:
            normalized = self.normalize_chapter_name(chapter_filter.replace("-", ""))
            chapters = [c for c in chapters if self.normalize_chapter_name(c.name) == normalized]
            if not chapters:
                self.log(f"未找到章节: {chapter_filter}", "ERROR")
                return False

        print(f"\n发现 {len(chapters)} 个章节")

        # 同步各章节
        for chapter_dir in chapters:
            self.sync_chapter(chapter_dir)

        # 同步根文件
        print("\n[根目录] 同步中...")
        self.sync_index()
        self.sync_root_pages()
        self.generate_root_meta()

        # 报告
        print("\n" + "-" * 60)
        print("同步完成!")
        print(f"  • 扫描: {self.stats['scanned']}")
        print(f"  • 创建: {self.stats['created']}")
        print(f"  • 更新: {self.stats['updated']}")
        print(f"  • 跳过: {self.stats['skipped']}")
        print(f"  • 错误: {self.stats['errors']}")
        print("-" * 60 + "\n")

        return self.stats["errors"] == 0


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Deepractice Content Sync")
    parser.add_argument("--dry-run", action="store_true", help="预览模式")
    parser.add_argument("--full", action="store_true", help="全量同步")
    parser.add_argument("--chapter", type=str, help="只同步指定章节")
    parser.add_argument(
        "--source",
        type=str,
        help="源 docs 目录路径（例如 .tmp/deepractice-agents/docs）"
    )
    parser.add_argument(
        "--target",
        type=str,
        help="目标 content 目录路径（默认: apps/docs/content）"
    )
    args = parser.parse_args()

    # 路径配置
    script_dir = Path(__file__).parent
    source_dir = Path(args.source) if args.source else Path(
        r"I:\CustomBuild\Project\deepractice-study-agents-web\deepractice-agents-main\docs"
    )
    target_dir = Path(args.target) if args.target else (script_dir / "content")

    syncer = DeepracticeContentSync(
        source_dir=source_dir,
        target_dir=target_dir,
        dry_run=args.dry_run,
        full_sync=args.full
    )

    success = syncer.run(chapter_filter=args.chapter)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

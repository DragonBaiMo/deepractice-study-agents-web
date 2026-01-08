#!/usr/bin/env python3
"""
Content Sync & Fix Script
==========================
扫描所有 _meta.json，检测缺失的 .mdx 文件，并从源项目同步转换。

功能：
1. 扫描所有 _meta.json 声明的页面
2. 检测哪些 .mdx 文件缺失
3. 从源项目查找对应的 .md 文件并转换为 .mdx
4. 自动添加 frontmatter
5. 移除 _meta.json 中不存在且无法同步的条目

用法：
    python sync_content.py [--dry-run] [--fix-meta]

参数：
    --dry-run   预览模式，不实际修改
    --fix-meta  移除 _meta.json 中无法找到源文件的条目
"""

import os
import sys
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple, Optional


class ContentSyncer:
    def __init__(
        self,
        content_dir: Path,
        source_dir: Path,
        dry_run: bool = False,
        fix_meta: bool = False
    ):
        self.content_dir = content_dir
        self.source_dir = source_dir
        self.dry_run = dry_run
        self.fix_meta = fix_meta

        # 统计
        self.missing_files: List[Tuple[str, str]] = []  # (chapter, slug)
        self.synced_files: List[str] = []
        self.unfound_files: List[Tuple[str, str]] = []
        self.fixed_metas: List[str] = []

        # 章节映射：content 目录名 -> 源目录名
        self.chapter_mapping = {
            "chapter-01": "chapter01",
            "chapter-02": "chapter02",
            "chapter-03": "chapter03",
            "chapter-04": "chapter04",
            "chapter-05": "chapter05",
            "chapter-06": "chapter06",
            "chapter-07": "chapter07",
            "chapter-08": "chapter08",
            "chapter-09": "chapter09",
            "chapter-10": "chapter10",
            "chapter-11": "chapter11",
            "chapter-12": "chapter12",
            "chapter-13": "chapter13",
            "chapter-14": "chapter14",
            "chapter-15": "chapter15",
            "chapter-16": "chapter16",
        }

        # slug 到源文件名的映射（需要处理中文文件名）
        self.slug_patterns = self._build_slug_patterns()

    def _build_slug_patterns(self) -> Dict[str, List[str]]:
        """构建 slug 到可能的源文件名的映射"""
        return {
            # Chapter 01
            "what-is-agent": ["1.1-什么是智能体", "什么是智能体"],
            "how-agent-works": ["1.2-智能体如何工作", "智能体如何工作"],
            "first-agent": ["1.3-构建第一个智能体", "构建第一个智能体"],
            "agent-ecosystem": ["1.4-智能体应用生态", "智能体应用生态"],
            "exercises": ["习题与讨论", "练习"],
            "agent-vs-llm": ["智能体与LLM的关系", "智能体与 LLM 的关系"],

            # Chapter 02
            "symbolic-era": ["2.1-符号主义时代"],
            "rule-chatbot": ["2.2-构建规则聊天机器人"],
            "society-of-mind": ["2.3-心智社会理论"],
            "learning-paradigm": ["2.4-学习范式演进"],
            "agent-explosion": ["2.5-智能体爆发时代"],

            # Chapter 03
            "language-model-history": ["3.1-语言模型简史"],
            "prompt-engineering": ["3.2-Prompt工程基础"],
            "llm-capabilities": ["3.3-LLM的能力与边界"],
            "llm-to-agent": ["3.4-从LLM到智能体架构"],

            # Chapter 04
            "environment-setup": ["4.1-环境准备与基础工具"],
            "react-pattern": ["4.2-ReAct范式"],
            "plan-and-solve": ["4.3-Plan-and-Solve范式"],
            "reflection": ["4.4-Reflection范式"],
            "handwritten-to-framework": ["4.5-从手写到框架"],
            "summary": ["本章小结", "章节小结"],

            # Chapter 05
            "promptx-quickstart": ["5.1-五分钟体验PromptX"],
            "semantic-gap": ["5.2-语义鸿沟"],
            "nuwa-role": ["5.3-Nuwa角色创建"],
            "luban-tool": ["5.4-Luban工具创建"],
            "engram-memory": ["5.5-Engram记忆网络"],

            # Chapter 06
            "single-to-multi": ["6.1-从单智能体到多智能体"],
            "4p-theory": ["6.2-4P理论"],
            "ai-state-machine": ["6.3-AI任务状态机"],
            "pateoas": ["6.4-PATEOAS"],
            "ai-organization": ["6.5-AI组织化"],

            # Chapter 07
            "agentx-intro": ["7.1-AgentX简介与设计哲学"],
            "quick-start": ["7.2-快速开始"],
            "core-concepts": ["7.3-核心概念"],
            "runtime-system": ["7.4-运行时系统"],
            "promptx-integration": ["7.5-与PromptX集成"],

            # Chapter 09
            "monogent-deep": ["9.1-Monogent架构深入"],
            "experience-evolution": ["9.2-Experience与Evolution实战"],
            "seven-stage-pipeline": ["9.3-七阶段管道实现"],
        }

    def log(self, msg: str, level: str = "INFO"):
        prefix = {"INFO": "✓", "WARN": "⚠", "ERROR": "✗", "DRY": "○", "SKIP": "→"}
        symbol = prefix.get(level, "•")
        print(f"  {symbol} {msg}")

    def find_source_file(self, chapter: str, slug: str) -> Optional[Path]:
        """查找源项目中对应的 .md 文件"""
        source_chapter = self.chapter_mapping.get(chapter)
        if not source_chapter:
            return None

        source_chapter_dir = self.source_dir / source_chapter
        if not source_chapter_dir.exists():
            return None

        # 尝试直接匹配 slug
        patterns = self.slug_patterns.get(slug, [slug])

        for md_file in source_chapter_dir.glob("*.md"):
            stem = md_file.stem
            # 跳过 README
            if stem.lower() == "readme":
                continue

            for pattern in patterns:
                if pattern in stem or stem in pattern:
                    return md_file

            # 尝试数字前缀匹配
            # 例如 "what-is-agent" 匹配 "1.1-什么是智能体"
            if re.match(r'^\d+\.\d+-', stem):
                # 提取中文部分
                chinese_part = re.sub(r'^\d+\.\d+-', '', stem)
                for pattern in patterns:
                    if chinese_part == pattern or pattern in chinese_part:
                        return md_file

        return None

    def convert_md_to_mdx(self, md_file: Path, title: str) -> str:
        """将 .md 转换为 .mdx 格式"""
        content = md_file.read_text(encoding="utf-8")

        # 提取现有的 frontmatter（如果有）
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        if frontmatter_match:
            # 已有 frontmatter，保留
            return content

        # 添加 frontmatter
        # 从第一个标题提取描述
        first_heading = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        description = first_heading.group(1) if first_heading else title

        frontmatter = f"""---
title: {title}
description: {description}
---

"""
        return frontmatter + content

    def scan_meta_files(self) -> Dict[str, Dict]:
        """扫描所有 _meta.json 文件"""
        metas = {}
        for meta_file in self.content_dir.rglob("_meta.json"):
            # 跳过备份目录
            if "_backup" in str(meta_file):
                continue

            rel_path = meta_file.parent.relative_to(self.content_dir)
            try:
                meta_content = json.loads(meta_file.read_text(encoding="utf-8"))
                metas[str(rel_path)] = {
                    "path": meta_file,
                    "content": meta_content
                }
            except json.JSONDecodeError:
                self.log(f"无法解析: {meta_file}", "ERROR")

        return metas

    def check_missing_files(self, metas: Dict[str, Dict]) -> List[Tuple[str, str, str]]:
        """检查缺失的文件，返回 (目录, slug, title) 列表"""
        missing = []

        for rel_dir, meta_info in metas.items():
            meta_content = meta_info["content"]
            chapter_dir = self.content_dir / rel_dir

            for slug, title in meta_content.items():
                # 跳过特殊条目
                if isinstance(title, dict):
                    continue
                if slug == "index":
                    continue

                # 检查是否是目录引用（目录存在则跳过）
                slug_dir = chapter_dir / slug
                if slug_dir.is_dir():
                    continue

                # 检查文件是否存在
                mdx_file = chapter_dir / f"{slug}.mdx"
                md_file = chapter_dir / f"{slug}.md"

                if not mdx_file.exists() and not md_file.exists():
                    missing.append((rel_dir, slug, title))

        return missing

    def sync_file(self, chapter: str, slug: str, title: str) -> bool:
        """同步单个文件"""
        source = self.find_source_file(chapter, slug)

        if source is None:
            self.unfound_files.append((chapter, slug))
            return False

        target = self.content_dir / chapter / f"{slug}.mdx"

        if self.dry_run:
            self.log(f"[DRY-RUN] 将同步: {source.name} -> {target.name}", "DRY")
        else:
            content = self.convert_md_to_mdx(source, title)
            target.write_text(content, encoding="utf-8")
            self.log(f"同步: {source.name} -> {slug}.mdx")

        self.synced_files.append(str(target))
        return True

    def fix_meta_file(self, meta_path: Path, missing_slugs: List[str]):
        """移除 _meta.json 中缺失且无法同步的条目"""
        content = json.loads(meta_path.read_text(encoding="utf-8"))
        original_keys = list(content.keys())

        for slug in missing_slugs:
            if slug in content:
                del content[slug]

        if len(content) < len(original_keys):
            if self.dry_run:
                self.log(f"[DRY-RUN] 将修复 _meta.json: 移除 {missing_slugs}", "DRY")
            else:
                meta_path.write_text(
                    json.dumps(content, indent=2, ensure_ascii=False) + "\n",
                    encoding="utf-8"
                )
                self.log(f"修复 _meta.json: 移除 {len(original_keys) - len(content)} 个条目")
            self.fixed_metas.append(str(meta_path))

    def run(self) -> bool:
        """执行同步"""
        print("\n" + "=" * 60)
        print("Content Sync & Fix")
        print("=" * 60)

        if self.dry_run:
            print("\n[DRY-RUN 模式] 不会实际修改文件\n")

        # Step 1: 扫描 _meta.json
        print("\n[1/4] 扫描 _meta.json 文件...")
        metas = self.scan_meta_files()
        self.log(f"发现 {len(metas)} 个 _meta.json")

        # Step 2: 检查缺失文件
        print("\n[2/4] 检查缺失文件...")
        missing = self.check_missing_files(metas)
        self.log(f"发现 {len(missing)} 个缺失文件")

        if not missing:
            self.log("所有文件完整，无需同步")
            return True

        # Step 3: 同步文件
        print("\n[3/4] 从源项目同步文件...")
        unfound_by_chapter: Dict[str, List[str]] = {}

        for chapter, slug, title in missing:
            if self.sync_file(chapter, slug, title):
                pass
            else:
                if chapter not in unfound_by_chapter:
                    unfound_by_chapter[chapter] = []
                unfound_by_chapter[chapter].append(slug)
                self.log(f"未找到源文件: {chapter}/{slug}", "WARN")

        # Step 4: 修复 _meta.json（如果启用）
        print("\n[4/4] 处理无法同步的条目...")
        if self.fix_meta and unfound_by_chapter:
            for chapter, slugs in unfound_by_chapter.items():
                meta_path = self.content_dir / chapter / "_meta.json"
                if meta_path.exists():
                    self.fix_meta_file(meta_path, slugs)
        elif unfound_by_chapter:
            self.log("使用 --fix-meta 参数自动移除无法同步的条目", "SKIP")

        # 报告
        print("\n" + "-" * 60)
        print("同步完成!")
        print(f"  • 同步文件: {len(self.synced_files)}")
        print(f"  • 未找到源: {len(self.unfound_files)}")
        if self.fix_meta:
            print(f"  • 修复 meta: {len(self.fixed_metas)}")

        if self.unfound_files:
            print("\n未找到源文件的条目:")
            for chapter, slug in self.unfound_files:
                print(f"    - {chapter}/{slug}")

        print("-" * 60 + "\n")

        return len(self.unfound_files) == 0


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Content Sync Tool")
    parser.add_argument("--dry-run", action="store_true", help="预览模式")
    parser.add_argument("--fix-meta", action="store_true", help="修复 _meta.json")
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    content_dir = script_dir / "content"
    source_dir = Path(r"I:\CustomBuild\Project\deepractice-study-agents-web\deepractice-agents-main\docs")

    if not content_dir.exists():
        print(f"错误: content 目录不存在: {content_dir}")
        sys.exit(1)

    if not source_dir.exists():
        print(f"错误: 源目录不存在: {source_dir}")
        sys.exit(1)

    syncer = ContentSyncer(
        content_dir=content_dir,
        source_dir=source_dir,
        dry_run=args.dry_run,
        fix_meta=args.fix_meta
    )

    success = syncer.run()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Nextra Content Migration Script
================================
将 content/docs/* 的内容迁移到 content/*，修复路径嵌套导致的 404 问题。

功能：
1. 移动所有章节目录和文件到 content 根目录
2. 生成新的根级 _meta.json
3. 更新 MDX 文件中的内部链接（移除多余的 /docs 前缀）
4. 备份原始目录结构

用法：
    python migrate_content.py [--dry-run] [--no-backup]
"""

import os
import sys
import json
import shutil
import re
from pathlib import Path
from datetime import datetime


class ContentMigrator:
    def __init__(self, content_dir: Path, dry_run: bool = False, backup: bool = True):
        self.content_dir = content_dir
        self.docs_dir = content_dir / "docs"
        self.dry_run = dry_run
        self.backup = backup
        self.backup_dir = None
        self.migrated_items = []
        self.updated_files = []

    def log(self, msg: str, level: str = "INFO"):
        prefix = {"INFO": "✓", "WARN": "⚠", "ERROR": "✗", "DRY": "○"}
        symbol = prefix.get(level, "•")
        print(f"  {symbol} {msg}")

    def validate(self) -> bool:
        """验证目录结构是否符合迁移条件"""
        if not self.content_dir.exists():
            self.log(f"content 目录不存在: {self.content_dir}", "ERROR")
            return False

        if not self.docs_dir.exists():
            self.log(f"docs 子目录不存在: {self.docs_dir}", "ERROR")
            return False

        # 检查 content 根目录是否已有冲突文件
        existing_items = set(p.name for p in self.content_dir.iterdir() if p.name != "docs")
        docs_items = set(p.name for p in self.docs_dir.iterdir())
        conflicts = existing_items & docs_items

        if conflicts:
            self.log(f"存在命名冲突: {conflicts}", "ERROR")
            return False

        return True

    def create_backup(self):
        """创建 docs 目录的备份"""
        if not self.backup:
            return

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.backup_dir = self.content_dir / f"_backup_docs_{timestamp}"

        if self.dry_run:
            self.log(f"[DRY-RUN] 将创建备份: {self.backup_dir}", "DRY")
        else:
            shutil.copytree(self.docs_dir, self.backup_dir)
            self.log(f"备份已创建: {self.backup_dir}")

    def collect_items_to_migrate(self) -> list:
        """收集需要迁移的所有项目"""
        items = []
        for item in self.docs_dir.iterdir():
            if item.name == "_meta.json":
                continue  # 旧的 _meta.json 需要特殊处理
            items.append(item)
        return sorted(items, key=lambda p: p.name)

    def update_mdx_links(self, file_path: Path) -> bool:
        """更新 MDX 文件中的链接路径"""
        try:
            content = file_path.read_text(encoding="utf-8")
            original = content

            # 模式 1: Markdown 链接 [text](/docs/chapter-XX) -> [text](/chapter-XX)
            # 保留 /docs 作为文档根路径，只需确保链接正确
            # 实际上 Nextra 路由在 /docs 下，所以链接应该保持 /docs/chapter-XX
            # 但内容移到 content/ 后，Nextra 会自动映射

            # 检查是否有需要更新的链接（如果存在嵌套的 /docs/docs/ 情况）
            pattern = r'\]\(/docs/docs/'
            if re.search(pattern, content):
                content = re.sub(pattern, '](/docs/', content)

            if content != original:
                if self.dry_run:
                    self.log(f"[DRY-RUN] 将更新链接: {file_path.name}", "DRY")
                else:
                    file_path.write_text(content, encoding="utf-8")
                    self.log(f"更新链接: {file_path.name}")
                return True
            return False
        except Exception as e:
            self.log(f"更新文件失败 {file_path}: {e}", "ERROR")
            return False

    def migrate_items(self, items: list):
        """迁移所有项目到 content 根目录"""
        for item in items:
            dest = self.content_dir / item.name

            if self.dry_run:
                action = "目录" if item.is_dir() else "文件"
                self.log(f"[DRY-RUN] 将迁移{action}: {item.name}", "DRY")
            else:
                shutil.move(str(item), str(dest))
                self.log(f"迁移: {item.name}")

            self.migrated_items.append(item.name)

            # 更新迁移后的 MDX 文件链接
            if item.is_dir():
                for mdx_file in (dest if not self.dry_run else item).rglob("*.mdx"):
                    if self.update_mdx_links(mdx_file):
                        self.updated_files.append(str(mdx_file))
            elif item.suffix == ".mdx":
                target = dest if not self.dry_run else item
                if self.update_mdx_links(target):
                    self.updated_files.append(str(target))

    def generate_root_meta(self):
        """生成新的根级 _meta.json"""
        # 读取原有的 docs/_meta.json
        old_meta_path = self.docs_dir / "_meta.json"
        old_meta = {}
        if old_meta_path.exists():
            try:
                old_meta = json.loads(old_meta_path.read_text(encoding="utf-8"))
            except:
                pass

        # 构建新的 meta，包含所有章节
        new_meta = {}

        # 按顺序添加章节
        chapter_dirs = sorted([
            d.name for d in (self.content_dir if not self.dry_run else self.docs_dir).iterdir()
            if d.is_dir() and d.name.startswith("chapter-")
        ])

        # 如果是 dry-run，从 docs_dir 获取章节列表
        if self.dry_run:
            chapter_dirs = sorted([
                d.name for d in self.docs_dir.iterdir()
                if d.is_dir() and d.name.startswith("chapter-")
            ])

        # 章节标题映射
        chapter_titles = {
            "chapter-01": "第一章：初识智能体",
            "chapter-02": "第二章：LLM 基础",
            "chapter-03": "第三章：提示词工程",
            "chapter-04": "第四章：ReAct 范式",
            "chapter-05": "第五章：Plan-and-Solve",
            "chapter-06": "第六章：Reflection",
            "chapter-07": "第七章：PromptX 框架",
            "chapter-08": "第八章：AgentX 实战",
            "chapter-09": "第九章：Monogent 架构",
            "chapter-10": "第十章：记忆系统",
            "chapter-11": "第十一章：工具使用",
            "chapter-12": "第十二章：多智能体系统",
            "chapter-13": "第十三章：高级主题",
            "chapter-14": "第十四章：实战项目",
            "chapter-15": "第十五章：最佳实践",
            "chapter-16": "第十六章：未来展望",
        }

        # 首先添加 index
        new_meta["index"] = "课程首页"

        # 添加所有章节
        for chapter in chapter_dirs:
            new_meta[chapter] = chapter_titles.get(chapter, chapter)

        # 添加其他页面（如 learning-map, resources）
        if "learning-map" in old_meta or (self.docs_dir / "learning-map").exists():
            new_meta["learning-map"] = "学习地图"
        if "resources" in old_meta or (self.docs_dir / "resources").exists():
            new_meta["resources"] = "资源库"

        # 写入新的 _meta.json
        new_meta_path = self.content_dir / "_meta.json"

        if self.dry_run:
            self.log(f"[DRY-RUN] 将创建根级 _meta.json", "DRY")
            print(f"\n    新 _meta.json 内容预览:")
            print(json.dumps(new_meta, indent=2, ensure_ascii=False))
        else:
            new_meta_path.write_text(
                json.dumps(new_meta, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8"
            )
            self.log(f"创建根级 _meta.json")

    def cleanup_old_docs_dir(self):
        """清理旧的 docs 目录"""
        # 检查 docs 目录是否为空（除了 _meta.json）
        remaining = list(self.docs_dir.iterdir())
        remaining = [r for r in remaining if r.name != "_meta.json"]

        if not remaining:
            if self.dry_run:
                self.log(f"[DRY-RUN] 将删除空的 docs 目录", "DRY")
            else:
                # 删除 _meta.json 和 docs 目录
                meta_file = self.docs_dir / "_meta.json"
                if meta_file.exists():
                    meta_file.unlink()
                self.docs_dir.rmdir()
                self.log("删除空的 docs 目录")
        else:
            self.log(f"docs 目录仍有文件，保留: {[r.name for r in remaining]}", "WARN")

    def run(self) -> bool:
        """执行迁移"""
        print("\n" + "=" * 60)
        print("Nextra Content Migration")
        print("=" * 60)

        if self.dry_run:
            print("\n[DRY-RUN 模式] 不会实际修改文件\n")

        # Step 1: 验证
        print("\n[1/5] 验证目录结构...")
        if not self.validate():
            return False
        self.log("验证通过")

        # Step 2: 备份
        print("\n[2/5] 创建备份...")
        self.create_backup()

        # Step 3: 收集迁移项
        print("\n[3/5] 收集待迁移项目...")
        items = self.collect_items_to_migrate()
        self.log(f"发现 {len(items)} 个项目待迁移")

        # Step 4: 执行迁移
        print("\n[4/5] 执行迁移...")
        self.migrate_items(items)

        # Step 5: 生成新的 _meta.json
        print("\n[5/5] 生成配置...")
        self.generate_root_meta()
        self.cleanup_old_docs_dir()

        # 报告
        print("\n" + "-" * 60)
        print("迁移完成!")
        print(f"  • 迁移项目: {len(self.migrated_items)}")
        print(f"  • 更新文件: {len(self.updated_files)}")
        if self.backup_dir:
            print(f"  • 备份位置: {self.backup_dir}")
        print("-" * 60 + "\n")

        return True


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Nextra Content Migration Tool")
    parser.add_argument("--dry-run", action="store_true", help="预览模式，不实际执行")
    parser.add_argument("--no-backup", action="store_true", help="不创建备份")
    args = parser.parse_args()

    # 确定 content 目录路径
    script_dir = Path(__file__).parent
    content_dir = script_dir / "content"

    if not content_dir.exists():
        print(f"错误: 找不到 content 目录: {content_dir}")
        sys.exit(1)

    migrator = ContentMigrator(
        content_dir=content_dir,
        dry_run=args.dry_run,
        backup=not args.no_backup
    )

    success = migrator.run()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

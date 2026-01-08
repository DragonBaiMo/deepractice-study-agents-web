#!/usr/bin/env python3
"""
Markdown to MDX Migration Script
将 VitePress Markdown 文件迁移为 Nextra MDX 格式

功能：
1. 转换 frontmatter 格式
2. 将 Vue 组件语法转换为 JSX
3. 修复图片路径
4. 处理 Mermaid 图表
5. 生成 _meta.json 导航配置
"""

import os
import re
import json
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse


class MarkdownToMDXConverter:
    """Markdown 到 MDX 转换器"""

    def __init__(self, source_dir: str, target_dir: str):
        self.source_dir = Path(source_dir)
        self.target_dir = Path(target_dir)
        self.converted_count = 0
        self.error_files: List[str] = []

    def convert_all(self) -> None:
        """转换所有文件"""
        print(f"开始迁移: {self.source_dir} -> {self.target_dir}")

        # 确保目标目录存在
        self.target_dir.mkdir(parents=True, exist_ok=True)

        # 遍历源目录
        for md_file in self.source_dir.rglob("*.md"):
            try:
                self.convert_file(md_file)
                self.converted_count += 1
            except Exception as e:
                print(f"  [错误] {md_file}: {e}")
                self.error_files.append(str(md_file))

        # 生成 _meta.json 文件
        self.generate_meta_files()

        print(f"\n迁移完成:")
        print(f"  成功: {self.converted_count} 个文件")
        print(f"  失败: {len(self.error_files)} 个文件")

    def convert_file(self, source_file: Path) -> None:
        """转换单个文件"""
        # 计算相对路径
        rel_path = source_file.relative_to(self.source_dir)
        target_file = self.target_dir / rel_path.with_suffix(".mdx")

        # 确保目标目录存在
        target_file.parent.mkdir(parents=True, exist_ok=True)

        # 读取源文件
        content = source_file.read_text(encoding="utf-8")

        # 转换内容
        converted = self.convert_content(content, source_file.name)

        # 写入目标文件
        target_file.write_text(converted, encoding="utf-8")
        print(f"  [转换] {rel_path} -> {rel_path.with_suffix('.mdx')}")

    def convert_content(self, content: str, filename: str) -> str:
        """转换文件内容"""
        # 1. 处理 frontmatter
        content = self.convert_frontmatter(content, filename)

        # 2. 转换 Vue 组件为 JSX
        content = self.convert_vue_to_jsx(content)

        # 3. 修复图片路径
        content = self.convert_image_paths(content)

        # 4. 处理 HTML 标签
        content = self.convert_html_tags(content)

        # 5. 处理 Mermaid 图表
        content = self.convert_mermaid(content)

        return content

    def convert_frontmatter(self, content: str, filename: str) -> str:
        """转换 frontmatter"""
        # 匹配 frontmatter
        fm_pattern = r"^---\s*\n(.*?)\n---\s*\n"
        match = re.match(fm_pattern, content, re.DOTALL)

        if match:
            fm_content = match.group(1)
            rest_content = content[match.end():]

            # 解析并简化 frontmatter
            new_fm = self.simplify_frontmatter(fm_content, filename)
            return f"---\n{new_fm}---\n\n{rest_content}"
        else:
            # 没有 frontmatter，添加基本的
            title = self.extract_title(content, filename)
            return f"---\ntitle: {title}\n---\n\n{content}"

    def simplify_frontmatter(self, fm_content: str, filename: str) -> str:
        """简化 frontmatter，只保留必要字段"""
        lines = fm_content.strip().split("\n")
        result = {}

        current_key = None
        for line in lines:
            if ":" in line and not line.startswith(" "):
                key, value = line.split(":", 1)
                key = key.strip()
                value = value.strip()
                if key in ["title", "description"]:
                    result[key] = value
                current_key = key
            elif current_key and line.startswith(" "):
                # 多行值，跳过
                pass

        # 确保有 title
        if "title" not in result:
            result["title"] = self.filename_to_title(filename)

        return "\n".join(f"{k}: {v}" for k, v in result.items()) + "\n"

    def convert_vue_to_jsx(self, content: str) -> str:
        """将 Vue 组件语法转换为 JSX"""
        # Callout 组件
        # <Callout type="info">content</Callout>
        content = re.sub(
            r"<Callout\s+type=[\"'](\w+)[\"']\s*>",
            r'<Alert type="\1">',
            content
        )
        content = content.replace("</Callout>", "</Alert>")

        # 带 title 的 Callout
        content = re.sub(
            r"<Callout\s+type=[\"'](\w+)[\"']\s+title=[\"']([^\"']+)[\"']\s*>",
            r'<Alert type="\1" title="\2">',
            content
        )

        # Steps 组件
        content = re.sub(
            r"<Steps>",
            r"<Steps>",
            content
        )

        # CodeRun 组件
        content = re.sub(
            r"<CodeRun\s+lang=[\"'](\w+)[\"']\s*>",
            r'<CodePlayground language="\1" code={`',
            content
        )
        content = re.sub(
            r"</CodeRun>",
            r"`} />",
            content
        )

        # Demo 组件 - 转换为简单的图片或视频
        content = re.sub(
            r"<Demo\s+src=[\"']([^\"']+)[\"']\s*/>",
            r"![](\1)",
            content
        )

        return content

    def convert_image_paths(self, content: str) -> str:
        """修复图片路径"""
        # GitHub raw 图片保持不变
        # 本地图片路径转换
        content = re.sub(
            r"!\[([^\]]*)\]\(/images/([^)]+)\)",
            r"![\1](/images/\2)",
            content
        )

        # 处理 HTML img 标签
        content = re.sub(
            r'<img\s+src=["\']([^"\']+)["\']([^>]*)>',
            lambda m: f'<img src="{m.group(1)}"{m.group(2)} />',
            content
        )

        return content

    def convert_html_tags(self, content: str) -> str:
        """转换 HTML 标签为 JSX 兼容格式"""
        # 自闭合标签
        content = re.sub(r"<br>", r"<br />", content)
        content = re.sub(r"<hr>", r"<hr />", content)

        # class -> className
        content = re.sub(r'\bclass=(["\'])', r"className=\1", content)

        # style 属性（简单处理）
        # style="color: red" -> style={{ color: 'red' }}
        # 这个比较复杂，暂时保留原样

        return content

    def convert_mermaid(self, content: str) -> str:
        """处理 Mermaid 图表"""
        # Mermaid 代码块保持不变，Nextra 支持
        # 只需确保语法正确
        return content

    def extract_title(self, content: str, filename: str) -> str:
        """从内容中提取标题"""
        # 尝试从 H1 标题提取
        match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        if match:
            return match.group(1).strip()
        return self.filename_to_title(filename)

    def filename_to_title(self, filename: str) -> str:
        """将文件名转换为标题"""
        name = Path(filename).stem
        # 移除数字前缀如 "1.1-"
        name = re.sub(r"^\d+(\.\d+)?-?", "", name)
        # 将连字符转换为空格
        name = name.replace("-", " ").replace("_", " ")
        return name.strip() or "Untitled"

    def generate_meta_files(self) -> None:
        """生成 _meta.json 导航配置文件"""
        for dir_path in self.target_dir.rglob("*"):
            if dir_path.is_dir():
                self.generate_meta_for_dir(dir_path)

    def generate_meta_for_dir(self, dir_path: Path) -> None:
        """为单个目录生成 _meta.json"""
        meta_file = dir_path / "_meta.json"
        if meta_file.exists():
            return  # 已存在则跳过

        # 收集目录中的文件
        items = {}
        for item in sorted(dir_path.iterdir()):
            if item.name.startswith("_"):
                continue
            if item.is_file() and item.suffix == ".mdx":
                name = item.stem
                title = self.get_file_title(item)
                items[name] = title
            elif item.is_dir():
                items[item.name] = item.name.replace("-", " ").title()

        if items:
            meta_file.write_text(
                json.dumps(items, ensure_ascii=False, indent=2),
                encoding="utf-8"
            )
            print(f"  [生成] {meta_file.relative_to(self.target_dir)}")

    def get_file_title(self, file_path: Path) -> str:
        """从文件中获取标题"""
        try:
            content = file_path.read_text(encoding="utf-8")
            # 从 frontmatter 提取 title
            match = re.search(r"^title:\s*(.+)$", content, re.MULTILINE)
            if match:
                return match.group(1).strip().strip("\"'")
            # 从 H1 提取
            match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
            if match:
                return match.group(1).strip()
        except Exception:
            pass
        return file_path.stem.replace("-", " ").title()


def main():
    parser = argparse.ArgumentParser(
        description="将 VitePress Markdown 迁移为 Nextra MDX"
    )
    parser.add_argument(
        "--source",
        "-s",
        default="docs-site/docs",
        help="源目录路径 (默认: docs-site/docs)"
    )
    parser.add_argument(
        "--target",
        "-t",
        default="deepractice-platform/apps/docs/content/docs",
        help="目标目录路径 (默认: deepractice-platform/apps/docs/content/docs)"
    )
    parser.add_argument(
        "--dry-run",
        "-n",
        action="store_true",
        help="仅显示将要执行的操作，不实际转换"
    )

    args = parser.parse_args()

    # 获取项目根目录
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    source_dir = project_root / args.source
    target_dir = project_root / args.target

    if not source_dir.exists():
        print(f"错误: 源目录不存在: {source_dir}")
        return 1

    if args.dry_run:
        print("=== 干运行模式 ===")
        print(f"源目录: {source_dir}")
        print(f"目标目录: {target_dir}")
        print("\n将转换以下文件:")
        for md_file in source_dir.rglob("*.md"):
            rel_path = md_file.relative_to(source_dir)
            print(f"  {rel_path} -> {rel_path.with_suffix('.mdx')}")
        return 0

    converter = MarkdownToMDXConverter(str(source_dir), str(target_dir))
    converter.convert_all()

    return 0


if __name__ == "__main__":
    exit(main())

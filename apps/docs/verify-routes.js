#!/usr/bin/env node
/**
 * 路由批量验证脚本
 * 扫描所有 _meta.json，生成路由列表，批量验证 HTTP 状态码
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const CONTENT_DIR = path.join(__dirname, 'content');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const DOCS_PREFIX = '/docs';

// 收集所有路由
function collectRoutes() {
  const routes = [];

  function scanDir(dir, urlPrefix) {
    const metaPath = path.join(dir, '_meta.json');

    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

        for (const [slug, title] of Object.entries(meta)) {
          if (typeof title === 'object') continue; // 跳过复杂配置

          const fullPath = path.join(dir, slug);
          const routePath = urlPrefix ? `${urlPrefix}/${slug}` : `/${slug}`;

          // 检查是目录还是文件
          if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
            // 目录 - 添加 index 路由并递归
            routes.push({
              url: `${DOCS_PREFIX}${routePath}`,
              title: title,
              type: 'directory'
            });
            scanDir(fullPath, routePath);
          } else {
            // 文件
            const mdxPath = path.join(dir, `${slug}.mdx`);
            const mdPath = path.join(dir, `${slug}.md`);

            if (fs.existsSync(mdxPath) || fs.existsSync(mdPath) || slug === 'index') {
              routes.push({
                url: slug === 'index' ? `${DOCS_PREFIX}${urlPrefix || ''}` : `${DOCS_PREFIX}${routePath}`,
                title: title,
                type: 'page'
              });
            }
          }
        }
      } catch (e) {
        console.error(`解析失败: ${metaPath}`, e.message);
      }
    }
  }

  // 从 content 根目录开始扫描
  scanDir(CONTENT_DIR, '');

  // 去重
  const seen = new Set();
  return routes.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

// HTTP 请求
function checkUrl(url) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${url}`;

    http.get(fullUrl, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message
      });
    });
  });
}

// 批量验证
async function verifyAll(routes) {
  console.log('\n' + '='.repeat(60));
  console.log('路由批量验证');
  console.log('='.repeat(60));
  console.log(`\n目标: ${BASE_URL}`);
  console.log(`路由数量: ${routes.length}\n`);

  const results = {
    passed: [],
    failed: []
  };

  // 并发请求（限制并发数）
  const CONCURRENCY = 5;
  for (let i = 0; i < routes.length; i += CONCURRENCY) {
    const batch = routes.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(r => checkUrl(r.url)));

    for (const result of batchResults) {
      const route = routes.find(r => r.url === result.url);
      if (result.ok) {
        console.log(`  ✓ ${result.status} ${result.url}`);
        results.passed.push(result);
      } else {
        console.log(`  ✗ ${result.status || 'ERR'} ${result.url} ${result.error || ''}`);
        results.failed.push({ ...result, title: route?.title });
      }
    }
  }

  // 报告
  console.log('\n' + '-'.repeat(60));
  console.log('验证结果:');
  console.log(`  通过: ${results.passed.length}`);
  console.log(`  失败: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n失败的路由:');
    for (const f of results.failed) {
      console.log(`  - ${f.url} (${f.status || f.error})`);
    }
  }

  console.log('-'.repeat(60) + '\n');

  return results.failed.length === 0;
}

// 主函数
async function main() {
  console.log('扫描路由...');
  const routes = collectRoutes();

  console.log(`发现 ${routes.length} 个路由:`);
  routes.forEach(r => console.log(`  ${r.type === 'directory' ? '📁' : '📄'} ${r.url}`));

  const success = await verifyAll(routes);
  process.exit(success ? 0 : 1);
}

main().catch(console.error);

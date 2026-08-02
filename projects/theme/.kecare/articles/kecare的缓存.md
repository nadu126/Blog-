---
title: Kecare的缓存
date: 2026-08-02
author: Pamper
menu: test
translate:
  - zh-CN
---

# Kecare的缓存

Kecare作为一个静态网站生成器，在处理大量文章时面临着性能上的挑战。如果不采取任何缓存策略，每次生成都需要重新解析所有Markdown文件、重新调用AI翻译、重新生成HTML页面。随着文章数量的增长，这个过程会变得越来越漫长，而且大部分计算都是重复的。为了解决这些问题，Kecare设计了一套多层次的缓存体系。

## Chunk分批处理

在开始生成之前，Kecare首先需要面对的是Node.js的内存限制。Node.js底层使用V8引擎，默认堆内存上限在64位系统上约为**1.4GB**。当文章数量较多时，如果一次性将所有文章加载到内存中进行处理，很容易触发堆内存溢出（heap out of memory），导致进程崩溃。

因此Kecare采用了Chunk分批处理策略。在收集完所有待处理的文章后，生成器会根据当前系统的空闲内存动态计算每批处理的数量：

- 预估每篇文章需要约 **100MB** 的内存
- 通过 `os.freemem()` 获取系统当前空闲内存
- 取空闲内存与1.4GB上限的最小值作为可用内存
- 计算出每批次处理的文章数量：`batchSize = 可用内存 / 100MB`

每批文章并行处理完成后，Kecare会主动调用 `Bun.gc(true)` 触发垃圾回收，释放内存后再处理下一批次。这样既保证了处理效率，又避免了因内存不足导致的崩溃。

## 文章内容缓存

在没有缓存机制的情况下，每次运行 `kecare gen` 都会重新解析所有Markdown文件，即使文章内容没有任何变化。这对于只有一两篇文章的博客来说无所谓，但当文章数量增长到几十甚至上百篇时，每次都全量重新生成就显得非常浪费。

Kecare的解决方案是对文章内容进行Hash处理。具体流程是：

1. 读取Markdown文件的原始内容
2. 使用 `Bun.hash.xxHash3` 对原始内容计算Hash值
3. 将Hash值存储在 `.kecare/cache/markdown-manifest.json` 中

缓存清单的数据结构如下：

```json
{
  "version": 1,
  "articles": {
    "/天天禄杯S2.md": {
      "contentHash": "d76adc670d0bfc61",
      "variants": [
        {
          "lang": "zh-CN",
          "title": "天天禄杯S2",
          "html": "<div class=\"kecare\">...</div>",
          "hash": "aff462d2",
          "__REAL_FS_PATHS__": "...",
          "__REAL_RELATIVE_PATHS__": "..."
        }
      ]
    }
  }
}
```

每次运行时，Kecare会先加载缓存清单。对于每篇文章，计算其当前内容的Hash值，然后与缓存中的 `contentHash` 进行比较。如果Hash一致，说明文章内容没有发生任何变化，此时直接使用缓存中的 `variants` 数据，跳过Markdown解析、HTML渲染和AI翻译等所有后续逻辑。

需要注意的是，缓存命中时还会额外验证缓存的 `__REAL_FS_PATHS__` 对应的文件是否真实存在。如果某次构建的产物文件被人为删除，即使内容Hash匹配，Kecare也会重新生成该文章。

## 翻译分段缓存

AI翻译是整个生成流程中最消耗时间和Token的环节。Kecare支持多语言翻译，一篇文章可能需要翻译成多种语言。如果每次生成都对所有文章进行全量翻译，不仅耗时巨大，还会产生高昂的API费用。

为了解决这个问题，Kecare将Markdown文章按段落进行切分（以两个或以上换行符作为段落分隔），对每个段落独立进行翻译。每个段落的内容会被计算Hash值（同样是 `Bun.hash.xxHash3`），翻译结果与段落Hash的映射关系存储在 `.kecare/cache/translations/<语言>/<标题Hash>/translations.json` 中：

```json
{
  "927d12ac": "# Thank You for Contributing to the Kecare Theme Ecosystem",
  "27ec39bd": "Kecare is still in its early stages...",
  "77a37628": "This directory will guide you on how to start writing a theme..."
}
```

翻译时的缓存查找逻辑如下：

1. 将文章按段落切分
2. 计算每个段落的Hash值
3. 在 `.tmp` 目录中查找对应语言和标题的翻译缓存文件
4. 如果某个段落的Hash在缓存中存在，直接使用缓存的翻译结果，不调用AI
5. 如果不存在（说明该段落是新内容或内容有变化），才调用AI翻译，并将结果追加到缓存中

这种方式使得修改文章时，只需要重新翻译被修改的段落，未修改的段落仍然走缓存。对于长文章的微小改动，Token消耗可以降低90%以上。

## 搜索索引缓存

最终生成的文章页面会被输出到 `public/articles/` 目录中，每个语言变体生成一个独立的JSON文件（如 `aff462d2.zh-CN.json`）。此外，Kecare还会生成一个 `search-index.json` 搜索索引文件，包含所有文章的标题、语言、Hash、标签、日期和URL路径等信息，供前端的搜索功能使用。

```json
{
  "articles": [
    {
      "title": "Kecare的缓存",
      "lang": "zh-CN",
      "hash": "xxHashValue",
      "tags": [],
      "date": "2026-08-02",
      "urlPath": "articles/zh-CN/xxHashValue",
      "file": "xxHashValue.zh-CN.json"
    }
  ]
}
```

## 总结

Kecare的缓存体系覆盖了生成流程的多个层面：

| 缓存层 | 粒度 | 存储位置 | 作用 |
|--------|------|----------|------|
| Chunk分批 | 批次 | 内存 | 避免内存溢出，动态控制并发数 |
| 文章内容缓存 | 文章 | `.kecare/cache/markdown-manifest.json` | 跳过未修改文章的完整生成流程 |
| 翻译分段缓存 | 段落 | `.kecare/cache/translations/<语言>/<标题Hash>/` | 仅翻译修改过的段落，节省Token和时间 |
| 搜索索引 | 全站 | `public/articles/search-index.json` | 提供前端的文章搜索数据 |

通过这套多层缓存机制，Kecare在文章数量增长时依然能保持较快的生成速度。只有真正发生变化的内容才会被重新处理，其余部分都命中缓存、直接复用。这对于需要频繁修改和预览的写作流程来说，体验提升尤为明显。


                <script setup lang="ts">
                import BlogLanding from "~/components/blog-landing.vue";
                useHead({
                    title: '首页',
                })
                const articles = [
  {
    "lang": "zh-CN",
    "title": "Github pages",
    "isOriginalLang": true,
    "menu": "test",
    "desc": "部署到 GitHub Pages 将 Kecare 博客部署到 GitHub Pages 前置准备 在开始部署之前，请确保你已经准备好以下内容： Github账号 Git 和 Node.js 创建 GitHub 仓库 在 GitHub 创建...",
    "hash": "39f6b230",
    "relativePath": "/Github pages.md",
    "frontMatter": {
      "cover": "https://img.pichost.cloud/images/1785613091954.webp",
      "title": "Github pages",
      "menu": "test",
      "tags": [],
      "desc": "部署到 GitHub Pages 将 Kecare 博客部署到 GitHub Pages 前置准备 在开始部署之前，请确保你已经准备好以下内容： Github账号 Git 和 Node.js 创建 GitHub 仓库 在 GitHub 创建...",
      "translate": [
        "zh-CN",
        "en-US",
        "ja-JP"
      ],
      "sticky": 0,
      "author": "Pamper",
      "date": "2026-03-08",
      "hidden": false
    },
    "__REAL_FS_PATHS__": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\39f6b230.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/39f6b230",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\39f6b230.vue",
    "urlPath": "articles/zh-CN/39f6b230"
  },
  {
    "lang": "zh-CN",
    "title": "写作",
    "isOriginalLang": true,
    "menu": "test",
    "desc": "写作 在 Kecare 中，文章存放在 主题目录/.kecare/articles/ 目录下，目前仅支持 Markdown 文件。 创建文章 在 .kecare/articles/ 目录下创建 .md 文件 编写内容 文章结构 文章由 Fr...",
    "hash": "6e8c5f0b",
    "relativePath": "/写作.md",
    "frontMatter": {
      "cover": "https://img.pichost.cloud/images/1785612859072.jpg",
      "title": "写作",
      "menu": "test",
      "tags": [],
      "desc": "写作 在 Kecare 中，文章存放在 主题目录/.kecare/articles/ 目录下，目前仅支持 Markdown 文件。 创建文章 在 .kecare/articles/ 目录下创建 .md 文件 编写内容 文章结构 文章由 Fr...",
      "translate": [
        "zh-CN",
        "en-US",
        "ja-JP"
      ],
      "sticky": 0,
      "author": "Pamper",
      "date": "2026-03-06",
      "hidden": false
    },
    "__REAL_FS_PATHS__": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\6e8c5f0b.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/6e8c5f0b",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\6e8c5f0b.vue",
    "urlPath": "articles/zh-CN/6e8c5f0b"
  },
  {
    "lang": "zh-CN",
    "title": "国际化处理",
    "isOriginalLang": true,
    "menu": "test",
    "desc": "国际化处理 Kecare 可使用 Ai 为你的文章翻译成多种语言， 让文章触达多语言读者。 启用翻译 在 Kecare 中使用翻译也非常简单，仅需在所需翻译的文章 Front Matter 中添加 translate 字段： 第一个语言代码...",
    "hash": "493f5fa2",
    "relativePath": "/国际化处理.md",
    "frontMatter": {
      "cover": "https://img.pichost.cloud/images/1785612859072.jpg",
      "title": "国际化处理",
      "menu": "test",
      "tags": [],
      "desc": "国际化处理 Kecare 可使用 Ai 为你的文章翻译成多种语言， 让文章触达多语言读者。 启用翻译 在 Kecare 中使用翻译也非常简单，仅需在所需翻译的文章 Front Matter 中添加 translate 字段： 第一个语言代码...",
      "translate": [
        "zh-CN",
        "en-US",
        "ja-JP"
      ],
      "sticky": 0,
      "author": "Pamper",
      "date": "2026-03-03",
      "hidden": false
    },
    "__REAL_FS_PATHS__": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\493f5fa2.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/493f5fa2",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\493f5fa2.vue",
    "urlPath": "articles/zh-CN/493f5fa2"
  },
  {
    "lang": "zh-CN",
    "title": "贡献指南",
    "isOriginalLang": true,
    "menu": "test",
    "desc": "贡献指南 感谢你对 Kecare 项目的关注！ 开发环境 Node.js Bun（推荐） 项目结构 本地开发 代码规范 项目使用 oxlint 和 oxfmt 进行代码检查和格式化： 提交前请确保代码通过检查。 提交规范 提交信息格式： 类...",
    "hash": "43fc313b",
    "relativePath": "/贡献指南.md",
    "frontMatter": {
      "cover": "https://img.pichost.cloud/images/1785612859072.jpg",
      "title": "贡献指南",
      "menu": "test",
      "tags": [
        "菜单",
        "导航",
        "测试",
        "Kecare"
      ],
      "desc": "贡献指南 感谢你对 Kecare 项目的关注！ 开发环境 Node.js Bun（推荐） 项目结构 本地开发 代码规范 项目使用 oxlint 和 oxfmt 进行代码检查和格式化： 提交前请确保代码通过检查。 提交规范 提交信息格式： 类...",
      "translate": [
        "zh-CN",
        "en-US",
        "ja-JP"
      ],
      "sticky": 0,
      "author": "Pamper",
      "date": "2026-03-02",
      "hidden": false
    },
    "__REAL_FS_PATHS__": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\43fc313b.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/43fc313b",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\43fc313b.vue",
    "urlPath": "articles/zh-CN/43fc313b"
  },
  {
    "lang": "zh-CN",
    "title": "菜单系统",
    "isOriginalLang": true,
    "menu": "test",
    "desc": "菜单系统 Kecare 提供统一的菜单配置方式，用于生成侧边导航栏。 创建菜单 菜单文件存放在 .kecare/menus/ 目录，命名格式为 .menu.source.ts： 文件名前缀（如 kecare-docs）是文章中引用的 men...",
    "hash": "4ee23999",
    "relativePath": "/菜单系统.md",
    "frontMatter": {
      "cover": "https://img.pichost.cloud/images/1785612859072.jpg",
      "title": "菜单系统",
      "menu": "test",
      "tags": [
        "菜单",
        "导航",
        "测试",
        "Kecare"
      ],
      "desc": "菜单系统 Kecare 提供统一的菜单配置方式，用于生成侧边导航栏。 创建菜单 菜单文件存放在 .kecare/menus/ 目录，命名格式为 .menu.source.ts： 文件名前缀（如 kecare-docs）是文章中引用的 men...",
      "translate": [
        "zh-CN",
        "en-US",
        "ja-JP"
      ],
      "sticky": 0,
      "author": "Pamper",
      "date": "2026-03-01",
      "hidden": false
    },
    "__REAL_FS_PATHS__": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\4ee23999.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/4ee23999",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\Pamper\\Desktop\\workspace\\Kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\4ee23999.vue",
    "urlPath": "articles/zh-CN/4ee23999"
  }
]
                const currentPage = 3
                const totalPages = 3
                const totalArticles = 15
                const totalTags = 9

                </script>
                <template>
                    <BlogLanding :articles="articles" :current-page="currentPage" :total-pages="totalPages" :total-articles="totalArticles" :total-tags="totalTags" />
                </template>
            
                <script setup lang="ts">
                import BlogLanding from "~/components/blog-landing.vue";
                useHead({
                    title: '首页',
                })
                const articles = [
  {
    "lang": "zh-CN",
    "title": "暂时没想好",
    "isOriginalLang": true,
    "desc": "挺好看的就加进去了。",
    "hash": "a6019543",
    "relativePath": "/1111.md",
    "frontMatter": {
      "cover": "https://pichostoss.oss-cn-shanghai.aliyuncs.com/images/1785983988395.jpg",
      "title": "暂时没想好",
      "tags": [
        "生活"
      ],
      "desc": "挺好看的就加进去了。",
      "translate": [
        "zh-CN"
      ],
      "sticky": 0,
      "date": "2026-08-03",
      "hidden": false
    },
    "cover": "https://pichostoss.oss-cn-shanghai.aliyuncs.com/images/1785983988395.jpg",
    "__REAL_FS_PATHS__": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\a6019543.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/a6019543",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\a6019543.vue",
    "urlPath": "articles/zh-CN/a6019543"
  },
  {
    "lang": "zh-CN",
    "title": "横山日出",
    "isOriginalLang": true,
    "desc": "清晨的横山日出，记录了夏天的美。",
    "hash": "149b519d",
    "relativePath": "/夏日碎片.md",
    "frontMatter": {
      "cover": "https://pichostoss.oss-cn-shanghai.aliyuncs.com/images/1785670488165.jpg",
      "title": "横山日出",
      "tags": [
        "生活",
        "随拍"
      ],
      "desc": "清晨的横山日出，记录了夏天的美。",
      "translate": [
        "zh-CN"
      ],
      "sticky": 0,
      "date": "2026-08-02",
      "hidden": false
    },
    "cover": "https://pichostoss.oss-cn-shanghai.aliyuncs.com/images/1785670488165.jpg",
    "__REAL_FS_PATHS__": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\149b519d.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/149b519d",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\149b519d.vue",
    "urlPath": "articles/zh-CN/149b519d"
  },
  {
    "lang": "zh-CN",
    "title": "welcome",
    "isOriginalLang": true,
    "desc": "Welcome 感谢你选择Kecare作为你的内容生成工具！ Kecare 是一个现代化的内容生成器，专为构建内容驱动的网站而设计。它可以帮助你： 从 Markdown 文件生成静态页面 支持多语言内容翻译 灵活的模板系统 简洁的配置方式...",
    "hash": "f219dd09",
    "relativePath": "/welcome.md",
    "frontMatter": {
      "cover": "https://pichostoss.oss-cn-shanghai.aliyuncs.com/images/1785980777968.jpeg",
      "title": "welcome",
      "tags": [],
      "desc": "Welcome 感谢你选择Kecare作为你的内容生成工具！ Kecare 是一个现代化的内容生成器，专为构建内容驱动的网站而设计。它可以帮助你： 从 Markdown 文件生成静态页面 支持多语言内容翻译 灵活的模板系统 简洁的配置方式...",
      "translate": [
        "zh-CN"
      ],
      "sticky": 0,
      "date": "2026-05-20",
      "hidden": false
    },
    "__REAL_FS_PATHS__": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\f219dd09.vue",
    "__REAL_RELATIVE_PATHS__": "articles/zh-CN/f219dd09",
    "__SKIP_ARTICLE_GENERATOR__": true,
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\f219dd09.vue",
    "urlPath": "articles/zh-CN/f219dd09"
  }
]
                const currentPage = 1
                const totalPages = 1
                const totalArticles = 3
                const totalTags = 2

                </script>
                <template>
                    <BlogLanding :articles="articles" :current-page="currentPage" :total-pages="totalPages" :total-articles="totalArticles" :total-tags="totalTags" />
                </template>
            
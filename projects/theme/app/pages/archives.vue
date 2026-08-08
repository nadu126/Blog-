<!-- Generated: 2026-08-08T01:10:23.310Z -->
        <script setup lang="ts">
        import archivesTheme from '~/components/archive-landing.vue'
        const articles = [
  {
    "title": "我们一起看的日出",
    "lang": "zh-CN",
    "hash": "2f7dea16",
    "tags": [
      "生活",
      "随拍"
    ],
    "date": "2026-08-07",
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\2f7dea16.vue",
    "urlPath": "articles/zh-CN/2f7dea16"
  },
  {
    "title": "我们一起看的日出",
    "lang": "zh-CN",
    "hash": "a6019543",
    "tags": [
      "生活"
    ],
    "date": "2026-08-03",
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\a6019543.vue",
    "urlPath": "articles/zh-CN/a6019543"
  },
  {
    "title": "横山日出",
    "lang": "zh-CN",
    "hash": "149b519d",
    "tags": [
      "生活",
      "随拍"
    ],
    "date": "2026-08-02",
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\149b519d.vue",
    "urlPath": "articles/zh-CN/149b519d"
  },
  {
    "title": "welcome",
    "lang": "zh-CN",
    "hash": "f219dd09",
    "tags": [],
    "date": "2026-05-20",
    "fsPath": "C:\\Users\\zhang\\Desktop\\kecare\\projects\\theme\\app\\pages\\articles\\zh-CN\\f219dd09.vue",
    "urlPath": "articles/zh-CN/f219dd09"
  }
]
        const totalArticles = 4
        const totalTags = 2
        useHead({
            title: '归档喵',
        })
        </script>
        <template>
        <archivesTheme :articles="articles"
                       :totalArticles="totalArticles"
                       :totalTags="totalTags"
                       />
        </template>

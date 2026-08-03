import type { ArticleVariant, KecareContext, ArchiveArticleData, ArticleStats } from "kecare";

// 以 context 为键收集文章元数据，避免同进程多次 gen 时上一轮数据污染下一轮
const articlesLists = new WeakMap<KecareContext, ArchiveArticleData[]>();

function getArticlesList(context: KecareContext): ArchiveArticleData[] {
    let list = articlesLists.get(context);
    if (!list) {
        list = [];
        articlesLists.set(context, list);
    }
    return list;
}

/**
 * 在 emitArticleHandle 中调用，收集文章元数据
 */
export function collectArticleData(context: KecareContext, article: ArticleVariant) {
    getArticlesList(context).push({
        title: article.title,
        lang: article.lang,
        hash: article.hash,
        tags: article.frontMatter.tags,
        date: article.frontMatter.date,
        fsPath: article.__REAL_FS_PATHS__ || '',
        urlPath: article.__REAL_RELATIVE_PATHS__ || '',
    });
}

/**
 * 在 emitModuleFinish 中调用，集中计算聚合统计数据并写入 context
 */
export function computeArticleStats(context: KecareContext) {
    const articlesList = getArticlesList(context);
    const allTagsSet = new Set<string>();
    const perLang: ArticleStats['perLang'] = {};

    for (const article of articlesList) {
        if (!perLang[article.lang]) {
            perLang[article.lang] = { total: 0, tags: {} };
        }
        perLang[article.lang]!.total++;

        const langTags = perLang[article.lang]!.tags;
        for (const tag of article.tags) {
            allTagsSet.add(tag);
            // noUncheckedIndexedAccess 下 langTags[tag] 为 number | undefined，用 ?? 兜底再累加
            langTags[tag] = (langTags[tag] ?? 0) + 1;
        }
    }

    context.articleStats = {
        perLang,
        allTags: [...allTagsSet],
        totalArticles: articlesList.length,
    };
}

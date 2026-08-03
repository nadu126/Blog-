import type { ArticleVariant, KecareContext, ModuleArticleTS } from "kecare";
import { Glob, write } from "bun";
import { join } from "node:path";

/**
 * 创建文章模块处理程序
 * 会读取 *.article.ts 文件，调用其 generator 方法，生成文章详情页面
 * @param context 
 * @returns 
 */
async function createArticleModuleHandler(context: KecareContext) {
    // 开始：这里的代码，在初始化的时候就会被执行，只执行一次
    const modulePath = join(context.projectPath, '.kecare');
    const glob = new Glob(`${modulePath}/**/*.{article.ts}`);



    const modules: Array<Promise<ModuleArticleTS>> = [];
    for await (const file of glob.scan(".")) modules.push(await import(file));
    // 结束：这里的代码，在初始化的时候就会被执行，只执行一次

    const module = {
        async handle(article: ArticleVariant) {
            if (article.__SKIP_ARTICLE_GENERATOR__) return;

            // 此方法在处理实际文章时，才会被调用
            for (const module of modules) {
                const moduleAwaited = await module;
                if (!moduleAwaited.generator) continue; // 没有 generator 方法，跳过
                const generatorResult = await moduleAwaited.generator(context, article);
                if (typeof generatorResult !== 'object' || !generatorResult.fsPath || !generatorResult.urlPath) continue; // 没有路径，跳过

                await write(generatorResult.fsPath, generatorResult.template);
                console.log(`[article] 已生成 ${generatorResult.fsPath}`);

                // 记录生成的文章真实路径
                article.__REAL_FS_PATHS__ = generatorResult.fsPath;
                article.__REAL_RELATIVE_PATHS__ = generatorResult.urlPath;
            }
        }

    }
    return module;
}

// 以 context 为键缓存处理器实例：每次 gen 都会创建新的 context，
// 因此同进程多次调用（测试、watch 模式）不会复用上一轮的处理器及其内部状态
const instances = new WeakMap<KecareContext, ReturnType<typeof createArticleModuleHandler>>();

export function useArticleModuleHandler(context: KecareContext): ReturnType<typeof createArticleModuleHandler> {
    let instance = instances.get(context);
    if (!instance) {
        instance = createArticleModuleHandler(context);
        instances.set(context, instance);
    }
    return instance;
}

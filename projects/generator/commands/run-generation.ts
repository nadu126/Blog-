import { join } from 'node:path';
import { existsSync } from 'node:fs';
import type { KecareContext } from 'kecare';
import { executeInputDrivers } from '../input-drivers/__ROOT__.ts';
import { emitArticleHandle } from '../module-handler/__ROOT__.ts';

/**
 * 执行一次完整的生成流程：校验项目目录 → 创建上下文 → 调度输入驱动 → 生成所有页面。
 *
 * 该函数是 `gen` 命令与 `dev` 增量周期共用的入口。
 * 校验失败时抛出错误（而非 process.exit），由调用方决定是否退出进程：
 *   - `gen` 命令：捕获后 consola.error + exit(1)
 *   - `dev` 命令：初始 gen 失败则 exit(1)；周期内 gen 失败则仅记录错误、保持监听
 *
 * 通过 markdown-manifest 的内容哈希缓存，未变更文章会跳过解析/翻译/写盘，
 * 因此 dev 周期内重复调用开销很低，这是增量策略的核心。
 */
export async function runGeneration(projectPath: string): Promise<KecareContext> {
    // 校验 .kecare 目录存在
    const kecareDir = join(projectPath, '.kecare');
    if (!existsSync(kecareDir)) {
        throw new Error(`Kecare directory does not exist: ${kecareDir}`);
    }

    // 校验文章目录存在
    const articlePath = join(kecareDir, 'articles');
    if (!existsSync(articlePath)) {
        throw new Error(`Article directory does not exist, no articles will be processed: ${articlePath}`);
    }

    // 每次调用都创建新的 context：module-handler 以 context 为键用 WeakMap 缓存实例，
    // 新 context 意味着全新状态，避免 dev 多周期间的状态污染
    const context: KecareContext = {
        projectPath,
    };

    await executeInputDrivers(context, emitArticleHandle);

    return context;
}

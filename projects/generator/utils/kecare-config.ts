import { join } from "path";
import type { KecareConfig, KecareContext } from "kecare";
import { existsSync } from "fs";

async function createKecareConfig(context: KecareContext) {
    if (!existsSync(join(context.projectPath, '.kecare', 'kecare.config.ts'))) return {} as KecareConfig;
    const configModule = await import(join(context.projectPath, '.kecare', 'kecare.config.ts'));

    // 校验配置文件
    if (configModule.llm) {
        // 如果存在 llm 配置，校验其字段
        if (!configModule.llm.model) throw new Error('llm.model 不能为空');
        if (!configModule.llm.apiKey) throw new Error('llm.apiKey 不能为空');
        if (!configModule.llm.apiBaseUrl) throw new Error('llm.apiBaseUrl 不能为空');
    }

    return configModule.kecareConfig(context) as KecareConfig;
}

// 以 context 为键缓存配置：每次 gen 都会创建新的 context，
// 因此同进程多次调用（测试、watch 模式）不会复用上一轮的配置
const instances = new WeakMap<KecareContext, ReturnType<typeof createKecareConfig>>();

export function useKecareConfig(context: KecareContext): ReturnType<typeof createKecareConfig> {
    let instance = instances.get(context);
    if (!instance) {
        instance = createKecareConfig(context);
        instances.set(context, instance);
    }
    return instance;
}

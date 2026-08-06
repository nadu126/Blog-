<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import Navbar from '~/components/Theme/Sidebar/Navbar.vue'
import Footer from '~/components/Theme/Sidebar/Footer.vue'


useHead({
    title: '在一起的时光',
})

// 在一起的起始时间：2026 年 8 月 2 日 00:00:00
const startDate = new Date('2026-08-02T00:00:00')

// 当前时间，每秒刷新一次以更新计时
const now = ref(new Date())

let timer: number | null = null

onMounted(() => {
    // 每秒更新当前时间，驱动计时数字滚动
    timer = window.setInterval(() => {
        now.value = new Date()
    }, 1000)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})

// 计算从起始时间到当前时间已过去的天/时/分/秒
const elapsed = computed(() => {
    const diff = now.value.getTime() - startDate.getTime()
    // 若尚未到达起始时间，全部归零
    if (diff < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    const total = Math.floor(diff / 1000)
    const days = Math.floor(total / (60 * 60 * 24))
    const hours = Math.floor((total % (60 * 60 * 24)) / (60 * 60))
    const minutes = Math.floor((total % (60 * 60)) / 60)
    const seconds = total % 60
    return { days, hours, minutes, seconds }
})

// 数字补零辅助：保证时/分/秒始终为两位数显示
function pad(n: number): string {
    return n.toString().padStart(2, '0')
}

// 累计陪伴天数文案
const totalDaysText = computed(() => `这是我们一起走过的第 ${elapsed.value.days + 1} 天`)

const bg = 'https://img.pichost.cloud/images/1785984248304.png'
</script>

<template>
    <div id="app"
        class="min-h-screen flex flex-col font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] leading-[1.6] text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] select-none">
        <!-- Hero 区域 -->
        <div
            class="relative h-[40vh] min-h-[300px] overflow-hidden flex flex-col items-center justify-center text-center mt-[60px]">
            <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${bg})` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
            <h1
                class="relative text-white text-[3rem] font-bold tracking-[2px] select-none [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)] animate-fadeIn">
                在一起的时光</h1>
            <p class="relative text-white/80 text-[1.1rem] mt-[10px]">自 2026 年 8 月 2 日起 ❤</p>
        </div>

        <Navbar />

        <div class="max-w-[1200px] mx-auto p-[20px] flex flex-col gap-[30px] w-full">
            <!-- 计时主卡片 -->
            <div
                class="bg-[var(--color-bg-primary)]/70 backdrop-blur-[10px] backdrop-saturate-150 border border-[rgba(169,169,169,0.2)] rounded-[16px] p-[40px] shadow-[0_10px_30px_var(--color-shadow)]">
                <h2
                    class="text-[1.4rem] font-bold text-[var(--color-text-primary)] mb-[30px] flex items-center justify-center gap-[10px]">
                    <span class="w-[4px] h-[20px] bg-[var(--color-accent)] rounded-full"></span>
                    我们已经在一起
                </h2>

                <!-- 时间数字展示 -->
                <div class="flex flex-wrap items-center justify-center gap-[16px] md:gap-[28px]">
                    <div class="time-unit">
                        <div class="time-num">{{ elapsed.days }}</div>
                        <div class="time-label">天</div>
                    </div>
                    <div class="time-sep">:</div>
                    <div class="time-unit">
                        <div class="time-num">{{ pad(elapsed.hours) }}</div>
                        <div class="time-label">时</div>
                    </div>
                    <div class="time-sep">:</div>
                    <div class="time-unit">
                        <div class="time-num">{{ pad(elapsed.minutes) }}</div>
                        <div class="time-label">分</div>
                    </div>
                    <div class="time-sep">:</div>
                    <div class="time-unit">
                        <div class="time-num">{{ pad(elapsed.seconds) }}</div>
                        <div class="time-label">秒</div>
                    </div>
                </div>

                <p class="text-center text-[var(--color-text-secondary)] mt-[30px] text-[1rem]">
                    {{ totalDaysText }}，愿时光不老，我们不散
                </p>
            </div>

            <!-- 寄语卡片 -->
            <div
                class="bg-[var(--color-bg-primary)]/70 backdrop-blur-[10px] backdrop-saturate-150 border border-[rgba(169,169,169,0.2)] rounded-[16px] p-[30px] shadow-[0_10px_30px_var(--color-shadow)]">
                <h2
                    class="text-[1.4rem] font-bold text-[var(--color-text-primary)] mb-[20px] flex items-center gap-[10px]">
                    <span class="w-[4px] h-[20px] bg-[var(--color-accent)] rounded-full"></span>
                    💌 写在时光里
                </h2>
                <div class="text-[var(--color-text-secondary)] leading-[1.8]">
                    <p class="mb-[10px]">
                        从那个夏天的清晨开始，日子便有了不一样的意义。
                    </p>
                    <p class="mb-[10px]">
                        每一秒都在累计，每一刻都值得被记住。这里记录的不是倒计时，而是我们一起走过的、正在增长的时间。
                    </p>
                    <p>
                        愿往后的每一天，都有彼此在身边。
                    </p>
                </div>
            </div>
        </div>
        <Footer />
    </div>

    <!-- Sakana Widget -->
    <div id="sakana-widget" class="fixed right-0 bottom-0 z-[999]"></div>
</template>

<style scoped>
.time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
}

.time-num {
    font-size: 3rem;
    font-weight: bold;
    color: var(--color-accent);
    line-height: 1;
    text-shadow: 0 2px 10px rgba(255, 107, 147, 0.2);
    font-variant-numeric: tabular-nums;
    transition: transform 0.2s ease;
}

.time-unit:hover .time-num {
    transform: translateY(-4px);
}

.time-label {
    margin-top: 10px;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    letter-spacing: 2px;
}

.time-sep {
    font-size: 3rem;
    font-weight: bold;
    color: var(--color-accent);
    line-height: 1;
    opacity: 0.5;
}
</style>

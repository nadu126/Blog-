<script lang="ts" setup>
import { onMounted, nextTick } from "vue"
import SakanaWidget from 'sakana-widget';
import 'sakana-widget/lib/index.css';
import Navbar from '~/components/Theme/Sidebar/Navbar.vue'
import Footer from '~/components/Theme/Sidebar/Footer.vue'
import bg from '~/assets/bg3.jpg'

useHead({
    title: '花月 · 赞助',
})

// Supabase 返回的数据类型
type SponsorRecord = {
    id: number
    name: string
    amount: number
    date: string
    note: string
    avatar: string
}

type ExpenseRecord = {
    id: number
    item: string
    amount: number
    date: string
    category: string
    note: string
    avatar: string
}

type BalanceData = {
    total_income: number
    total_expense: number
    balance: number
}

// 数据请求
const supabase = useSupabase()

const { data: sponsorRecords, pending: sponsorPending, error: sponsorError } = await useAsyncData<SponsorRecord[]>(
    'fioralune-sponsor',
    async () => {
        const { data, error } = await supabase
            .from('sponsor_records')
            .select('*')
            .order('date', { ascending: false })
        if (error) throw error
        return data as SponsorRecord[]
    },
    { server: false }
)

const { data: expenseRecords, pending: expensePending, error: expenseError } = await useAsyncData<ExpenseRecord[]>(
    'fioralune-expense',
    async () => {
        const { data, error } = await supabase
            .from('expense_records')
            .select('*')
            .order('date', { ascending: false })
        if (error) throw error
        return data as ExpenseRecord[]
    },
    { server: false }
)
console.log(expenseRecords.value)

const { data: balanceData, pending: balancePending } = await useAsyncData<BalanceData>(
    'fioralune-balance',
    async () => {
        const { data, error } = await supabase
            .from('balance_view')
            .select('*')
            .single()
        if (error) throw error
        return data as BalanceData
    },
    { server: false }
)

// 从 Supabase 数据计算
const totalIncome = computed(() => balanceData.value?.total_income ?? 0)
const totalExpense = computed(() => balanceData.value?.total_expense ?? 0)
const balance = computed(() => balanceData.value?.balance ?? 0)

// 按月分组计算
const monthlyData = computed(() => {
    const map: Record<string, { month: string; label: string; income: number; expense: number }> = {}
    const monthLabels: Record<string, string> = {
        '01': '一月', '02': '二月', '03': '三月', '04': '四月',
        '05': '五月', '06': '六月', '07': '七月', '08': '八月',
        '09': '九月', '10': '十月', '11': '十一月', '12': '十二月',
    }

    // 初始化最近 3 个月
    const now = new Date()
    for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        map[key] = { month: key, label: monthLabels[String(d.getMonth() + 1).padStart(2, '0')] || key, income: 0, expense: 0 }
    }

    for (const r of sponsorRecords.value ?? []) {
        const key = r.date.slice(0, 7)
        if (map[key]) map[key].income += r.amount
    }
    for (const r of expenseRecords.value ?? []) {
        const key = r.date.slice(0, 7)
        if (map[key]) map[key].expense += r.amount
    }

    return Object.values(map)
})

// 图表最大值
const chartMax = computed(() => {
    let max = 0
    for (const m of monthlyData.value) {
        if (m.income > max) max = m.income
        if (m.expense > max) max = m.expense
    }
    return max || 1
})

// 当前展示的 tab
const activeTab = ref<'income' | 'expense' | 'summary'>('summary')

const loading = computed(() => sponsorPending.value || expensePending.value || balancePending.value)

function formatDate(dateStr: string): string {
    const parts = dateStr.split('-')
    return `${parts[1]}月${parts[2]}日`
}

function getCategoryClass(category: string): string {
    const map: Record<string, string> = {
        '赛事': 'category-match',
        '基础设施': 'category-infra',
        '周边': 'category-goods',
    }
    return map[category] || ''
}

// function initSakanaWidget() {
//     const kecream = SakanaWidget.getCharacter('chisato');
//     if (kecream) {
//         kecream.image = `https://pichost.cloud/files/a585d06168c8553f42b086a6fec51075273913c2092c65b59858e47352b4fc79.avif`;
//         SakanaWidget.registerCharacter('kecream', kecream);
//     }
//     new SakanaWidget({ character: 'kecream' }).mount('#sakana-widget');
// }

onMounted(async () => {
    await nextTick();
    // initSakanaWidget();
});
</script>

<template>
    <div id="app" class="fioralune-page">
        <!-- Hero 区域 -->
        <div class="hero-section">
            <div class="hero-bg" :style="{ backgroundImage: `url(${bg})` }"></div>
            <div class="hero-overlay"></div>
            <h1 class="hero-title">花月 · Fioralune</h1>
            <p class="hero-subtitle">赞助收支明细</p>
        </div>

        <Navbar />

        <div class="main-container">
            <div class="main-content">

                <!-- 总览卡片 -->
                <div class="summary-cards">
                    <div class="summary-card summary-card--income">
                        <div class="summary-card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <div class="summary-card-body">
                            <span class="summary-card-label">总收入</span>
                            <span class="summary-card-value income-value">¥{{ totalIncome.toLocaleString() }}</span>
                        </div>
                    </div>
                    <div class="summary-card summary-card--expense">
                        <div class="summary-card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                                <polyline points="17 18 23 18 23 12" />
                            </svg>
                        </div>
                        <div class="summary-card-body">
                            <span class="summary-card-label">总支出</span>
                            <span class="summary-card-value expense-value">¥{{ totalExpense.toLocaleString() }}</span>
                        </div>
                    </div>
                    <div class="summary-card summary-card--balance">
                        <div class="summary-card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div class="summary-card-body">
                            <span class="summary-card-label">结余</span>
                            <span class="summary-card-value balance-value"
                                :class="{ 'is-positive': balance >= 0, 'is-negative': balance < 0 }">
                                ¥{{ balance.toLocaleString() }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 月度收支柱状图 -->
                <div class="card">
                    <h2 class="card-title">
                        <span class="card-title-bar"></span>
                        📊 月度收支概览
                    </h2>
                    <div class="chart-container">
                        <div class="chart-bars">
                            <div v-for="item in monthlyData" :key="item.month" class="chart-bar-group">
                                <div class="chart-bar-wrapper">
                                    <div class="chart-bar chart-bar--income"
                                        :style="{ height: `${(item.income / chartMax) * 100}%` }">
                                        <span class="chart-bar-tooltip">¥{{ item.income }}</span>
                                    </div>
                                    <div class="chart-bar chart-bar--expense"
                                        :style="{ height: `${(item.expense / chartMax) * 100}%` }">
                                        <span class="chart-bar-tooltip">¥{{ item.expense }}</span>
                                    </div>
                                </div>
                                <span class="chart-bar-label">{{ item.label }}</span>
                            </div>
                        </div>
                        <div class="chart-legend">
                            <div class="chart-legend-item">
                                <span class="chart-legend-dot chart-legend-dot--income"></span>
                                <span>收入</span>
                            </div>
                            <div class="chart-legend-item">
                                <span class="chart-legend-dot chart-legend-dot--expense"></span>
                                <span>支出</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 切换 -->
                <div class="card">
                    <div class="tab-bar">
                        <button class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'summary' }"
                            @click="activeTab = 'summary'">
                            📋 全部记录
                        </button>
                        <button class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'income' }"
                            @click="activeTab = 'income'">
                            💰 赞助收入
                        </button>
                        <button class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'expense' }"
                            @click="activeTab = 'expense'">
                            💸 支出明细
                        </button>
                    </div>

                    <!-- 全部记录 -->
                    <div v-if="activeTab === 'summary'">
                        <h2 class="card-title" style="margin-top: 20px;">
                            <span class="card-title-bar"></span>
                            💰 赞助收入
                        </h2>
                        <div class="record-list">
                            <div v-for="record in sponsorRecords" :key="'s' + record.id"
                                class="record-item record-item--income">
                                <div class="record-left">
                                    <div class="record-avatar record-avatar--income">
                                        <img v-if="record.avatar" :src="record.avatar" class="avatar-img" />
                                        <span v-else>{{ record.name.charAt(0) }}</span>
                                    </div>
                                    <div class="record-info">
                                        <span class="record-name">{{ record.name }}</span>
                                        <span class="record-note">{{ record.note }}</span>
                                    </div>
                                </div>
                                <div class="record-right">
                                    <span class="record-amount record-amount--income">+¥{{ record.amount }}</span>
                                    <span class="record-date">{{ formatDate(record.date) }}</span>
                                </div>
                            </div>
                        </div>

                        <h2 class="card-title" style="margin-top: 30px;">
                            <span class="card-title-bar"></span>
                            💸 支出明细
                        </h2>
                        <div class="record-list">
                            <div v-for="record in expenseRecords" :key="'e' + record.id"
                                class="record-item record-item--expense">
                                <div class="record-left">
                                    <div class="record-avatar record-avatar--expense">
                                        <img v-if="record.avatar" :src="record.avatar" class="avatar-img" />
                                        <span v-else>{{ record.item.charAt(0) }}</span>
                                    </div>
                                    <div class="record-info">
                                        <div class="record-name-row">
                                            <span class="record-name">{{ record.item }}</span>
                                            <span class="record-category-tag"
                                                :class="getCategoryClass(record.category)">{{ record.category }}</span>
                                        </div>
                                        <span class="record-note">{{ record.note }}</span>
                                    </div>
                                </div>
                                <div class="record-right">
                                    <span class="record-amount record-amount--expense">-¥{{ record.amount }}</span>
                                    <span class="record-date">{{ formatDate(record.date) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 仅收入 -->
                    <div v-if="activeTab === 'income'">
                        <div class="record-list" style="margin-top: 20px;">
                            <div v-for="record in sponsorRecords" :key="'si' + record.id"
                                class="record-item record-item--income">
                                <div class="record-left">
                                    <div class="record-avatar record-avatar--income">
                                        <img v-if="record.avatar" :src="record.avatar" class="avatar-img" />
                                        <span v-else>{{ record.name.charAt(0) }}</span>
                                    </div>
                                    <div class="record-info">
                                        <span class="record-name">{{ record.name }}</span>
                                        <span class="record-note">{{ record.note }}</span>
                                    </div>
                                </div>
                                <div class="record-right">
                                    <span class="record-amount record-amount--income">+¥{{ record.amount }}</span>
                                    <span class="record-date">{{ formatDate(record.date) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 仅支出 -->
                    <div v-if="activeTab === 'expense'">
                        <div class="record-list" style="margin-top: 20px;">
                            <div v-for="record in expenseRecords" :key="'se' + record.id"
                                class="record-item record-item--expense">
                                <div class="record-left">
                                    <div class="record-avatar record-avatar--expense">
                                        <img v-if="record.avatar" :src="record.avatar" class="avatar-img" />
                                        <span v-else>{{ record.item.charAt(0) }}</span>
                                    </div>
                                    <div class="record-info">
                                        <div class="record-name-row">
                                            <span class="record-name">{{ record.item }}</span>
                                            <span class="record-category-tag"
                                                :class="getCategoryClass(record.category)">{{ record.category }}</span>
                                        </div>
                                        <span class="record-note">{{ record.note }}</span>
                                    </div>
                                </div>
                                <div class="record-right">
                                    <span class="record-amount record-amount--expense">-¥{{ record.amount }}</span>
                                    <span class="record-date">{{ formatDate(record.date) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 说明 -->
                <div class="card">
                    <h2 class="card-title">
                        <span class="card-title-bar"></span>
                        📝 说明
                    </h2>
                    <div class="description-text">
                        <p>
                            花月（Fioralune）是 Pamper 发起的个人项目，旨在支持社区赛事和开发者生态。
                            所有赞助资金将用于：
                        </p>
                        <ul>
                            <li>🏆 赛事奖金池（天天禄杯、Fioralune Championship 等）</li>
                            <li>🌟 Fioralune Awards 个人开发者奖项</li>
                            <li>🖥️ 服务器及基础设施费用</li>
                            <li>🎁 比赛周边及纪念品制作</li>
                        </ul>
                        <p>
                            赞助收支明细将定期更新，保持公开透明。如有任何疑问，欢迎通过友链页面的联系方式与我取得联系。
                        </p>
                        <p class="description-note">
                            * Pamper 享有对 Fioralune 的最终解释权。
                        </p>
                    </div>
                </div>

            </div>
        </div>
        <Footer />
    </div>

    <!-- Sakana Widget -->
    <div id="sakana-widget" class="sakana-widget"></div>
</template>

<style scoped>
/* ========== 页面整体 ========== */
.fioralune-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
    user-select: none;
}

/* ========== Hero 区域 ========== */
.hero-section {
    position: relative;
    height: 40vh;
    min-height: 300px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 60px;
}

.hero-bg {
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: cover;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
}

.hero-title {
    position: relative;
    color: #fff;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
    position: relative;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    margin-top: 10px;
}

/* ========== 主容器 ========== */
.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* ========== 卡片通用 ========== */
.card {
    background: color-mix(in srgb, var(--color-bg-primary) 70%, transparent);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(169, 169, 169, 0.2);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 30px var(--color-shadow);
}

.card-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-title-bar {
    display: inline-block;
    width: 4px;
    height: 20px;
    background: var(--color-accent);
    border-radius: 9999px;
}

/* ========== 总览卡片 ========== */
.summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.summary-card {
    background: color-mix(in srgb, var(--color-bg-primary) 70%, transparent);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(169, 169, 169, 0.2);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px var(--color-shadow);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px var(--color-shadow);
}

.summary-card--income:hover {
    border-color: rgba(76, 175, 80, 0.3);
}

.summary-card--expense:hover {
    border-color: rgba(244, 67, 54, 0.3);
}

.summary-card--balance:hover {
    border-color: rgba(255, 107, 147, 0.3);
}

.summary-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.summary-card--income .summary-card-icon {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
}

.summary-card--expense .summary-card-icon {
    background: rgba(244, 67, 54, 0.15);
    color: #f44336;
}

.summary-card--balance .summary-card-icon {
    background: rgba(255, 107, 147, 0.15);
    color: var(--color-accent);
}

.summary-card-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.summary-card-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
}

.summary-card-value {
    font-size: 1.5rem;
    font-weight: 700;
}

.income-value {
    color: #4caf50;
}

.expense-value {
    color: #f44336;
}

.balance-value.is-positive {
    color: #4caf50;
}

.balance-value.is-negative {
    color: #f44336;
}

/* ========== 图表 ========== */
.chart-container {
    padding: 10px 0;
}

.chart-bars {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 40px;
    height: 200px;
    padding-bottom: 30px;
}

.chart-bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.chart-bar-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 160px;
}

.chart-bar {
    width: 36px;
    border-radius: 6px 6px 0 0;
    position: relative;
    transition: height 0.5s ease;
    min-height: 4px;
}

.chart-bar--income {
    background: linear-gradient(to top, #4caf50, #81c784);
}

.chart-bar--expense {
    background: linear-gradient(to top, #f44336, #e57373);
}

.chart-bar-tooltip {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    white-space: nowrap;
    color: var(--color-text-secondary);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.chart-bar:hover .chart-bar-tooltip {
    opacity: 1;
}

.chart-bar-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 10px;
}

.chart-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
}

.chart-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.chart-legend-dot--income {
    background: #4caf50;
}

.chart-legend-dot--expense {
    background: #f44336;
}

/* ========== Tab 切换 ========== */
.tab-bar {
    display: flex;
    gap: 0;
    border-bottom: 2px solid rgba(169, 169, 169, 0.15);
    margin-bottom: 0;
}

.tab-btn {
    padding: 10px 24px;
    border: none;
    background: transparent;
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease;
    font-family: inherit;
}

.tab-btn::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.tab-btn:hover {
    color: var(--color-text-primary);
}

.tab-btn--active {
    color: var(--color-accent);
    font-weight: 600;
}

.tab-btn--active::after {
    transform: scaleX(1);
}

/* ========== 记录列表 ========== */
.record-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.record-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: color-mix(in srgb, var(--color-bg-primary) 50%, transparent);
    border: 1px solid rgba(169, 169, 169, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.record-item:hover {
    background: var(--color-bg-primary);
    box-shadow: 0 4px 12px rgba(255, 107, 147, 0.1);
    border-color: rgba(255, 107, 147, 0.2);
    transform: translateY(-1px);
}

.record-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
}

.record-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
}

.record-avatar--income {
    background: linear-gradient(135deg, #4caf50, #81c784);
}

.record-avatar--expense {
    background: linear-gradient(135deg, #f44336, #e57373);
}

.avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.record-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.record-name {
    font-weight: 600;
    color: var(--color-text-primary);
    font-size: 0.95rem;
}

.record-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.record-category-tag {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 9999px;
    font-weight: 500;
}

.category-match {
    background: rgba(255, 107, 147, 0.15);
    color: var(--color-accent);
}

.category-infra {
    background: rgba(33, 150, 243, 0.15);
    color: #2196f3;
}

.category-goods {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
}

.record-note {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.record-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
    margin-left: 16px;
}

.record-amount {
    font-weight: 700;
    font-size: 1rem;
}

.record-amount--income {
    color: #4caf50;
}

.record-amount--expense {
    color: #f44336;
}

.record-date {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
}

/* ========== 说明文字 ========== */
.description-text {
    color: var(--color-text-secondary);
    line-height: 1.8;
}

.description-text p {
    margin-bottom: 12px;
}

.description-text ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 12px;
}

.description-text ul li {
    padding: 6px 0;
    padding-left: 4px;
}

.description-note {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    font-style: italic;
}

/* ========== Sakana Widget ========== */
.sakana-widget {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 999;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
    .summary-cards {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 2rem;
    }

    .chart-bars {
        gap: 20px;
    }

    .chart-bar {
        width: 28px;
    }

    .record-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .record-right {
        flex-direction: row;
        align-items: center;
        gap: 12px;
        margin-left: 0;
        width: 100%;
        justify-content: space-between;
    }

    .tab-btn {
        padding: 10px 16px;
        font-size: 0.85rem;
    }
}
</style>
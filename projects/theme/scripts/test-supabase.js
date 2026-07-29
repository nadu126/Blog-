// 临时测试脚本：验证 Supabase 连接和数据表
// 运行方式：在 theme 目录下执行 node scripts/test-supabase.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 读取 .env 文件
const envPath = resolve(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#][^=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
}

const supabaseUrl = env['SUPABASE_URL']
const supabaseKey = env['SUPABASE_PUBLISHABLE_KEY']

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 环境变量缺失：请检查 .env 中的 SUPABASE_URL 和 SUPABASE_PUBLISHABLE_KEY')
    process.exit(1)
}

console.log(`🔗 Supabase URL: ${supabaseUrl}`)
console.log(`🔑 Key 前缀: ${supabaseKey.slice(0, 15)}...`)

const supabase = createClient(supabaseUrl, supabaseKey)

let allPassed = true

// 测试 sponsor_records
console.log('\n📋 测试 sponsor_records 表...')
const { data: sponsors, error: sponsorErr } = await supabase
    .from('sponsor_records')
    .select('*')
    .order('date', { ascending: false })

if (sponsorErr) {
    console.error(`  ❌ 查询失败: ${sponsorErr.message} (code: ${sponsorErr.code})`)
    if (sponsorErr.code === '42P01') {
        console.error('  💡 提示：表不存在，请先在 Supabase SQL Editor 中建表')
    }
    allPassed = false
} else if (!sponsors || sponsors.length === 0) {
    console.log('  ⚠️  表存在但无数据（需要插入示例数据）')
    console.log('  💡 在 Supabase SQL Editor 中运行以下 INSERT 语句插入数据:')
    console.log(`
    INSERT INTO sponsor_records (name, amount, date, note) VALUES
      ('可莉姆船长', 500, '2026-07-25', '天天禄杯赛事赞助，感谢支持喵~'),
      ('匿名赞助者', 300, '2026-07-18', '花月项目运营资金'),
      ('小咸鱼', 200, '2026-07-12', '服务器费用赞助'),
      ('某热心网友', 1000, '2026-07-05', 'Fioralune Awards 奖金池'),
      ('匿名赞助者', 150, '2026-06-28', '域名续费支持'),
      ('Pamper', 800, '2026-06-20', '个人出资，初始运营资金'),
      ('可莉姆船长', 400, '2026-06-15', '周边制作赞助'),
      ('某热心网友', 250, '2026-06-08', '日常运营支持');
    `)
} else {
    console.log(`  ✅ sponsor_records 连接成功，共 ${sponsors.length} 条记录`)
}

// 测试 expense_records
console.log('\n📋 测试 expense_records 表...')
const { data: expenses, error: expenseErr } = await supabase
    .from('expense_records')
    .select('*')
    .order('date', { ascending: false })

if (expenseErr) {
    console.error(`  ❌ 查询失败: ${expenseErr.message} (code: ${expenseErr.code})`)
    if (expenseErr.code === '42P01') {
        console.error('  💡 提示：表不存在，请先在 Supabase SQL Editor 中建表')
    }
    allPassed = false
} else if (!expenses || expenses.length === 0) {
    console.log('  ⚠️  表存在但无数据（需要插入示例数据）')
    console.log('  💡 在 Supabase SQL Editor 中运行以下 INSERT 语句插入数据:')
    console.log(`
    INSERT INTO expense_records (item, amount, date, category, note) VALUES
      ('天天禄杯赛事奖金', 800, '2026-07-20', '赛事', '冠军 ¥400 / 亚军 ¥250 / 季军 ¥150'),
      ('云服务器月费', 200, '2026-07-01', '基础设施', '阿里云 ECS 月费'),
      ('域名续费', 80, '2026-06-15', '基础设施', 'kecare.me 域名年费'),
      ('比赛纪念品制作', 300, '2026-06-10', '周边', '钥匙扣及立牌定制'),
      ('CDN 流量包', 50, '2026-06-01', '基础设施', '又拍云 CDN 流量包'),
      ('Fioralune Awards 奖金', 600, '2026-05-25', '赛事', '个人开发者奖项奖金');
    `)
} else {
    console.log(`  ✅ expense_records 连接成功，共 ${expenses.length} 条记录`)
}

// 测试 balance_view
console.log('\n📋 测试 balance_view 视图...')
const { data: balance, error: balanceErr } = await supabase
    .from('balance_view')
    .select('*')
    .single()

if (balanceErr) {
    console.error(`  ❌ 查询失败: ${balanceErr.message} (code: ${balanceErr.code})`)
    if (balanceErr.code === '42P01') {
        console.error('  💡 提示：视图不存在，请先在 Supabase SQL Editor 中创建:')
        console.log(`
    CREATE VIEW balance_view AS
    SELECT
      COALESCE((SELECT SUM(amount) FROM sponsor_records), 0) AS total_income,
      COALESCE((SELECT SUM(amount) FROM expense_records), 0)  AS total_expense,
      COALESCE((SELECT SUM(amount) FROM sponsor_records), 0)
        - COALESCE((SELECT SUM(amount) FROM expense_records), 0) AS balance;
    `)
    }
    allPassed = false
} else {
    console.log(`  ✅ balance_view 连接成功`)
    console.log(`     总收入: ¥${balance.total_income}`)
    console.log(`     总支出: ¥${balance.total_expense}`)
    console.log(`     结余:   ¥${balance.balance}`)
}

console.log(`\n${'='.repeat(50)}`)
if (allPassed) {
    console.log('🎉 所有连接测试通过！Supabase 配置正确。')
} else {
    console.log('⚠️  部分测试未通过，请根据上方提示在 Supabase SQL Editor 中创建表和插入数据。')
}
console.log(`${'='.repeat(50)}`)

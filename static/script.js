// 格式化数字
function formatNumber(num) {
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    return num.toLocaleString();
}

function formatFullNumber(num) {
    return num.toLocaleString();
}

// 水墨配色
const inkColors = ['#6B8E73', '#A67C52', '#8B6B6B', '#6B8B9E', '#9E8B6B', '#7B8B6B', '#8B6B8E', '#6B9E8B'];
const inkAlpha = [
    'rgba(107,142,115,0.2)', 'rgba(166,124,82,0.2)', 'rgba(139,107,107,0.2)',
    'rgba(107,139,158,0.2)', 'rgba(158,139,107,0.2)', 'rgba(123,139,107,0.2)',
    'rgba(139,107,142,0.2)', 'rgba(107,158,139,0.2)'
];

let trendChart = null;
let categoryChart = null;

// 加载数据
async function loadData() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        updateCards(data);
        updateTrendChart(data.daily_views);
        updateCategoryChart(data.category_stats);
        updateRankTable(data.video_stats);
    } catch (e) {
        console.error('加载失败:', e);
    }
}

// 更新卡片
function updateCards(d) {
    const el = id => document.getElementById(id);
    el('totalViews').textContent = formatNumber(d.total_views);
    el('totalVideos').textContent = d.total_videos;
    el('totalLikes').textContent = formatNumber(d.total_likes);
    el('avgWatchTime').textContent = d.avg_watch_time + '分';
}

// 趋势图
function updateTrendChart(daily) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: daily.map(d => d.date),
            datasets: [
                {
                    label: '播放量',
                    data: daily.map(d => d.views),
                    borderColor: '#6B8E73',
                    backgroundColor: 'rgba(107,142,115,0.08)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6B8E73',
                    pointBorderColor: '#F8F6F2',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: '独立访客',
                    data: daily.map(d => d.unique_viewers),
                    borderColor: '#A67C52',
                    backgroundColor: 'rgba(166,124,82,0.08)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#A67C52',
                    pointBorderColor: '#F8F6F2',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 16,
                        font: { family: 'Inter', size: 12 },
                        color: '#4A4A4A'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26,26,26,0.9)',
                    titleFont: { family: 'Noto Serif SC', size: 13 },
                    bodyFont: { family: 'Inter', size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + formatFullNumber(ctx.parsed.y)
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(107,142,115,0.06)' },
                    ticks: {
                        callback: v => formatNumber(v),
                        font: { family: 'Inter', size: 11 },
                        color: '#8B8B8B'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 11 }, color: '#8B8B8B' }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

// 分类饼图
function updateCategoryChart(cats) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart) categoryChart.destroy();

    const labels = Object.keys(cats);
    const values = labels.map(k => cats[k].views);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: inkColors.slice(0, labels.length),
                borderColor: '#F8F6F2',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        usePointStyle: true,
                        font: { family: 'Inter', size: 11 },
                        color: '#4A4A4A',
                        generateLabels: chart => chart.data.labels.map((l, i) => ({
                            text: l + ' (' + formatNumber(chart.data.datasets[0].data[i]) + ')',
                            fillStyle: chart.data.datasets[0].backgroundColor[i],
                            pointStyle: 'circle',
                            index: i
                        }))
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26,26,26,0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            return ctx.label + ': ' + formatFullNumber(ctx.parsed) + ' (' + ((ctx.parsed / total) * 100).toFixed(1) + '%)';
                        }
                    }
                }
            }
        }
    });
}

// 排行榜
function updateRankTable(stats) {
    const tbody = document.getElementById('rankBody');
    tbody.innerHTML = '';
    stats.forEach((v, i) => {
        const r = i + 1;
        let rc = '';
        if (r === 1) rc = 'rank-1';
        else if (r === 2) rc = 'rank-2';
        else if (r === 3) rc = 'rank-3';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="rank-num ${rc}">${r}</span></td>
            <td class="video-title">${v.title}</td>
            <td><span class="category-tag">${v.category}</span></td>
            <td style="text-align:right">${formatFullNumber(v.views)}</td>
            <td style="text-align:right">${formatFullNumber(v.likes)}</td>
            <td style="text-align:right">${v.like_rate}%</td>
            <td style="text-align:right">${v.avg_watch_time}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 更新时间
function updateTime() {
    const now = new Date();
    document.getElementById('headerTime').textContent = now.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
}

// 自动刷新
setInterval(loadData, 60000);
setInterval(updateTime, 1000);

// 启动
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateTime();
});

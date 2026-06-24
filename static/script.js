// 格式化数字
function formatNumber(num) {
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    return num.toLocaleString();
}

// 格式化大数字为完整显示
function formatFullNumber(num) {
    return num.toLocaleString();
}

// 颜色方案
const colors = ['#3182ce', '#38a169', '#e53e3e', '#d69e2e', '#805ad5', '#ed8936', '#319795', '#d53f8c'];
const colorAlpha = ['rgba(49,130,206,0.3)', 'rgba(56,161,105,0.3)', 'rgba(229,62,62,0.3)', 'rgba(214,158,46,0.3)',
    'rgba(128,90,213,0.3)', 'rgba(237,137,54,0.3)', 'rgba(49,151,149,0.3)', 'rgba(213,63,140,0.3)'];

let trendChart = null;
let categoryChart = null;

// 加载数据
async function loadData() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        updateCards(data);
        updateTrendChart(data.daily_views);
        updateCategoryChart(data.category_stats);
        updateRankTable(data.video_stats);
    } catch (error) {
        console.error('加载数据出错:', error);
    }
}

// 更新概览卡片
function updateCards(data) {
    document.getElementById('totalViews').textContent = formatNumber(data.total_views);
    document.getElementById('totalVideos').textContent = data.total_videos;
    document.getElementById('totalLikes').textContent = formatNumber(data.total_likes);
    document.getElementById('avgWatchTime').textContent = data.avg_watch_time + '分';
}

// 更新趋势图
function updateTrendChart(dailyViews) {
    const ctx = document.getElementById('trendChart').getContext('2d');

    if (trendChart) trendChart.destroy();

    const dates = dailyViews.map(d => d.date);
    const views = dailyViews.map(d => d.views);
    const uniqueViewers = dailyViews.map(d => d.unique_viewers);

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: '播放量',
                    data: views,
                    borderColor: '#3182ce',
                    backgroundColor: 'rgba(49,130,206,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3182ce',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                },
                {
                    label: '独立访客',
                    data: uniqueViewers,
                    borderColor: '#38a169',
                    backgroundColor: 'rgba(56,161,105,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#38a169',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 },
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatFullNumber(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        },
                        font: { size: 11 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 更新分类饼图
function updateCategoryChart(categoryStats) {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    if (categoryChart) categoryChart.destroy();

    const categories = Object.keys(categoryStats);
    const values = categories.map(cat => categoryStats[cat].views);
    const total = values.reduce((a, b) => a + b, 0);

    // 更新图例
    const legendContainer = document.getElementById('legendContainer');
    legendContainer.innerHTML = '';

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, categories.length),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        usePointStyle: true,
                        font: { size: 11 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label + ' (' + formatNumber(data.datasets[0].data[i]) + ')',
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i,
                                pointStyle: 'circle'
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const pct = ((value / total) * 100).toFixed(1);
                            return context.label + ': ' + formatFullNumber(value) + ' (' + pct + '%)';
                        }
                    }
                }
            }
        }
    });
}

// 更新排行榜
function updateRankTable(videoStats) {
    const tbody = document.getElementById('rankBody');
    tbody.innerHTML = '';

    videoStats.forEach((video, index) => {
        const rank = index + 1;
        let rankClass = '';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="rank-num ${rankClass}">${rank}</span></td>
            <td><strong>${video.title}</strong></td>
            <td><span class="category-tag">${video.category}</span></td>
            <td>${formatFullNumber(video.views)}</td>
            <td>${formatFullNumber(video.likes)}</td>
            <td>${video.like_rate}%</td>
            <td>${video.avg_watch_time}分钟</td>
        `;
        tbody.appendChild(tr);
    });
}

// 自动刷新 - 每1分钟
function autoRefresh() {
    loadData();
    setInterval(loadData, 60000);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    autoRefresh();
});

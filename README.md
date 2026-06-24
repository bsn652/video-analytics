# 墨韵数据 · 视频网站数据分析系统 🎬

基于 **Flask + Chart.js** 构建，融入 **新中式水墨美学** 的视频平台运营数据分析仪表板。

## 设计特色

- 🎨 **水墨美学** - 宣纸质感背景、墨色渐变、远山剪影
- 🌫️ **浮动云雾** - 动态雾效营造沉浸氛围
- 📜 **宋体排版** - Noto Serif SC 衬线字体
- ✨ **细腻动效** - 卡片悬浮、淡入动画、hover 反馈
- 🏔️ **东方意境** - 现代数据与东方美学的融合

## 功能特性

| 模块 | 说明 |
|------|------|
| 📊 数据概览 | 总播放量、视频数、点赞数、平均观看时长 |
| 📈 播放趋势 | 近7日播放量与独立访客折线图 |
| 🥧 分类占比 | 各分类视频播放占比环形图 |
| 🏆 热门排行 | 视频播放量排行榜 |

## 快速启动

```bash
# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py

# 打开浏览器
http://localhost:5000
```

## 技术栈

- **后端**: Python Flask
- **前端**: HTML5 + CSS3 + JavaScript (ES6)
- **图表**: Chart.js
- **字体**: Noto Serif SC / Inter
- **设计**: 新中式水墨风格 (ymmg)

## 项目结构

```
video-analytics/
├── app.py                  # Flask 后端
├── requirements.txt        # 依赖
├── templates/
│   └── index.html          # 水墨风格仪表板
├── static/
│   ├── style.css           # 水墨风格样式
│   └── script.js           # 数据交互逻辑
└── README.md               # 项目说明

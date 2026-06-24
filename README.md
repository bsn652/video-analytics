# 视频网站数据分析系统 🎬

基于 Flask + Chart.js 构建的视频平台运营数据分析仪表板。

## 功能特性

- 📊 **数据概览** - 总播放量、视频数、点赞数、平均观看时长
- 📈 **播放趋势** - 近7日播放量与独立访客趋势图
- 🥧 **分类分析** - 各分类视频播放占比饼图
- 🏆 **热门排行榜** - 视频播放量排行榜

## 快速启动

```bash
# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py

# 打开浏览器访问
http://localhost:5000
```

## 技术栈

- **后端**: Python Flask
- **前端**: HTML5 + CSS3 + JavaScript
- **图表**: Chart.js
- **数据**: 模拟生成

## 项目结构

```
video-analytics/
├── app.py                  # Flask 后端主程序
├── requirements.txt        # Python 依赖
├── templates/
│   └── index.html          # 前端页面
├── static/
│   ├── style.css           # 样式文件
│   └── script.js           # JavaScript 逻辑
└── README.md               # 项目说明

from flask import Flask, render_template, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# 模拟数据生成
def generate_mock_data():
    # 视频列表
    videos = [
        {"id": 1, "title": "【4K】绝美自然风光纪录片", "category": "纪录片"},
        {"id": 2, "title": "Python机器学习入门到精通", "category": "教育"},
        {"id": 3, "title": "最新热门电影预告片", "category": "电影"},
        {"id": 4, "title": "美食探店：隐藏小巷的宝藏餐厅", "category": "美食"},
        {"id": 5, "title": "一周全球科技新闻汇总", "category": "科技"},
        {"id": 6, "title": "跟着专业教练学瑜伽", "category": "健身"},
        {"id": 7, "title": "搞笑短剧：办公室日常", "category": "搞笑"},
        {"id": 8, "title": "吉他入门教程：第一课", "category": "音乐"},
    ]

    # 最近7天的观看数据
    today = datetime.now()
    daily_views = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        daily_views.append({
            "date": day.strftime("%m-%d"),
            "views": random.randint(5000, 30000),
            "unique_viewers": random.randint(2000, 15000)
        })

    # 视频详细数据
    video_stats = []
    for v in videos:
        views = random.randint(10000, 500000)
        likes = int(views * random.uniform(0.02, 0.08))
        comments = int(views * random.uniform(0.005, 0.02))
        video_stats.append({
            **v,
            "views": views,
            "likes": likes,
            "comments": comments,
            "avg_watch_time": round(random.uniform(2.5, 15.0), 1),
            "like_rate": round(likes / views * 100, 1)
        })

    # 分类统计
    category_stats = {}
    for vs in video_stats:
        cat = vs["category"]
        if cat not in category_stats:
            category_stats[cat] = {"views": 0, "likes": 0, "count": 0}
        category_stats[cat]["views"] += vs["views"]
        category_stats[cat]["likes"] += vs["likes"]
        category_stats[cat]["count"] += 1

    return {
        "total_views": sum(v["views"] for v in video_stats),
        "total_videos": len(video_stats),
        "total_likes": sum(v["likes"] for v in video_stats),
        "avg_watch_time": round(sum(v["avg_watch_time"] for v in video_stats) / len(video_stats), 1),
        "daily_views": daily_views,
        "video_stats": sorted(video_stats, key=lambda x: x["views"], reverse=True),
        "category_stats": category_stats,
        "top_video": max(video_stats, key=lambda x: x["views"])
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/dashboard')
def dashboard():
    data = generate_mock_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

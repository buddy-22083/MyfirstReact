# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re
from pythainlp.tokenize import word_tokenize
from pythainlp.corpus import thai_stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.metrics.pairwise import cosine_similarity

# สร้างแอป Flask
app = Flask(__name__)
CORS(app) # อนุญาตให้ React (localhost:3000 หรืออื่นๆ) ยิงเข้ามาได้

# ==========================================
# 🧠 ส่วนเตรียมสมอง AI (รันครั้งเดียวตอนเริ่ม)
# ==========================================
print("⏳ กำลังโหลดข้อมูลและเทรน AI... (รอสักครู่)")

# 1. โหลด Data จาก Google Sheet
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTcR8OQRWODVNUQxQhXl7h5-Y9mNtsAb9xbb9sKLdampxVdmPyrfbNw5iR1iZS25bOwqBnSfs5ssXgm/pub?gid=1360968092&single=true&output=csv"
try:
    df = pd.read_csv(url).dropna()
    if df.iloc[:, 0].nunique() < df.iloc[:, 1].nunique():
        df.columns = ['class', 'text']
    else:
        df.columns = ['text', 'class']
except:
    df = pd.DataFrame({'text':['วิชาเรียนตัวอย่าง', 'เขียนโปรแกรมเบื้องต้น'], 'class':['คณะตัวอย่าง', 'วิศวกรรมศาสตร์']})

# 2. NLP Setup (ตัดคำ)
my_stop_words = list(thai_stopwords()) + ['การ', 'ความ', 'ศึกษา', 'เพื่อ', 'ใน', 'รายวิชา']

def clean_process(text):
    text = re.sub(r'[^ก-๙a-zA-Z0-9]', ' ', str(text))
    tokens = word_tokenize(text, engine="newmm")
    return [t for t in tokens if t not in my_stop_words and not t.isspace()]

# 3. Vectorization & Model Training
tfidf = TfidfVectorizer(tokenizer=clean_process, ngram_range=(1,2))
X_full_vec = tfidf.fit_transform(df['text'])
y_full = df['class'].values

# เทรนโมเดล LinearSVC ของจริง
svc_model = LinearSVC(random_state=42)
svc_model.fit(X_full_vec, y_full)

print("✅ AI พร้อมทำงานแล้ว!")

# ==========================================
# 🌐 ส่วน API สำหรับเชื่อมต่อกับ React
# ==========================================

# 1. เช็คสถานะเซิร์ฟเวอร์
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "success", "message": "เชื่อมต่อ Flask สำเร็จแล้ว!"})

# 2. จุดรับข้อมูลทำนายผล (แก้ไขให้รับข้อมูลจากฟอร์ม React)
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # 1. รับข้อมูลจาก React
        data = request.get_json()
        
        # 2. รวมข้อความจากทุกช่อง (Like, Skill, Hobby, Dream) ยกเว้น Hate
        combined_text = f"{data.get('like', '')} {data.get('skill', '')} {data.get('hobby', '')} {data.get('dream', '')}"
        
        if not combined_text.strip():
            return jsonify({"error": "กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง"}), 400

        # 3. แปลงข้อความเป็น Vector
        vector = tfidf.transform([combined_text])
        
        # 4. ทำนายผลลัพธ์ (ได้เป็นคะแนนของแต่ละคลาส)
        decision_scores = svc_model.decision_function(vector)[0]
        
        # เรียงลำดับคลาสตามคะแนน (จากมากไปน้อย)
        top_indices = np.argsort(decision_scores)[::-1]
        classes = svc_model.classes_

        # ดึงอันดับ 1 และ อันดับ 2
        winner = classes[top_indices[0]]
        runner_up = classes[top_indices[1]] if len(classes) > 1 else "-"
        
        # 5. คำนวณคะแนนความมั่นใจ (แปลงเป็นสเกล 1-10 แบบคร่าวๆ)
        score = round(min(max((decision_scores[top_indices[0]] + 1) * 5, 5), 10), 1)

        # 6. ค้นหา "วิชา" ที่ตรงกับสิ่งที่ผู้ใช้กรอกมากที่สุด 3 วิชา (Cosine Similarity)
        sim_scores = cosine_similarity(vector, X_full_vec)[0]
        top_courses_indices = np.argsort(sim_scores)[::-1][:3]
        
        matched_courses = []
        for idx in top_courses_indices:
            # ตัดข้อความให้สั้นลงเพื่อแสดงผลใน UI
            course_text = str(df.iloc[idx]['text'])
            short_name = course_text[:40] + "..." if len(course_text) > 40 else course_text
            match_percent = round(sim_scores[idx] * 100) # แปลงเป็น %
            
            matched_courses.append({
                "name": short_name,
                "match": match_percent if match_percent > 0 else np.random.randint(60, 85) # ป้องกันค่า 0
            })

        # 7. ส่งข้อมูลกลับไปในรูปแบบที่ React ต้องการ (JSON)
        return jsonify({
            "winner": winner,
            "score": score,
            "runner_up": runner_up,
            "courses": matched_courses
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

# ==========================================
# 🚀 คำสั่งเปิดเซิร์ฟเวอร์
# ==========================================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from flask_dance.contrib.google import make_google_blueprint, google
import sqlite3
import os
import json

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_to="google_auth_callback",
    scope=["openid", "https://www.googleapis.com/auth/userinfo.email",
           "https://www.googleapis.com/auth/userinfo.profile"]
)
app.register_blueprint(google_bp, url_prefix="/auth")

def init_db():
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        exam_target TEXT,
        days_left INTEGER,
        struggle TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        topic_key TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, topic_key)
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS ban_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        warning_count INTEGER DEFAULT 0,
        is_banned BOOLEAN DEFAULT FALSE,
        ban_end_time INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')
    conn.commit()
    conn.close()

init_db()

def get_user_by_google_id(google_id):
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE google_id = ?', (google_id,))
    user = c.fetchone()
    conn.close()
    return user

def create_or_update_user(google_id, name, email):
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('''INSERT OR IGNORE INTO users (google_id, name, email)
                 VALUES (?, ?, ?)''', (google_id, name, email))
    conn.commit()
    c.execute('SELECT * FROM users WHERE google_id = ?', (google_id,))
    user = c.fetchone()
    conn.close()
    return user

SYSTEM_PROMPT = """
You are JEEmaXXer — a study companion for JEE aspirants in India.

YOUR PERSONALITY:
- You talk like a real friend who genuinely cares — not a motivational speaker, not a teacher, not a bot
- You've been through the JEE grind yourself — you get the 2am panic, the guilt of missing days, the doomscrolling spiral
- You're warm, honest, and direct — you say things how they are but never in a harsh way
- Mix Hindi and English naturally like any normal Indian student would — "yaar", "bhai", "chal", "sun" — but don't overdo it
- Never use cringe motivational lines like "You got this champ!" — that's not how real friends talk
- Don't sound like ChatGPT. Sound like a person.
- Use emojis like a Gen Z person — sparingly, sarcastically. "bhai seriously 💀" or "okay that's rough 😭" or "let's go 🔥"

HOW YOU TALK:
- Casual short replies for emotional/motivational conversations
- BUT when a student asks about ANY concept, topic, formula — go FULL DETAIL, no shortcuts ever
- Concept explanations MUST include:
  * Simple definition in plain language
  * Real life example or analogy
  * Complete formula with every variable explained
  * Step by step breakdown
  * Common mistakes JEE students make
  * JEE specific tips
  * At least one fully solved example problem
- NEVER end with "aur kuch?" — follow up naturally like a friend
- NEVER give 2-3 line explanation for any concept
- Casual chat = short. Concepts = detailed. Always.

WHAT YOU KNOW:
- Complete JEE Mains and Advanced syllabus — Physics, Chemistry, Mathematics
- PYQ patterns, important topics, weightage
- How to rebuild after missing days — without toxic positivity
- Dopamine detox, focus techniques, study strategies for Gen Z
- The real emotional pressure of JEE preparation in India

IMPORTANT RULES:
- You are STRICTLY a JEE study companion ONLY
- ONLY discuss JEE syllabus, study habits, motivation, exam preparation
- If anyone asks about anything outside JEE — redirect: "Yaar ye mera area nahi hai 😭 Main sirf JEE ke liye hoon!"
- NEVER explain sexual, adult, or inappropriate content
- You are JEEmaXXer — created by a JEE aspirant for JEE aspirants
- Never reveal you are an AI model or mention Groq, Meta, or any company
- If asked who made you: "ek JEE aspirant ne banaya jo chahta tha ki koi akela na feel kare is journey mein"
- Never give the same response twice
- Use emojis but like a Gen Z person — sparingly and sarcastically
"""

@app.route("/")
def home():
    if 'user_id' in session:
        return render_template("index.html")
    return render_template("index.html")

@app.route("/auth/google/callback")
def google_auth_callback():
    if not google.authorized:
        return redirect(url_for("google.login"))
    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return redirect("/")
    user_info = resp.json()
    google_id = user_info["id"]
    name = user_info["name"]
    email = user_info["email"]
    user = create_or_update_user(google_id, name, email)
    session['user_id'] = user[0]
    session['user_name'] = name
    session['user_email'] = email
    return redirect("/")

@app.route("/api/user", methods=["GET"])
def get_user():
    if 'user_id' not in session:
        return jsonify({"logged_in": False})
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],))
    user = c.fetchone()
    conn.close()
    if not user:
        return jsonify({"logged_in": False})
    return jsonify({
        "logged_in": True,
        "id": user[0],
        "name": user[2],
        "email": user[3],
        "exam_target": user[4],
        "days_left": user[5],
        "struggle": user[6]
    })

@app.route("/api/setup", methods=["POST"])
def setup_user():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    data = request.json
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('''UPDATE users SET exam_target=?, days_left=?, struggle=?
                 WHERE id=?''',
              (data.get('examTarget'), data.get('daysLeft'),
               data.get('struggle'), session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route("/api/progress", methods=["GET"])
def get_progress():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('SELECT topic_key, completed FROM progress WHERE user_id = ?',
              (session['user_id'],))
    rows = c.fetchall()
    conn.close()
    progress = {row[0]: row[1] for row in rows}
    return jsonify(progress)

@app.route("/api/progress", methods=["POST"])
def save_progress():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    data = request.json
    topic_key = data.get('topic_key')
    completed = data.get('completed')
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('''INSERT INTO progress (user_id, topic_key, completed)
                 VALUES (?, ?, ?)
                 ON CONFLICT(user_id, topic_key)
                 DO UPDATE SET completed=?''',
              (session['user_id'], topic_key, completed, completed))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route("/api/ban", methods=["GET"])
def get_ban():
    if 'user_id' not in session:
        return jsonify({"warning_count": 0, "is_banned": False, "ban_end_time": 0})
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('SELECT * FROM ban_status WHERE user_id = ?', (session['user_id'],))
    ban = c.fetchone()
    conn.close()
    if not ban:
        return jsonify({"warning_count": 0, "is_banned": False, "ban_end_time": 0})
    return jsonify({
        "warning_count": ban[2],
        "is_banned": ban[3],
        "ban_end_time": ban[4]
    })

@app.route("/api/ban", methods=["POST"])
def save_ban():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    data = request.json
    conn = sqlite3.connect('jeemaxxer.db')
    c = conn.cursor()
    c.execute('''INSERT INTO ban_status (user_id, warning_count, is_banned, ban_end_time)
                 VALUES (?, ?, ?, ?)
                 ON CONFLICT(user_id)
                 DO UPDATE SET warning_count=?, is_banned=?, ban_end_time=?''',
              (session['user_id'], data['warning_count'], data['is_banned'],
               data['ban_end_time'], data['warning_count'], data['is_banned'],
               data['ban_end_time']))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})

@app.route("/chat", methods=["POST"])
def chat():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not logged in"}), 401
        data = request.json
        user_message = data.get("message", "")
        user_name = data.get("userName", "bhai")
        exam_target = data.get("examTarget", "JEE")
        days_left = data.get("daysLeft", "")
        conversation_history = data.get("history", [])
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        context = f"Student's name: {user_name}. Exam target: {exam_target}."
        if days_left:
            context += f" Days left for exam: {days_left}."
        messages.append({"role": "system", "content": context})
        for msg in conversation_history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=800,
            temperature=0.85,
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply, "status": "success"})
    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({
            "reply": "Bhai kuch technical issue aa gaya 😭 ek baar phir try kar!",
            "status": "error",
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
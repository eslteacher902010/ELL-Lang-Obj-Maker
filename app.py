import os

import openai
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import requests

load_dotenv()
print("Key loaded?", os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/suggest_content")
def suggest_content():
    user_input = request.args.get("input", "")
    field_type = request.args.get("field", "general")

    if not user_input:
        return jsonify([])

    prompt = f"""
    A teacher is writing a WIDA-aligned language objective.
    The teacher typed: "{user_input}"
    The field input is: "{field_type}"

    Suggest 5 short completion fragments (1–3 words) that fit this field:
    -Suggest **no more than 5** short completion fragments (1–3 words).
    - If field = "who": types of learners (e.g., "Level 2 newcomers", "7th grade", "Spanish speakers").
    - If field = "goal": lesson goals or content topics (e.g., "cell division", "persuasive writing").
    - If field = "forms": language forms/features (e.g., "complex sentences", "signal words").
    - If field = "supports": scaffolds (e.g., "graphic organizer", "sentence frames").
    - If field = "function": communicative functions (e.g., "explain reasoning", "compare ideas").

    Return ONLY a valid JSON array of strings, without markdown, code fences, or extra text.
    """

    response= client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

    content = response.choices[0].message.content.strip()


    try:
        import json
        suggestions = json.loads(content)
    except Exception:
        suggestions = [content]

    return jsonify(suggestions)



@app.route('/agentic_detect', methods=['POST'])
def agentic_detect():
    data = request.get_json()
    objective = data.get('objective', '')

    if not objective:
        return jsonify({"error": "No objective provided"}), 400

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a teaching assistant that reads language objectives. "
                    "Return ONLY a short, lowercase topic phrase (2–5 words) that captures the key idea. "
                    "Do NOT write full sentences, explanations, or quotes."
                )
            },
            {"role": "user", "content": objective}
        ]
    )

    topic = completion.choices[0].message.content.strip()
    return jsonify({"topic": topic})


@app.route("/find_articles", methods=["POST"])
def find_articles():
    data = request.get_json()
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    # Use GPT to rephrase the topic into a better search query
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": (
                "Rephrase the teacher's topic into a concise Google search query "
                "for lesson plans, classroom ideas, or teaching resources. "
                "Keep it short and relevant."
            )},
            {"role": "user", "content": topic}
        ]
    )
    query = completion.choices[0].message.content.strip()

    #Build smart Google search URLs
    base_query = f"{query} lesson plan OR classroom activity OR teaching ideas site:.edu OR site:edutopia.org OR site:readwritethink.org OR site:weareteachers.com"
    search_url = f"https://www.google.com/search?q={requests.utils.quote(base_query)}"

    #Return 3 "curated" results (they’re Google searches for different angles)
    articles = [
        {"title": f"Lesson plans for '{topic}'", "url": search_url},
        {"title": f"Classroom activities for '{topic}'", "url": f"https://www.google.com/search?q={requests.utils.quote(topic + ' classroom activity site:edutopia.org')}"},
        {"title": f"Teaching strategies for '{topic}'", "url": f"https://www.google.com/search?q={requests.utils.quote(topic + ' teaching strategies site:.edu OR site:weareteachers.com')}"}
    ]

    return jsonify({"articles": articles})





if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)


import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from openai import OpenAI

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


if __name__ == "__main__":
    app.run(debug=True)
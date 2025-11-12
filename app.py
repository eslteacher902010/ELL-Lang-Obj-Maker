import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import requests



load_dotenv()
print("Key loaded?", os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/resources")
def resources():
    topic = request.args.get("topic", "").strip()
    if not topic:
        return render_template("resources.html", articles=[], topic="")

    articles = fetch_general_resources(topic)
    print("Fetched general teaching resources:", articles)

    summaries = [summarize_text(a["title"]) for a in articles]
    combined = zip(articles, summaries)
    return render_template("resources.html", articles=combined, topic=topic)


def fetch_general_resources(topic):
    """Generate direct Google search links for general K–12 teaching resources."""
    base = "https://www.google.com/search?q="
    encoded = requests.utils.quote(topic)

    articles = [
        {
            "title": f"Lesson plans for {topic}",
            "url": f"{base}{encoded}+lesson+plans+site:.edu+OR+site:edutopia.org+OR+site:readwritethink.org"
        },
        {
            "title": f"Teaching strategies for {topic}",
            "url": f"{base}{encoded}+teaching+strategies+site:.edu+OR+site:weareteachers.com+OR+site:edutopia.org"
        },
        {
            "title": f"Classroom activities and resources for {topic}",
            "url": f"{base}{encoded}+classroom+activities+site:.edu+OR+site:sharemylesson.com+OR+site:readwritethink.org"
        },
    ]

    print(f"Generated {len(articles)} resource links for topic: {topic}")
    return articles

def summarize_text(text):
    """Summarize the content focus of an education resource in plain, student-facing language."""
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You summarize educational resources briefly and neutrally. "
                        "Do not speak to educators or mention teachers. "
                        "Just describe what the resource covers or helps students learn."
                    )
                },
                {
                    "role": "user",
                    "content": f"Summarize '{text}' in one or two short sentences, focusing on what learners do or explore."
                }
            ],
            temperature=0.6,
        )

        return completion.choices[0].message.content.strip() or "(No summary available.)"

    except Exception as e:
        print("⚠️ Summarizer error:", e)
        return "(Summary unavailable — showing link only.)"

@app.route("/wida_resources")
def wida_resources():
    return render_template("wida_resources.html")


@app.route("/")
def index():
    return render_template("index.html") #basic routes

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/suggest_content")
def suggest_content():
    user_input = request.args.get("input", "") #Use Flask’s request object to read query parameters from the URL.
    field_type = request.args.get("field", "general") #field is what I want queried , general is fall back

    if not user_input:
        return jsonify([]) #make it json

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

    # Build an AI prompt to generate 5 short completion suggestions (1–3 words)
    # for a teacher writing a WIDA-aligned language objective. The suggestions
    # vary depending on which field type the user selected (e.g., who, goal,
    # forms, supports, or function). Returns a plain JSON array of strings.

    response= client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5 #how creative the AI is
    )

    content = response.choices[0].message.content.strip()


    try:  #safety
        import json
        suggestions = json.loads(content)
    except Exception:
        suggestions = [content]

    return jsonify(suggestions)

# Try to safely parse the AI response as JSON.
# If parsing fails (e.g., invalid JSON), fall back to returning the raw content as a single-item list.
# Finally, return the result to the frontend as JSON.



@app.route('/agentic_detect', methods=['POST'])
def agentic_detect():
    data = request.get_json()  #get the json data
    objective = data.get('objective', '') #get the finished objective at the end

    if not objective:
        return jsonify({"error": "No objective provided"}), 400  #safety
    # Send the objective to the GPT model to identify its main topic or theme.

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

    topic = completion.choices[0].message.content.strip() #strip content here to get topic from AI
    return jsonify({"topic": topic})        # Return the detected topic to the frontend as JSON.



@app.route("/agentic_intro", methods=["GET"])
def agentic_intro():
    """
    Suggests current trending classroom topics or themes teachers are teaching this month. This will start the lesson
    """
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an education trend analyst. "
                    "List 5 topics teachers are commonly teaching in K–12 classrooms this month. "
                    "Be diverse across subjects (ELA, science, math, social studies, ESL). "
                    "Return ONLY a valid JSON array of strings, no markdown, no explanation, no code fences."
                ),
            },
            {"role": "user", "content": "What are teachers teaching this month?"},
        ],
        temperature=0.7, #AI suggestions and this time ask AI to be fairly creative
    )

    import json
    text = completion.choices[0].message.content.strip()

    # Cleanly parse GPT output even if it includes code fences--triple back ticks --want a clean delivery from ChatGpt
    if text.startswith("```"):
        text = text.strip("`").replace("json", "").strip()

    try:
        topics = json.loads(text)
    except Exception:
        # fallback: handle bullet points or comma-separated text
        topics = [t.strip("•- \n") for t in text.split("\n") if t.strip()]

    # Always return as proper JSON
    return jsonify({"topics": topics})



@app.route("/find_articles", methods=["POST"])
def find_articles():
    # This route receives a topic (like "photosynthesis") from the frontend,
    # rephrases it with GPT to make a better Google search,
    # and returns a few helpful teaching-related search links.
    data = request.get_json() # Get the JSON body of the POST request.
    topic = data.get("topic", "").strip()  # Pull the "topic" field safely from that data.

    # If no topic was provided, return an error message and a 400 (Bad Request) status code.

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

    # Build a Google search URL that looks for educational sites (.edu, Edutopia, etc.).
    # f"...{variable}..." means Python will insert the value of that variable into the string.
    base_query = f"{query} lesson plan OR classroom activity OR teaching ideas site:.edu OR site:edutopia.org OR site:readwritethink.org OR site:weareteachers.com"
    search_url = f"https://www.google.com/search?q={requests.utils.quote(base_query)}"

    # "quote" safely encodes spaces and special characters for a valid URL.
    # Example: "lesson plan ideas" → "lesson%20plan%20ideas"


    #Return 3 "curated" results (they’re Google searches for different angles)
    # Each item has a title and a Google search URL for that topic.
    articles = [
        {"title": f"Lesson plans for '{topic}'", "url": search_url},
        {"title": f"Classroom activities for '{topic}'", "url": f"https://www.google.com/search?q={requests.utils.quote(topic + ' classroom activity site:edutopia.org')}"},
        {"title": f"Teaching strategies for '{topic}'", "url": f"https://www.google.com/search?q={requests.utils.quote(topic + ' teaching strategies site:.edu OR site:weareteachers.com')}"}
    ]

    return jsonify({"articles": articles})



#start

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)


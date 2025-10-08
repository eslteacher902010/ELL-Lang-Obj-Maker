//<!-- Suggestions -->

async function fetchSuggestions(inputValue, listId, fieldType) {
  if (!inputValue) {
    document.getElementById(listId).innerHTML = "";
    return;
  }

  const res = await fetch(`/suggest_content?input=${encodeURIComponent(inputValue)}&field=${fieldType}`);
  let suggestions = await res.json();

  //filter before showing
  suggestions = filterSuggestions(suggestions, inputValue);

  showSuggestions(suggestions, listId);
}

// new filter function
function filterSuggestions(suggestions, userInput) {
  return suggestions.filter(s =>
    s.toLowerCase().startsWith(userInput.toLowerCase())
  );
}

function showSuggestions(suggestions, listId) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  suggestions.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    li.style.cursor = "pointer";

    li.onclick = () => {
      const inputId = listId.replace("-suggestions", "-input");
      document.getElementById(inputId).value = s;

      updateField(inputId.replace("-input",""), s);

      list.innerHTML = "";
    };

    list.appendChild(li);
  });
}



document.getElementById("agentic-ai-button").addEventListener("click", async () => {
  const aiText = document.querySelector("#agentic-ai-helper p");
  const topic = aiText.textContent.match(/about (.*?)\./)?.[1] || "";

  try {
    const res = await fetch("/find_articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });
    const data = await res.json();

    aiText.textContent = "Here are some ideas:";
    const list = document.createElement("ul");
    list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";

    data.articles.forEach(article => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = article.url;
      a.textContent = article.title;
      a.target = "_blank";
      a.className = "text-blue-600 hover:underline";
      li.appendChild(a);
      list.appendChild(li);
    });

    aiText.insertAdjacentElement("afterend", list);
  } catch (err) {
    console.error("Error fetching articles:", err);
    aiText.textContent = "Sorry, couldn’t load articles right now.";
  }
});


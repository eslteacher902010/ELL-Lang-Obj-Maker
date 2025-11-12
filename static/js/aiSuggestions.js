//<!-- Suggestions -->
// This section handles real-time suggestion fetching and display as the user types.

// 🔹 Fetch possible suggestions from the backend (based on user input and field type)
//listid is just a string that tells your function which <ul> or <div> in your HTML to update with suggestion items.
async function fetchSuggestions(inputValue, listId, fieldType) {
// If the input box is empty, clear the list and stop
  if (!inputValue) {
    document.getElementById(listId).innerHTML = "";
    return;
  }
  // Ask the Flask route /suggest_content for suggestions
  const res = await fetch(`/suggest_content?input=${encodeURIComponent(inputValue)}&field=${fieldType}`);
  let suggestions = await res.json();

  // Filter suggestions before showing (only those that start with user input)
  suggestions = filterSuggestions(suggestions, inputValue);
   // Display the filtered suggestions under the input box

  showSuggestions(suggestions, listId);
}

// 🔹 Filter suggestions to only show words that start with what the user typed
function filterSuggestions(suggestions, userInput) {
  return suggestions.filter(s =>
    s.toLowerCase().startsWith(userInput.toLowerCase())
  );
}
// 🔹 Create and display the clickable list of suggestions

function showSuggestions(suggestions, listId) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  suggestions.forEach(s => {
    const li = document.createElement("li"); // create a new list item
    li.textContent = s;  // show the suggestion text
    li.style.cursor = "pointer"; // make the cursor a hand (clickable)

    // When a suggestion is clicked:
    li.onclick = () => {
     // Find the related input box (based on the suggestion list’s id pattern)
      const inputId = listId.replace("-suggestions", "-input");
      // Fill the input box with the clicked suggestion
      document.getElementById(inputId).value = s;
      // Update the corresponding field in your form or state
      updateField(inputId.replace("-input",""), s);
          // Clear the suggestion list after selecting one
      list.innerHTML = "";
    };

    list.appendChild(li);
  });
}

//change position of ai
function adjustBotPosition(isFinalScreen = false) {
  const bot = document.getElementById('agentic-ai-helper');
  if (!bot) return;
  if (isFinalScreen) {
    bot.classList.add('high');
  } else {
    bot.classList.remove('high');
  }
}



// When the AI helper button is clicked, fetch related teaching articles
document.getElementById("agentic-ai-button").addEventListener("click", async () => {
  const aiText = document.querySelector("#agentic-ai-helper p");
    // Try to extract the current topic from the AI text (e.g., “about photosynthesis.”)

  const topic = aiText.textContent.match(/about (.*?)\./)?.[1] || "";

  try {
      // Ask the backend for related articles based on the detected topic

    const res = await fetch("/find_articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });
    const data = await res.json();

        // Display article list below the AI helper text
    aiText.textContent = "Here are some ideas:";
    const list = document.createElement("ul");
    list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";

    // For each article, create a clickable link inside a list item

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
    // Insert the new list right after the AI text paragraph

    aiText.insertAdjacentElement("afterend", list);
  } catch (err) {
    console.error("Error fetching articles:", err);
    aiText.textContent = "Sorry, couldn’t load articles right now.";
  }
});


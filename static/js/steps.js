const steps = document.querySelectorAll(".step");
let currentStep = 0;


function nextStep(index) {
  // Clear dynamic content if not the first step
  if (index !== 0) clearDynamicPanel();
  adjustButtonPosition();

  // Always hide example hints when changing steps
  document.getElementById("who-example").classList.add("hidden");
  document.getElementById("goal-example").classList.add("hidden");

  // Update visual step indicators
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed", "disabled");

    if (i < index) {
      step.classList.add("completed");
    } else if (i === index) {
      step.classList.add("active");
    } else if (i === index + 1) {
      step.classList.remove("disabled");
    } else {
      step.classList.add("disabled");
    }
  });

  //Step logic
  if (index === 0) {
    // Step 0: WHO
    document.getElementById('sidebar-section').classList.add('hidden');
    document.getElementById('full-panel').classList.remove('hidden');
    showWhoInput("full-panel");

    const aiHelper = document.getElementById("agentic-ai-helper");
    const aiText = aiHelper.querySelector("p");
    const aiButton = document.getElementById("agentic-ai-button");

    aiText.textContent = "Hi! Can’t think of what to teach today? Let's see what teachers are teaching these days.";
    aiButton.textContent = "Let's Go!";
    aiButton.dataset.mode = "intro";
    aiHelper.classList.add("show");

  } else if (index === 1) {
    // Step 1: FUNCTION
    document.getElementById('full-panel').classList.add('hidden');
    updateSidebar('function');

  } else if (index === 2) {
    // Step 2: GOAL
    document.getElementById('sidebar-section').classList.add('hidden');
    document.getElementById('full-panel').classList.remove('hidden');
    showGoalInput("full-panel");

  } else if (index >= 3 && index <= 5) {
    // Steps 3–5: DOMAIN / FORMS / SUPPORTS
    document.getElementById('full-panel').classList.add('hidden');
    updateSidebar(['domain', 'forms', 'supports'][index - 3]);

  } else if (index === 6) {
    // Step 6: FINISHED LO
    document.getElementById('full-panel').classList.add('hidden');

    const preview = document.getElementById("objective-preview");
    const objectiveText = preview.innerText.trim();

    fetch('/agentic_detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objective: objectiveText })
  })
  .then(res => res.json())
  .then(data => {
  const aiHelper = document.getElementById("agentic-ai-helper");
  const aiText = aiHelper.querySelector("p");

  const aiButton = document.getElementById("agentic-ai-button");
  aiButton.textContent = "Find Articles";
  aiButton.dataset.mode = "articles";
  // Display short intro
  aiText.textContent = `Hey! Looks like your lesson is about ${data.topic}. Want some related articles?`;

  // Limit to 3 article topics only
  const limited = data.suggestions ? data.suggestions.slice(0, 3) : [];

  // Create a styled list
  const list = document.createElement("ul");
  list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";

  limited.forEach(s => {
    const li = document.createElement("li");

    // Link to a Google search for the suggestion
    const a = document.createElement("a");
    a.href = `https://www.google.com/search?q=${encodeURIComponent(s)}`;
    a.target = "_blank"; // open in new tab
    a.className = "text-blue-600 hover:underline";
    a.textContent = s;

    li.appendChild(a);
    list.appendChild(li);
  });

  // Append below the AI helper
  aiHelper.appendChild(list);
  aiHelper.classList.add("show");
})
.catch(err => console.error('Agentic AI failed:', err));

  const copyBtn = document.getElementById("copy-button");
  copyBtn.classList.add("show");

  const agenticAI = document.getElementById("agentic-ai-helper");
  agenticAI.classList.add("show");

  preview.classList.add("fullscreen-preview", "fade-in");


  // Optional: clear the rest of the UI
  document.querySelector("header").style.display = "none";
  document.querySelector("nav").style.display = "none";
  document.getElementById("sidebar-section").classList.add("hidden");
  document.getElementById("full-panel").classList.add("hidden");
} else {
    updateSidebar('none');
  }
}

// only once at startup
steps.forEach((step, i) => {
  step.addEventListener("click", e => {
    e.preventDefault();
    if (!step.classList.contains("disabled") && canAdvanceFrom(currentStep)) {
      currentStep = i;
      nextStep(i);
    } else if (!canAdvanceFrom(currentStep)) {
      alert("Please complete this step before continuing.");
    }
  });
});

// move forward
function goForward() {
  if (!canAdvanceFrom(currentStep)) {
    alert("Please complete this step before continuing.");
    return;
  }
  if (currentStep < steps.length - 1) {
    currentStep++;
    nextStep(currentStep);
    adjustButtonPosition();
  }
}
// move backward
function goBackward() {
  // Prevent moving before the first step
  if (currentStep === 0) {
    alert("You're already at the first step.");
    return;
  }

  // Move one step back
  currentStep--;
  nextStep(currentStep);
  adjustButtonPosition();
}

// initial call
nextStep(currentStep);


//can advance  functionality

function canAdvanceFrom(step) {
  switch (step) {
    case 1: // Function step
      return document.getElementById('function').textContent !== '[function]';
    case 3: // Domain step
      return document.getElementById('domain').textContent !== '[domain]';
    case 4: // Forms step
      return document.getElementById('forms').textContent !== '[forms/features]';
    case 5: // Supports step
      return document.getElementById('supports').textContent !== '[supports]';
    default:
      return true; // Step 0 and Goal can always move on
  }
}

//helper to position next buttons
function adjustButtonPosition() {
  const nextBtn = document.getElementById("next-button");
  const backBtn = document.getElementById("back-button");
  const dynamicPanel = document.getElementById("dynamic-panel");
  const nav = document.querySelector("nav");

  // If dynamic panel is visible (not hidden)
  const panelVisible = !dynamicPanel.classList.contains("hidden") && dynamicPanel.offsetParent !== null;

  if (panelVisible) {
    // Move buttons into the nav corners
    nav.appendChild(backBtn);
    nav.appendChild(nextBtn);
    nextBtn.classList.add("in-nav");
    backBtn.classList.add("in-nav");
  } else {
    // Return buttons to bottom of the page
    document.body.appendChild(backBtn);
    document.body.appendChild(nextBtn);
    nextBtn.classList.remove("in-nav");
    backBtn.classList.remove("in-nav");
    nextBtn.style.bottom = "1.5rem";
    backBtn.style.bottom = "1.5rem";
  }
}

const aiButton = document.getElementById("agentic-ai-button");
const aiText = document.querySelector("#agentic-ai-helper p");

// remove any previous listeners (good hygiene)
aiButton.replaceWith(aiButton.cloneNode(true));
const newAiButton = document.getElementById("agentic-ai-button");

// unified listener
newAiButton.addEventListener("click", async () => {
  const mode = newAiButton.dataset.mode; // either "intro" or "articles"

  // 🧹 Clear any previous lists (prevents stacking)
  const oldList = aiText.nextElementSibling;
  if (oldList && oldList.tagName === "UL") oldList.remove();

  if (mode === "intro") {
    aiText.textContent = "Let’s see what teachers are teaching this month...";
    try {
      const res = await fetch("/agentic_intro");
      const data = await res.json();

      aiText.textContent = "Here’s what teachers are teaching this month:";
      const list = document.createElement("ul");
      list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";

      // ✅ Create clickable search links
      data.topics.forEach(topic => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `https://www.google.com/search?q=${encodeURIComponent(topic + " lesson plan")}`;
        a.textContent = topic;
        a.target = "_blank";
        a.className = "text-blue-600 hover:underline";
        li.appendChild(a);
        list.appendChild(li);
      });

      aiText.insertAdjacentElement("afterend", list);
    } catch (err) {
      aiText.textContent = "Hmm, couldn’t fetch current trends.";
      console.error(err);
    }
  }

  else if (mode === "articles") {
    aiText.textContent = "Searching for articles...";
    try {
      const topic = aiText.textContent.match(/about (.*?)\./)?.[1] || "";
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
      aiText.textContent = "Sorry, couldn’t load articles right now.";
      console.error(err);
    }
  }
});

//close the ai
// --- Close Agentic AI Helper when ✕ is clicked ---
document.addEventListener("DOMContentLoaded", () => {
  const aiHelper = document.getElementById("agentic-ai-helper");
  const closeBtn = document.getElementById("ai-close-btn");

  if (closeBtn && aiHelper) {
    closeBtn.addEventListener("click", () => {
      aiHelper.classList.remove("show");
      aiHelper.classList.add("hide"); // fade out smoothly
    });
  }
});

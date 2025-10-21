// Select all step elements (each representing part of the multi-step builder)
const steps = document.querySelectorAll(".step");
let currentStep = 0; //current step defined

const widaBtn = document.getElementById("wida-btn");


function restartApp() {
  location.reload(); // simplest restart — full reset
}

//this is probably the most important function
function nextStep(index) {
  // Clear dynamic content if not the first step
  if (index !== 0) clearDynamicPanel();

  // Always hide example hints when changing steps
  document.getElementById("who-example").classList.add("hidden");
  document.getElementById("goal-example").classList.add("hidden");

  // Update visual step indicators
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed", "disabled");
    //these classes are in my css

    if (i < index) {
      step.classList.add("completed");
    } else if (i === index) {
      step.classList.add("active");
    } else {
      step.classList.add("disabled");
    }
  });

  if (steps[index + 1]) {
    steps[index + 1].classList.remove("disabled");
  }

  // Step logic
  if (index === 0) {
    // Step 0: WHO
    document.getElementById("sidebar-section").classList.add("hidden");
    document.getElementById("full-panel").classList.remove("hidden");
    showWhoInput("full-panel");

    const aiHelper = document.getElementById("agentic-ai-helper");
    const aiText = aiHelper.querySelector("p"); // Get the <p> tag inside the AI helper where the text message will appear
    const aiButton = document.getElementById("agentic-ai-button"); //getting the id from html
    aiHelper.classList.remove("hide"); //unhiding itself--using css class it was hidden before
    aiButton.dataset.mode = "intro"; // Set the button’s current mode to "intro" (this tells other code which behavior to run
    aiButton.dataset.topic = ""; // Clear any previous topic — start fresh with an empty string--ready to start

    aiText.textContent = // Set the AI helper’s welcome text (the first message the teacher sees)
      "Hi! Can’t think of what to teach today? Let's see what teachers are teaching these days.";
    aiButton.textContent = "Let's Go!"; //message that comes while gathering--what the user clicks to start
    aiHelper.classList.add("show"); //show
  } else if (index === 1) {
    // Step 1: FUNCTION
    document.getElementById("full-panel").classList.add("hidden"); //this is a function I use to show panel--want it hidden going in
    updateSidebar("function"); //this is also a function i have below
  } else if (index === 2) {
    // Step 2: GOAL
    document.getElementById("sidebar-section").classList.add("hidden"); //now we are removing
    document.getElementById("full-panel").classList.remove("hidden");//now we are adding
    showGoalInput("full-panel");   // Show the full panel again for typing the lesson goal
  } else if (index >= 3 && index <= 5) {   // Hide the full panel again for sidebar-only steps
    // Steps 3–5: DOMAIN / FORMS / SUPPORTS
    document.getElementById("full-panel").classList.add("hidden");
    updateSidebar(["domain", "forms", "supports"][index - 3]);
  } else if (index === 6) {
    // Step 6: FINISHED LO -- Hide the full panel and navigation buttons (we're done!)
    document.getElementById("full-panel").classList.add("hidden");
    document.getElementById("next-button").classList.add("hidden");
    document.getElementById("back-button").classList.add("hidden");
    const stepNav = document.getElementById("step-nav");
    if (stepNav) stepNav.style.display = "none";

    const bottomBar = document.getElementById("bottom-actions");
    bottomBar.classList.add("show"); //this is a section that shows when it's full panel

    //In browser JavaScript, window is a special global object that represents the browser window or tab itself.
    const lessonTopic = sessionStorage.getItem("final_topic") || window.finalTopic || null; //not finalTopic is coming from agentic AI
    //Try to get the final topic from sessionStorage. If it’s not there, try to use window.finalTopic (a variable stored globally). If that’s also missing, set it to null.
    const widaBtn = document.getElementById("wida-btn");

// If the WIDA button exists, add a click event to it

if (widaBtn) {
  widaBtn.addEventListener("click", (e) => { // Stop the button’s default link behavior
    e.preventDefault();     // Get the current text of the finished objective from the preview box


    const preview = document.getElementById("objective-preview");
    const rawObjective = preview ? preview.innerText.trim() : "";

    // Clean up the text:
    // - remove "will be able to"
    // - remove punctuation (periods, commas)
    // - remove extra spaces
    const stripped = rawObjective
      .replace(/will be able to/gi, "")
      .replace(/[.,]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!stripped) {
      alert("No objective text found to prefill.");
      return;
    }

    // Just redirect — but include stripped objective as query param
    const prefillParam = encodeURIComponent(stripped);
    window.location.href = `/wida_resources?prefill=${prefillParam}`; //this redirects to my resource page with the query filled--search bar filled
  });
}

    const restartBtn = document.getElementById("restart-button");
    restartBtn.classList.remove("hidden");
    restartBtn.classList.add("show");

    const preview = document.getElementById("objective-preview");
    const objectiveText = preview.innerText.trim();

    fetch("/agentic_detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objective: objectiveText }),
    })
      .then((res) => res.json())
      .then((data) => {
        const aiHelper = document.getElementById("agentic-ai-helper");
        const aiText = aiHelper.querySelector("p");
        const aiButton = document.getElementById("agentic-ai-button");

         window.finalTopic = data.topic;
         aiButton.dataset.topic = data.topic;
         aiButton.dataset.mode = "articles";


        // Display short intro
        aiText.textContent = `Hey! Looks like your lesson is about ${data.topic}. Want some related articles?`;

        // Limit to 3 article topics only
        const limited = data.suggestions ? data.suggestions.slice(0, 3) : [];

        // Create a styled list
        const list = document.createElement("ul");
        list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";

        limited.forEach((s) => {
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
      .catch((err) => console.error("Agentic AI failed:", err));

    const copyBtn = document.getElementById("copy-button");
    copyBtn.classList.add("show");

    const agenticAI = document.getElementById("agentic-ai-helper");
    agenticAI.classList.add("show");

    preview.classList.add("fullscreen-preview", "fade-in");

    // Optional: clear the rest of the UI--to emphasize final obj
    document.querySelector("header").style.display = "none";
    document.querySelector("nav").style.display = "none";
    document.getElementById("sidebar-section").classList.add("hidden");
    document.getElementById("full-panel").classList.add("hidden");
  } else {
    updateSidebar("none");
  }
}

// only once at startup
steps.forEach((step, i) => {
  step.addEventListener("click", (e) => {
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
  if (!canAdvanceFrom(currentStep)) { //current step was defined above--i need to tweak this but mostly works
    alert("Please complete this step before continuing.");
    return;
  }
  if (currentStep < steps.length - 1) { //if curent step is less than the length of total steps
    currentStep++;
    nextStep(currentStep);
  }
}

// move backward
function goBackward() { //backward--not allowed at start
  if (currentStep === 0) {
    alert("You're already at the first step.");
    return;
  }
  currentStep--;
  nextStep(currentStep);
}

// initial call
nextStep(currentStep);

// can advance functionality
//It looks at the DOM elements (like <span id="function">[function]</span>) and sees whether the placeholder text ("[function]") has been replaced by something real.

//If the text is still "[function]", that means the user hasn’t selected or entered anything yet, so it returns false → and your app blocks moving forward.

function canAdvanceFrom(step) { //these are checks to make sure we really can advance--interacting with the dom to see if these things exist
  switch (step) {
    case 1:
      return document.getElementById("function").textContent !== "[function]";
    case 3:
      return document.getElementById("domain").textContent !== "[domain]";
    case 4:
      return (
        document.getElementById("forms").textContent !== "[forms/features]"
      );
    case 5:
      return document.getElementById("supports").textContent !== "[supports]";
    default:
      return true;
  }
}

// Get the AI helper button and its text paragraph
const aiButton = document.getElementById("agentic-ai-button");
const aiText = document.querySelector("#agentic-ai-helper p");

// Replace the old button with a fresh clone to remove any previous event listeners.
// (This prevents duplicate clicks or multiple fetch requests if nextStep() was called again.)
aiButton.replaceWith(aiButton.cloneNode(true));
// Get the new version of the same button after cloning
//creates an identical copy of the button and replaces the old one in the document.
const newAiButton = document.getElementById("agentic-ai-button");

// If we already know the final topic (from AI detection), store it in the button’s data attributes
if (window.finalTopic) {
  newAiButton.dataset.topic = window.finalTopic;
}
// Set the button mode — use the previous mode if it exists, otherwise default to "intro"

newAiButton.dataset.mode = aiButton.dataset.mode || "intro";

newAiButton.addEventListener("click", async () => {
  // Check which mode we’re in: "intro" (show trending topics) or "articles" (show related resources)

  const mode = newAiButton.dataset.mode;

  // Remove any old <ul> list of topics or articles if it’s still on screen

  const oldList = aiText.nextElementSibling;
  if (oldList && oldList.tagName === "UL") oldList.remove();

  if (mode === "intro") {
  //show a UI msg while waiting
    aiText.textContent = "Let’s see what teachers are teaching this month...";
    try {
      // Ask the backend for current trending topics (AI-generated)
      const res = await fetch("/agentic_intro");
      const data = await res.json();
      // Update text and display a list of clickable Google searches for each topic
      aiText.textContent = "Here’s what teachers are teaching this month:";
      const list = document.createElement("ul");
      list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";
       // For each topic returned, create a clickable link to Google search
      data.topics.forEach((topic) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `https://www.google.com/search?q=${encodeURIComponent(
          topic + " lesson plan" //literally making the URL
        )}`;
        a.textContent = topic;
        a.target = "_blank";
        a.className = "text-blue-600 hover:underline";
        li.appendChild(a);
        list.appendChild(li);
      });  //appendChild() means “put this element inside another element as its child.”
           //So li.appendChild(a); puts the <a> link inside the <li> list item.

      aiText.insertAdjacentElement("afterend", list);
    } catch (err) {
      aiText.textContent = "Hmm, couldn’t fetch current trends.";
      console.error(err);
    }
  } else if (mode === "articles") {
    aiText.textContent = "Searching for articles...";
    try {
      const topic = newAiButton.dataset.topic || "";
      const res = await fetch("/find_articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();

      aiText.textContent = "Here are some ideas:";
      const list = document.createElement("ul");
      list.className = "mt-2 list-disc ml-6 text-sm text-gray-700";

      data.articles.forEach((article) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = article.url;
        a.textContent = article.title;
        a.target = "_blank";  // open in a new browser tab
        a.className = "text-blue-600 hover:underline";
        li.appendChild(a);
        list.appendChild(li);
      });
      // Add the list right below the AI helper text
      aiText.insertAdjacentElement("afterend", list);
    } catch (err) {
      aiText.textContent = "Sorry, couldn’t load articles right now.";
      console.error(err);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const aiHelper = document.getElementById("agentic-ai-helper");
  const closeBtn = document.getElementById("ai-close-btn");

  if (closeBtn && aiHelper) {
    closeBtn.addEventListener("click", () => {
      aiHelper.classList.remove("show");
      aiHelper.classList.add("hide");
    });
  }
});

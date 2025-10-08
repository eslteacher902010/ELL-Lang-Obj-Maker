//show who

function showWhoInput(targetId = "dynamic-panel")  {
  const panel = document.getElementById(targetId);

  // Prevent duplicates
  if (panel.querySelector("#who-input")) return;
  panel.innerHTML = `
    <div class="flex flex-col space-y-2">
      <div class="flex items-center space-x-2">
        <input
          type="text"
          id="who-input"
          placeholder="Type who here..."
          class="w-full px-3 py-2 border rounded-md"
          oninput="updateField('who', this.value); fetchSuggestions(this.value, 'who-suggestions', 'who')"
        />
        <span
          title="WIDA Levels:
1 – Entering
2 – Emerging
3 – Developing
4 – Expanding
5 – Bridging
6 – Reaching"
          style="cursor: help; font-size: 1.2em;"
        >&#9432;</span>
      </div>

      <div class="suggestions-container relative">
        <ul id="who-suggestions" class="suggestions-list absolute z-50 bg-white border border-gray-300 shadow-lg w-full"></ul>
      </div>
    </div>
  `;

    document.getElementById("who-example").classList.remove("hidden");
}

//show verb
function showCustomVerbInput() {
  document.getElementById("customVerbContainer").style.display = "block";
}
function useCustomVerb() {
  const verb = document.getElementById("customVerb").value.trim();
  if (verb) {
    document.getElementById("function").textContent = verb;
    document.getElementById("customVerbContainer").style.display = "none";
    document.getElementById("customVerb").value = "";
  }
}


//<!-- Show function verbs -->

function showContent(type) {
  const panel = document.getElementById("dynamic-panel");
  let verbs = [];
  switch (type) {
    case "narrate": verbs = ["RELATE", "RECALL", "DESCRIBE", "LIST", "ARRANGE", "NARRATE"]; break;
    case "inform":  verbs = ["DEFINE", "IDENTIFY", "LABEL", "LIST", "NAME", "RECOGNIZE", "MATCH", "DUPLICATE", "INFORM"]; break;
    case "explain": verbs = ["CLASSIFY", "CONTRAST", "ILLUSTRATE", "EXPLAIN"]; break;
    case "argue":   verbs = ["PERSUADE", "JUSTIFY", "DEFEND", "PROVE", "ARGUE"]; break;
    default:        verbs = ["No details available."];
  }

  panel.innerHTML = `
    <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
      ${verbs.map(v => `
        <button class="bg-blue-200 px-5 py-5 rounded text-center uppercase hover:bg-blue-300"
                onclick="setValue('function','${v.toLowerCase()}');">
          ${v}
        </button>
      `).join("")}
    </div>

    <div class="mt-6  pt-4">
      <label for="customVerb" class="block text-sm font-medium mb-1">Add your own verb:</label>
      <input id="customVerb"
             type="text"
             placeholder="Enter your verb/function"
             class="w-full border rounded p-2"
             oninput="updateField('function', this.value); fetchSuggestions(this.value, 'function-suggestions', 'function')">
      <button class="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              onclick="useCustomVerb()">Use</button>
      <ul id="function-suggestions" class="suggestions-list mt-2"></ul>
    </div>
  `;
}

//show goal
function showGoalInput(targetId = "dynamic-panel") {
  document.getElementById("who-example").classList.add("hidden");
  const panel = document.getElementById(targetId);
  panel.innerHTML = `
    <div class="flex flex-col space-y-2">
      <div class="flex items-center space-x-2">
        <input
          type="text"
          id="goal-input"
          placeholder="the pros and cons of ...."
          class="w-full px-3 py-2 border rounded-md"
          oninput="updateField('goal', this.value); fetchSuggestions(this.value, 'goal-suggestions','goal')"
        />
        </div>
      <div class="suggestions-container relative">
        <ul id="goal-suggestions" class="suggestions-list absolute z-50 bg-white border border-gray-300 shadow-lg w-full"></ul>
      </div>
    </div>
  `;
   document.getElementById("goal-example").classList.remove("hidden");
}


//show domains
function showDomain(type) {
  const panel = document.getElementById("dynamic-panel");
  let domain = [];

  switch (type) {
    case "interpretive":
      domain = ["LISTENING", "READING"];
      break;
    case "expressive":
      domain = ["WRITING", "SPEAKING"];
      break;
    default:
      domain = ["No details available."];
  }

  // 🧱 1. Build structure if not already present
  if (!panel.querySelector("#domain-grid")) {
    panel.innerHTML = `
      <div id="domain-grid" class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6"></div>

      <div id="custom-domain-area" class="border-t mt-6 pt-4">
        <label for="custom-domain" class="block text-sm font-medium mb-1">Add your own domain:</label>
        <div class="flex space-x-2">
          <input id="custom-domain"
                 type="text"
                 placeholder="Enter custom domain"
                 class="flex-1 border rounded p-2"
                 oninput="updateField('domain', this.value); fetchSuggestions(this.value, 'domain-suggestions','domain')" />
          <button id="use-domain-btn"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onclick="useCustomDomain()">Use</button>
        </div>
        <ul id="domain-suggestions" class="suggestions-list mt-2"></ul>
      </div>
    `;
  }

  // 🧱 2. Just update the grid part
  const grid = panel.querySelector("#domain-grid");
  grid.innerHTML = domain
    .map(
      (d) => `
        <button
          class="bg-blue-200 px-5 py-5 rounded text-center uppercase hover:bg-blue-300 mr-2 mb-5 truncate hover:bg-[#d7e4ea]"
          onclick="setValue('domain','${d.toLowerCase()}')">
          ${d}
        </button>
      `
    )
    .join("");
}



//show forms
function showForms(type) {
  const panel = document.getElementById("dynamic-panel");
  let forms = [];
  switch (type) {
    case "structure": forms = ["CONCLUDING SENTENCE", "TOPIC SENTENCE(S)"]; break;
    case "grammar": forms = ["MODALS", "NOUNS", "PRONOUNS", "VERBS"]; break;
    case "descriptive-language": forms = ["ADJECTIVES", "FIGURATIVE LANGUAGE"]; break;
    case "transitions": forms = ["CAUSE AND EFFECT", "TRANSITIONS", "SEQUENCING"]; break;
    case "adverbs": forms = ["ADVERBS OF MANNER", "ADVERBS OF TIME"]; break;
    default: forms = ["No details available."];
  }

  panel.innerHTML = `
    <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
      ${forms.map(f => `
        <button
          class="bg-blue-200 px-5 py-5 rounded text-center uppercase hover:bg-blue-300
                 text-center uppercase mr-2 mb-5 truncate rounded-md hover:bg-[#d7e4ea]"
          onclick="setValue('forms','${f.toLowerCase()}')">
          ${f}
        </button>
      `).join("")}
    </div>

    <div class="mt-6  pt-4">
      <label for="custom-forms" class="block text-sm font-medium mb-1">Add your own:</label>
      <input id="custom-forms"
             type="text"
             placeholder="Enter custom form"
             class="w-full border rounded p-2"
             oninput="updateField('forms', this.value); fetchSuggestions(this.value, 'forms-suggestions','forms')" />
      <ul id="forms-suggestions" class="suggestions-list mt-2"></ul>
    </div>
  `;
}


//show supports
function showSupports(type) {
  const panel = document.getElementById("dynamic-panel");
  let supports = [];
  switch (type) {
    case "sensory-supports": supports = ["REALIA", "MANIPULATIVES"]; break;
    case "graphic-supports": supports = ["CHARTS", "T-CHARTS", "GRAPHIC ORGANIZERS", "TIMELINES"]; break;
    case "interactive-supports": supports = ["PARTNER WORK", "SMALL GROUP WORK"]; break;
    default: supports = ["No details available."];
  }

  panel.innerHTML = `
    <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
      ${supports.map(s => `
        <button class="bg-blue-200 px-5 py-5 rounded text-center uppercase hover:bg-blue-300
                        text-center uppercase mr-2 mb-5 truncate rounded-md hover:bg-[#d7e4ea]"
                onclick="setValue('supports','${s.toLowerCase()}')">
          ${s}
        </button>
      `).join("")}
    </div>

    <div class="mt-6 pt-4">
      <label for="custom-supports" class="block text-sm font-medium mb-1">Add your own:</label>
      <input id="custom-supports"
             type="text"
             placeholder="Enter custom support"
             class="w-full border rounded p-2"
             oninput="updateField('supports', this.value); fetchSuggestions(this.value, 'supports-suggestions','supports')" />
      <ul id="supports-suggestions" class="suggestions-list mt-2"></ul>
    </div>
  `;
}

//custom shows???

//<!-- Custom domain -->
function showCustomDomainInput() {
  document.getElementById("customDomainContainer").style.display = "block";
}
function useCustomDomain() {
  const domain = document.getElementById("customDomain").value.trim();
  if (domain) {
    document.getElementById("domain").textContent = domain;
    document.getElementById("customDomainContainer").style.display = "none";
    document.getElementById("customDomain").value = "";
  }
}

//<!-- Custom forms -->
function showCustomFormsInput() {
  document.getElementById("customFormsContainer").style.display = "block";
}
function useCustomForms() {
  const forms = document.getElementById("customForms").value.trim();
  if (forms) {
    document.getElementById("forms").textContent = forms;
    document.getElementById("customFormsContainer").style.display = "none";
    document.getElementById("customForms").value = "";
  }
}


//show customs support
function showCustomSupportsInput() {
  document.getElementById("customSupportsContainer").style.display = "block";
}
function useCustomSupports() {
  const supports = document.getElementById("customSupports").value.trim();
  if (supports) {
    document.getElementById("supports").textContent = supports;
    document.getElementById("customSupportsContainer").style.display = "none";
    document.getElementById("customSupports").value = "";
  }
}




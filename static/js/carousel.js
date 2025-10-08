//examples carousel
const examples = {
who: [
  "7th grade newcomers",
  "Level 2 WIDA speakers",
  "High school ESL students at the Emerging level",
  "Entering, grade 1 students"
],

  goal: [
    "an apartment brochure",
    "a short story",
    "the process of building a rocketship"
  ]
  };

const currentIndex= {who: 0, goal:0};

function updateExample(container) {
  const  type= container.dataset.type;
  const textEl = container.querySelector(".example-text");
  textEl.textContent= examples[type][currentIndex[type]];
}

 function prevExample(btn) {
    const container = btn.closest(".example-carousel");
    const type = container.dataset.type;
    currentIndex[type] = (currentIndex[type] - 1 + examples[type].length) % examples[type].length;
    updateExample(container);
  }

  function nextExample(btn) {
    const container = btn.closest(".example-carousel");
    const type = container.dataset.type;
    currentIndex[type] = (currentIndex[type] + 1) % examples[type].length;
    updateExample(container);
  }

  document.querySelectorAll(".example-carousel").forEach(c => updateExample(c));



document.querySelectorAll('.example-carousel').forEach(carousel => {
  const type = carousel.dataset.type; // e.g. "who", "goal"
  const textEl = carousel.querySelector('.example-text');

  textEl.addEventListener('click', () => {
    const currentValue = textEl.textContent.trim();
    const targetSpan = document.getElementById(type);

    if (targetSpan) targetSpan.textContent = currentValue;

<!--    // 🧹 Hide the example box once clicked-->
<!--    carousel.parentElement.classList.add('hidden');-->

<!--    // ✨ Quick yellow flash for confirmation-->
<!--    targetSpan.classList.add('bg-yellow-200');-->
<!--    setTimeout(() => targetSpan.classList.remove('bg-yellow-200'), 400);-->

<!--    // 🔜 Automatically advance to next step (optional)-->
<!--    if (typeof goForward === 'function') goForward();-->
  });
});

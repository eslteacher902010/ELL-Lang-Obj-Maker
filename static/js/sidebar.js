  function updateSidebar(step) {
  const sidebarSection = document.getElementById('sidebar-section'); // wrapper
  const sidebar = document.getElementById('sidebar-content');        // inner content

  const sidebarTitle = document.getElementById('sidebar-title');


  // Steps that actually need the sidebar
  const sidebarSteps = ['function', 'domain', 'forms', 'supports'];


  if (sidebarSteps.includes(step)) {
    sidebarSection.classList.remove('hidden'); // show
  } else {
    sidebarSection.classList.add('hidden');    // hide
    sidebar.innerHTML = "";                    // clear
    return;                                    // stop
  }

  switch (step) {
    case 'function':
     sidebarTitle.textContent = 'Choose a Function';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <li><button onclick="showContent('narrate')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Narrating</button></li>
          <li><button onclick="showContent('inform')"  class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Informing</button></li>
          <li><button onclick="showContent('explain')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Explaining</button></li>
          <li><button onclick="showContent('argue')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Arguing</button></li>
        </ul>
      `;
      break;

    case 'domain':
    sidebarTitle.textContent = 'Choose a domain';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <li><button onclick="showDomain('interpretive')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Interpretive</button></li>
          <li><button onclick="showDomain('expressive')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Expressive</button></li>
        </ul>
      `;
      break;

      case 'forms':
      sidebarTitle.textContent = 'Choose a form';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <li><button onclick="showForms('structure')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Structure</button></li>
          <li><button onclick="showForms('descriptive-language')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Descriptive Language</button></li>
          <li><button onclick="showForms('transitions')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Transitions</button></li>
          <li><button onclick="showForms('adverbs')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">adverbs</button></li>
        </ul>
  `;
    break;

    case 'supports':
    sidebarTitle.textContent = 'Choose a support';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <li><button onclick="showSupports('sensory-supports')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">sensory-supports</button></li>
          <li><button onclick="showSupports('graphic-supports')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">graphic-supports</button></li>
          <li><button onclick="showSupports('interactive-supports')"  class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">interactive-supports</button></li>
        </ul>
      `;
      break;

    default:
      sidebar.innerHTML = `<p class="text-gray-500 p-4">Start Here</p>`;
  }
}


///toggling sidebar
function toggleSidebar() {
  document.getElementById('sidebar-section').classList.toggle('hidden');
}


///hiding sidebar
function hideSidebar() {
  document.getElementById('sidebar-section').classList.add('hidden');
}

function updateField(fieldId, value) {
  const span = document.getElementById(fieldId);
  if (span) span.textContent = value || `[${fieldId}]`;
}

function setValue(fieldId, value) {
  const span = document.getElementById(fieldId);
  if (span) {
    if (fieldId === "domain") {
  span.textContent = value;
} else {
  span.textContent = value;
}
  }
}


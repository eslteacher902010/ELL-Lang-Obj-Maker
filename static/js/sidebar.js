function updateSidebar(step) {
  const sidebarSection = document.getElementById('sidebar-section'); // Sidebar wrapper element
  const sidebar = document.getElementById('sidebar-content');        // Container for dynamic sidebar content
  const sidebarTitle = document.getElementById('sidebar-title');     // Sidebar heading element

  // Steps that require sidebar visibility
  const sidebarSteps = ['function', 'domain', 'forms', 'supports'];

  // Show or hide sidebar based on current step
  if (sidebarSteps.includes(step)) {
    sidebarSection.classList.remove('hidden'); // Reveal sidebar
  } else {
    sidebarSection.classList.add('hidden');    // Hide sidebar
    sidebar.innerHTML = "";                    // Clear content
    return;                                    // Exit early if no sidebar content needed
  }

  // Populate sidebar content dynamically based on current step
  switch (step) {
    case 'function':
      sidebarTitle.textContent = 'Choose a Function';
      sidebar.innerHTML = `
        <!-- Use backticks for multiline HTML template -->
        <ul class="space-y-4">
          <!-- Each button triggers a different content section -->
          <li><button onclick="showContent('narrate')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Narrating</button></li>
          <li><button onclick="showContent('inform')"  class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Informing</button></li>
          <li><button onclick="showContent('explain')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Explaining</button></li>
          <li><button onclick="showContent('argue')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Arguing</button></li>
        </ul>
      `;
      break;

    case 'domain':
      sidebarTitle.textContent = 'Choose a Domain';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <!-- Tailwind classes provide hover and spacing styles -->
          <li><button onclick="showDomain('interpretive')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Interpretive</button></li>
          <li><button onclick="showDomain('expressive')"   class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Expressive</button></li>
        </ul>
      `;
      break;

    case 'forms':
      sidebarTitle.textContent = 'Choose a Form';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <li><button onclick="showForms('structure')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Structure</button></li>
          <li><button onclick="showForms('descriptive-language')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Descriptive Language</button></li>
          <li><button onclick="showForms('transitions')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Transitions</button></li>
          <li><button onclick="showForms('adverbs')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Adverbs</button></li>
        </ul>
      `;
      break;

    case 'supports':
      sidebarTitle.textContent = 'Choose a Support';
      sidebar.innerHTML = `
        <ul class="space-y-4">
          <li><button onclick="showSupports('sensory-supports')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Sensory Supports</button></li>
          <li><button onclick="showSupports('graphic-supports')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Graphic Supports</button></li>
          <li><button onclick="showSupports('interactive-supports')" class="category-btn w-full text-left px-4 py-2 hover:bg-gray-100">Interactive Supports</button></li>
        </ul>
      `;
      break;

    default:
      sidebar.innerHTML = `<p class="text-gray-500 p-4">Start Here</p>`;
  }
}

// Toggle sidebar visibility
function toggleSidebar() {
  document.getElementById('sidebar-section').classList.toggle('hidden');
}

// Hide sidebar (used when switching to steps that don’t need it)
function hideSidebar() {
  document.getElementById('sidebar-section').classList.add('hidden');
}

// Update displayed text for a given placeholder field
function updateField(fieldId, value) {
  const span = document.getElementById(fieldId);
  if (span) span.textContent = value || `[${fieldId}]`;
}

// Assign a specific value to a field; ready for customization if needed later
function setValue(fieldId, value) {
  const span = document.getElementById(fieldId);
  if (span) span.textContent = value;
}

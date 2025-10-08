
///clearing the panel
function clearDynamicPanel() {
  const panel = document.getElementById("dynamic-panel");
  if (panel) panel.innerHTML = "";

  // Close all suggestion dropdowns
  document.querySelectorAll(".suggestions-list").forEach(list => {
    list.innerHTML = "";
    list.style.display = "none";
  });
}

///clearing the panel
function clearDynamicPanel() {
  const panel = document.getElementById("dynamic-panel");
  if (panel) {
    panel.innerHTML = `
      <div style="
        text-align:center;
        margin-top:3rem;
        color:#6b7280;
        font-style:italic;
        font-size:1rem;
      ">
        Click on a word on the left
      </div>
    `;
  }

  // And just hide/clear any open suggestion lists
  document.querySelectorAll(".suggestions-list").forEach(list => {
    list.innerHTML = "";
    list.style.display = "none";
  });
}

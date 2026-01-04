const toggle = document.getElementById('toggle');

// Load current state
chrome.storage.sync.get(['enabled'], result => {
  toggle.checked = result.enabled !== false; // Default to enabled
});

// Save state when toggled
toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

// ====== Dynamic Quote Generator ======

// Quotes array
let quotes = [];

// Load quotes from localStorage or use default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "Life is short.", category: "Life" },
      { text: "Code is poetry.", category: "Programming" }
    ];
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const filter = localStorage.getItem("categoryFilter") || "all";
  const filtered = filter === "all" ? quotes : quotes.filter(q => q.category === filter);
  if (filtered.length === 0) return;
  const rand = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").textContent = `"${rand.text}" — ${rand.category}`;
  sessionStorage.setItem("lastViewedQuote", rand.text);
}

// Populate category filter
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>' +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  const saved = localStorage.getItem("categoryFilter");
  if (saved) select.value = saved;
}

// Filter quotes
function filterQuotes() {
  const value = document.getElementById("categoryFilter").value;
  localStorage.setItem("categoryFilter", value);
  showRandomQuote();
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !cat) return alert("Please enter both quote and category.");
  quotes.push({ text, category: cat });
  saveQuotes();
  populateCategories();
  showRandomQuote();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Create add quote form
function createAddQuoteForm() {
  const container = document.createElement("div");
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(container);
}

// Export to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error();
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== Sync with Fake Server ======

function fetchQuotesFromServer() {
  return new Promise(resolve => {
    const simulatedServerQuotes = [
      { text: "This is from the server.", category: "Server" }
    ];
    setTimeout(() => resolve(simulatedServerQuotes), 1000);
  });
}

function syncWithServer() {
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;
    serverQuotes.forEach(sq => {
      const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
      if (!exists) {
        quotes.push(sq);
        updated = true;
      }
    });
    if (updated) {
      saveQuotes();
      populateCategories();
      notifyUser("Quotes synced from server.");
    }
  });
}

function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.backgroundColor = "#ffeeba";
  note.style.padding = "10px";
  note.style.border = "1px solid #f0ad4e";
  note.style.margin = "10px 0";
  document.body.prepend(note);
  setTimeout(() => note.remove(), 5000);
}

// ====== Initialization ======

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  // Sync with server every 10 seconds
  setInterval(syncWithServer, 10000);
});

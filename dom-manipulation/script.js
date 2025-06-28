let quotes = [];

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch {
      quotes = [];
    }
  } else {
    quotes = [
      { text: "Stay hungry, stay foolish.", category: "Motivation" },
      { text: "Talk is cheap. Show me the code.", category: "Tech" },
      { text: "The only limit is your mind.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save last quote in sessionStorage
function storeLastQuote(q) {
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

// Show random quote
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  if (quotes.length === 0) {
    display.textContent = "No quotes available.";
    return;
  }

  const random = quotes[Math.floor(Math.random() * quotes.length)];
  const p = document.createElement("p");
  const small = document.createElement("small");

  p.textContent = `"${random.text}"`;
  small.textContent = `— ${random.category}`;

  display.appendChild(p);
  display.appendChild(small);

  storeLastQuote(random);
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Create quote form
function createAddQuoteForm() {
  const container = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(button);

  document.body.appendChild(document.createElement("hr"));
  document.body.appendChild(container);
}

// Export quotes to JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error parsing JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      const q = JSON.parse(last);
      const display = document.getElementById("quoteDisplay");
      display.innerHTML = `<p>"${q.text}"</p><small>— ${q.category}</small>`;
    } catch {}
  }
});

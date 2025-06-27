 const quotes = [
      { text: "Stay hungry, stay foolish.", category: "Motivation" },
      { text: "Talk is cheap. Show me the code.", category: "Tech" },
      { text: "The only limit is your mind.", category: "Inspiration" }
    ];
    
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
    }

    function addQuote() {
      const text = document.getElementById("newQuoteText").value.trim();
      const category = document.getElementById("newQuoteCategory").value.trim();

      if (!text || !category) {
        alert("Both quote and category are required.");
        return;
      }

      quotes.push({ text, category });

      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";

      showRandomQuote();
    }

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

    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm();
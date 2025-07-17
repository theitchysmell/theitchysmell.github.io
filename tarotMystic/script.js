let tarotDeck = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("tarotDeck.json")
      .then(res => res.json())
      .then(data => {
        tarotDeck = data;
      })
      .catch(err => {
        console.error("Error loading tarot deck:", err);
        alert("⚠️ Tarot deck could not be loaded. Are you using Live Server?");
      });

  const form = document.getElementById("tarot-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const question = document.getElementById("question").value.trim();
  const cardCountInput = document.querySelector('input[name="card-count"]:checked');
  const savePref = document.getElementById("focus").value;

  if (!name || !question || !cardCountInput) {
    alert("⚠️ Please complete all form fields.");
    return;
  }

  const cardCount = parseInt(cardCountInput.value);
  const drawnCards = drawCards(cardCount);
  displayReading(name, question, savePref, drawnCards);
}

function drawCards(count) {
  const deckCopy = [...tarotDeck];
  const selected = [];

  while (selected.length < count && deckCopy.length > 0) {
    const index = Math.floor(Math.random() * deckCopy.length);
    const card = deckCopy.splice(index, 1)[0];
    card.orientation = Math.random() > 0.5 ? "upright" : "reversed";
    selected.push(card);
  }

  return selected;
}

function displayReading(name, question, savePref, cards) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  const header = document.createElement("h3");
  header.textContent = `Reading for ${name}`;
  resultContainer.appendChild(header);

  const questionEl = document.createElement("p");
  questionEl.textContent = `Question: ${question}`;
  resultContainer.appendChild(questionEl);

  const cardGrid = document.createElement("div");
  cardGrid.classList.add("cards-container");
  resultContainer.appendChild(cardGrid);

  const positions = ["Past", "Present", "Future", "Card 4", "Card 5"];
  let cardsFlipped = 0; // ✅ Correct scope

  cards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("result-card");

    const role = document.createElement("h4");
    role.textContent = positions[index];
    role.classList.add("card-role-title");
    cardEl.appendChild(role);

    const img = document.createElement("img");
    img.src = "images/card_back.jpg";
    img.alt = card.name;
    img.classList.add("card-image");

    let flipped = false;

    img.addEventListener("click", () => {
      if (flipped) return;
      flipped = true;

      img.classList.add("flipped-image");

      setTimeout(() => {
        img.src = card.imageUrl;
        if (card.orientation === "reversed") {
          img.classList.add("reversed");
        }
      }, 300);

      cardsFlipped++;
      console.log(`Card flipped (${cardsFlipped}/${cards.length})`);

      if (cardsFlipped === cards.length) {
        console.log("🎉 All cards flipped. Showing summary...");
        showSummary(cards);
      }
    });

    const cardText = document.createElement("div");
    cardText.classList.add("card-text-block");
    cardText.innerHTML = `
      <p><strong>${card.cardName}</strong> (${card.orientation})</p>
      <p><em>${card.orientation === "reversed" ? card.reversedMeaning : card.uprightMeaning}</em></p>
      <p><strong>Keywords:</strong> ${card.cardKeywords}</p>
    `;

    cardEl.appendChild(img);
    cardEl.appendChild(cardText);
    cardGrid.appendChild(cardEl);
  });

  if (savePref === "Yes") {
    const note = document.createElement("p");
    note.textContent = "📝 You chose to save this reading.";
    note.classList.add("note");
    resultContainer.appendChild(note);
  }
}


function showSummary(cards) {
  const resultContainer = document.getElementById("result");
  const summary = document.createElement("div");
  summary.classList.add("summary-paragraphs");

  const title = document.createElement("h3");
  title.textContent = "🔮 Mystic's Interpretation Summary";
  summary.appendChild(title);

  const archetypes = new Set();
  const keywords = new Set();
  const elements = new Set();
  const astrology = new Set();
  const chakras = new Set();
  const affirmations = [];
  let upright = 0;
  let reversed = 0;

  cards.forEach(card => {
    if (card.orientation === "upright") upright++;
    else reversed++;

    archetypes.add(card.cardArchetype);

    // ✅ Safe keyword parsing
    if (Array.isArray(card.cardKeywords)) {
      card.cardKeywords.forEach(k => keywords.add(k.trim()));
    } else if (typeof card.cardKeywords === "string") {
      card.cardKeywords.split(",").forEach(k => keywords.add(k.trim()));
    }

    elements.add(card.cardElement);
    astrology.add(card.cardPlanet);
    chakras.add(card.cardChakra);
    affirmations.push(`"${card.cardAffirmation}"`);
  });


  const paragraph = document.createElement("p");
  paragraph.innerHTML = `
    Your reading reflects the combined archetypes of <em>${[...archetypes].join(", ")}</em>.<br><br>

    In this reading, <strong>${upright}</strong> card${upright !== 1 ? "s" : ""} appeared upright and 
    <strong>${reversed}</strong> ${reversed !== 1 ? "were" : "was"} reversed, suggesting a 
    ${upright > reversed ? "positive, action-oriented" : reversed > upright ? "reflective, inner-focused" : "balanced"} energy.<br><br>

    <strong>Key themes</strong> you may be experiencing include: 
    <em>${[...keywords].slice(0, 8).join(", ")}</em>.<br><br>

    These energies are associated with the <strong>elements</strong> of 
    <em>${[...elements].join(", ")}</em> and the <strong>astrological influences</strong> of 
    <em>${[...astrology].join(", ")}</em>, suggesting your journey is shaped by these universal forces.<br><br>

    On a spiritual level, this reading connects most with the 
    <strong>${[...chakras].join(", ")}</strong> chakra${chakras.size > 1 ? "s" : ""}, 
    inviting reflection and alignment within.<br><br>

    🌟 <strong>Affirmations drawn for you</strong>:<br>
    <em>${affirmations.join(" — ")}</em>
  `;
  summary.appendChild(paragraph);
  resultContainer.appendChild(summary);
}

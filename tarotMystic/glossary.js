let tarotCards = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("tarotDeck.json")
        .then(res => res.json())
        .then(data => {
            tarotCards = data;
            renderCards(tarotCards);
        })
        .catch(err => console.error("Error loading tarot deck:", err));

    document.getElementById("cardSearch").addEventListener("input", e => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = tarotCards.filter(card =>
            card.cardName.toLowerCase().includes(term)
        );
        renderCards(filtered);
    });


    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("modalOverlay").addEventListener("click", e => {
        if (e.target.id === "modalOverlay") closeModal();
    });
});

function renderCards(cards) {
    const grid = document.getElementById("cardGrid");
    grid.innerHTML = "";

    cards.forEach(card => {
        const thumb = document.createElement("img");
        thumb.src = card.imageUrl;
        thumb.alt = card.name;
        thumb.classList.add("card-thumb");
        thumb.addEventListener("click", () => showCardDetails(card));
        grid.appendChild(thumb);
    });
}

function showCardDetails(card) {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
    <h2>${card.cardNumber}</h2>
    <h2>${card.cardName}</h2>
    <img src="${card.imageUrl}" alt="${card.cardName}" class="modal-image" />
    <p><strong>Arcana:</strong> ${card.cardArcana}</p>
    <p><strong>Keywords:</strong> ${card.cardKeywords}</p>
    <p><strong>Upright Meaning:</strong> ${card.uprightMeaning}</p>
    <p><strong>Reversed Meaning:</strong> ${card.reversedMeaning}</p>
    <p><strong>Description:</strong> ${card.cardDescription}</p>
    <p><strong>Element:</strong> ${card.cardElement}</p>
    <p><strong>Astrology:</strong> ${card.cardPlanet}</p>
    <p><strong>Affirmation:</strong> "${card.cardAffirmation}"</p>
    <p><strong>Chakra:</strong> ${card.cardChakra}</p>
    <p><strong>Archetype:</strong> ${card.cardArchetype}</p>
    <p><strong>Symbolism:</strong> ${card.cardSymbols}</p>
  `;
    document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");
}

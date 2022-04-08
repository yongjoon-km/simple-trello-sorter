let sortButton = document.getElementById("sortTrelloCardsButton");

sortButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: sortTrelloCards,
  });
});

function sortTrelloCards() {
  const listCards = document.getElementsByClassName("list-cards");
  
  for (let listCard of listCards) {
    sortListCard(listCard);
  }

  function sortListCard(listCard) {
    if (listCard.children.length === 0) {
      return;
    }

    const cardMap = new Map();

    for (let card of listCard.children) {
      const avatar = card.getElementsByClassName('member-avatar')
      const memberIds = Object.keys(avatar).length ? avatar[0].alt : null
      cardMap.set(card, memberIds);
    }
    const sortedCard = [...cardMap.entries()].sort(comparator);
    listCard.replaceChildren(...sortedCard.map(x => x[0]));
  }

  function comparator(a, b) {
    if (a[1] === null) {
      return 1;
    }
    if (b[1] === null) {
      return -1;
    }

    return b[1].localeCompare(a[1]);
  }
}

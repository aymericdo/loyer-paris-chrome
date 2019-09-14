let priceElement = document.getElementById("price");
let currentPrice = priceElement.textContent

chrome.storage.sync.set({ currentPrice });

chrome.storage.sync.get('id', function (data) {
    fetch(`http://localhost:3000/yolo?id=${data.id}`)
        .then(response => response.json())
        .then((myJson) => {
            console.log(myJson)
        });

    price.textContent = currentPrice + " " + 'tamere' + data.id;
});

let price = document.getElementById('price');
let url = document.getElementById('url');

chrome.storage.sync.get('currentPrice', function (data) {
    price.textContent = data.currentPrice;
});

chrome.storage.sync.get('url', function (data) {
    url.textContent = data.url;
});

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    chrome.storage.sync.set({ url: tabs[0].url });
    chrome.storage.sync.set({ id: tabs[0].url.split('/')[8].split('.')[0] });
});

const price = document.getElementById('price');
const url = document.getElementById('url');

chrome.storage.sync.get('url', (data) => {
    url.textContent = data.url;
});

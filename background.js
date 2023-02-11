try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "activateIcon") {
      load();
    } else if (request.message === "redirectSettings") {
      chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    }
  });
} catch (err) {
  console.log(err);
}

function load() {
  try {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          if (tabs.length) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "urlHasChanged" });
          }
        });
      }
    });
  } catch (err) {
    console.log(err)
  }
}

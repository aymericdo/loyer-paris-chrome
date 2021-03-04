chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "activateIcon") {
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs.length) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "urlHasChanged" });
      }
    });
  }
});

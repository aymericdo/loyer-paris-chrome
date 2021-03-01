chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "activateIcon") {
    chrome.pageAction.show(sender.tab.id);
  } else if (request.message === "deactivateIcon") {
    chrome.pageAction.hide(sender.tab.id);
  }
});

chrome.tabs.onActivated.addListener((tabs, changeInfo, tab) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs.length) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "tabHasChanged" });
    }
  });
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

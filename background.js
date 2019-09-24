chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message === 'activateIcon') {
                chrome.pageAction.show(sender.tab.id);
            }
        });

        chrome.tabs.onActivated.addListener((tabs, changeInfo, tab) => {
            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { message: 'urlHasChanged' });
            });
        });
    }
});

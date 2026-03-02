chrome.runtime.onMessage.addListener((message, sender) => {

    if (!sender.tab?.id) return;

    chrome.action.setBadgeText({
        text: message.pageNumber || "",
        tabId: sender.tab.id
    });

    chrome.action.setBadgeBackgroundColor({
        color: "#000000",
        tabId: sender.tab.id
    });
});
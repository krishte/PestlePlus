function injectScript(tabId) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        var possible = false;
        for (let i = 0; i <= 10; i++)
        {
            if (url.includes("pestle-ib.firebaseapp.com/math_hl/topic/" + i.toString() + "/question") || url.includes("pestle-ib.firebaseapp.com/math/topic/" + i.toString() + "/question"))
            {
                possible = true;
                break;
            }
        }
        if (possible)
        {
            chrome.scripting.executeScript(
                {
                    target: {tabId: tabId},
                    files: ['javascript/questionpage.js', "javascript/jquery-3.3.1.js"],
                }
            );
        }
        else if (url.includes("pestle-ib.firebaseapp.com/math_hl/topic") || url.includes("pestle-ib.firebaseapp.com/math/topic"))
        {
            chrome.scripting.executeScript(
                {
                    target: {tabId: tabId},
                    files: ['javascript/topicpage.js', "javascript/jquery-3.3.1.js"],
                }
            );  
        }
        // use `url` here inside the callback because it's asynchronous!
    });


}

// adds a listener to tab change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url) {
        // calls the inject function

        injectScript(tabId);
    }
});


 chrome.action.onClicked.addListener(function(activeTab)
{
    var newURL = "https://pestle-ib.firebaseapp.com/";
    chrome.tabs.create({ url: newURL });
});


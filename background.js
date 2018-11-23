let id = 100
let nike_tab_id = null
let rta_tab_id = null

chrome.browserAction.onClicked.addListener(function() {
  let viewTabUrl = chrome.runtime.getURL('nike_dashboard.html?id=' + id++)
  let targetId = null

  // Waits for the tab status to be complete.
  chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
    if (tabId != targetId || changedProps.status != "complete")
      return;

    chrome.tabs.onUpdated.removeListener(listener);

    let views = chrome.extension.getViews();
    for (let i = 0; i < views.length; i++) {
      let view = views[i];
      if (view.location.href == viewTabUrl) {
        rta_tab_id = tabId
        break;
      }
    }
  })

  // Verifies if the current tab is Nike RTA dashboard
  // and run the script only if it is.
  chrome.tabs.query({active: true}, act => {
    if(!act[0].url.match("https://nike-gax.genesyscloud.com"))
      return;

      nike_tab_id = act.id
      chrome.tabs.executeScript(act.id, {
        file: "js/genesys_content.js"
      })

      // Creates new tab.
      chrome.tabs.create({
        active: false,
        url: viewTabUrl,
        index: act[0].index + 1
      }, tab => {
        targetId = tab.id
      })
    
  })
})


chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if(port.name == "nike_port") {
      chrome.tabs.query({currentWindow: true}, tabs => {
        for(let i = 0; i < tabs.length; i++) {
          tab = tabs[i]
          if(tab.url.match("nike_dashboard.html")) {
            chrome.tabs.sendMessage(tab.id, msg)
          }
        }
      })
    }
  })
})
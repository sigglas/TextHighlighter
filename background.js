chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addText",
    title: "加入追蹤",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "addAlert",
    title: "加入警告",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addText" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: openInputBox,
      });
    });
  }

  if (info.menuItemId === "addAlert" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: openInputAlertBox,
      });
    });
  }
});

// 接收來自網頁上下文的訊息，並處理數據儲存
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'saveData') {
    saveToFile(message.data);
    sendResponse({status: 'success'});
  }
});

function saveToFile(data) {
  chrome.storage.local.get("savedData", (result) => {
    const savedData = result.savedData || [];
    savedData.push(data);
    chrome.storage.local.set({ savedData: savedData }, () => {
      alert("內容已儲存！");
    });
  });
}

function openInputBox() {
  chrome.storage.local.get("selectedText", (data) => {
    const userInput = prompt("確認或編輯選取的內容：", data.selectedText);
    if (userInput !== null) {
      const jsonData = { selectedText: data.selectedText, userText: userInput };
      
      // 發送訊息到背景腳本，請求儲存數據
      chrome.runtime.sendMessage({ type: 'saveData', data: jsonData }, (response) => {
        if (response.status === 'success') {
          alert('內容已儲存！');
        }
      });
    }
  });
}

function openInputAlertBox() {
  chrome.storage.local.get("selectedText", (data) => {
    const userInput = prompt("確認或編輯選取的內容：", data.selectedText);
    if (userInput !== null) {
      const jsonData = { selectedText: data.selectedText, userText: userInput,alertEnabled:true };
      
      // 發送訊息到背景腳本，請求儲存數據
      chrome.runtime.sendMessage({ type: 'saveData', data: jsonData }, (response) => {
        if (response.status === 'success') {
          alert('內容已儲存！');
        }
      });
    }
  });
}
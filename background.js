// 創建右鍵選單
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addText",
    title: "加入追蹤",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "addAlert",
    title: "加入警告",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "sendUrlToAPI",
    title: "加入此網址",
    contexts: ["selection"],
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

  if (info.menuItemId === "sendUrlToAPI" && info.selectionText) {
    // 獲取目前頁面的網址
    const currentUrl = tab.url;

    //get apiUrl and apiToken from chrome.storage.local
    chrome.storage.local.get(["apiUrl", "apiToken"], (result) => {
      if (!result.apiUrl || !result.apiToken) {
        alert("請先設定 API URL 和 API Token！");
        return;
      }
      if (!currentUrl.startsWith("http")) {
        alert("請在網頁上使用此功能！");
        return;
      }    

      // 設置你的 API URL
      const apiUrl = result.apiUrl;

      // 發送 POST 請求
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${result.apiToken}`,
        },
        body: JSON.stringify({ songUrl: currentUrl, songName: info.selectionText }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          alert("發生錯誤，請查看控制台！");           
          console.error("Error:", error);
        });
    });
  }
});

// 接收來自網頁上下文的訊息，並處理數據儲存
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "saveData") {
    saveToFile(message.data);
    sendResponse({ status: "success" });
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
      chrome.runtime.sendMessage(
        { type: "saveData", data: jsonData },
        (response) => {
          if (response.status === "success") {
            alert("內容已儲存！");
          }
        }
      );
    }
  });
}

function openInputAlertBox() {
  chrome.storage.local.get("selectedText", (data) => {
    const userInput = prompt("確認或編輯選取的內容：", data.selectedText);
    if (userInput !== null) {
      const jsonData = {
        selectedText: data.selectedText,
        userText: userInput,
        alertEnabled: true,
      };

      // 發送訊息到背景腳本，請求儲存數據
      chrome.runtime.sendMessage(
        { type: "saveData", data: jsonData },
        (response) => {
          if (response.status === "success") {
            alert("內容已儲存！");
          }
        }
      );
    }
  });
}

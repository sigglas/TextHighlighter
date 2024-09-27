
//set two setting to chrome.storage.local , 1.apiUrl 2.apiToken
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('saveBtn').addEventListener('click', () => {
        const apiUrl = document.getElementById('apiUrlInput').value;
        const apiToken = document.getElementById('apiKeyInput').value;
        chrome.storage.local.set({ apiUrl, apiToken }, () => {
            alert('設定已儲存！');
        });
    });
    //get apiUrl and apiToken from chrome.storage.local
    chrome.storage.local.get(['apiUrl', 'apiToken'], (result) => {
        document.getElementById('apiUrlInput').value = result.apiUrl || '';
        document.getElementById('apiKeyInput').value = result.apiToken || '';
    });
});
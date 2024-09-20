chrome.storage.local.get("savedData", (result) => {
    const savedData = result.savedData || [];

    var textMessage='';
    savedData.forEach((entry) => {
        const regex = new RegExp(entry.selectedText, 'gi');
        const pageText = document.body.innerText;
        
        if (entry.alertEnabled && regex.test(pageText)) {
            textMessage=textMessage+'． '+entry.selectedText+'\n';
        }

        highlightText(document.body, regex, entry.highlightColor || 'yellow', entry.fontSizeMultiplier || 1);
    });
    if(textMessage!='' && textMessage!=null && textMessage!=undefined && textMessage.length>0){ 
        //alert(`頁面中出現了關鍵字: \n${textMessage}`);
        //alert改成加入一份窗口，有陰影效果之類的好看樣式，有關閉選項，且5秒後自動消失 
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.right = '20px';
        alertBox.style.padding = '15px';
        alertBox.style.backgroundColor = '#f8d7da';
        alertBox.style.color = '#721c24';
        alertBox.style.border = '1px solid #f5c6cb';
        alertBox.style.borderRadius = '5px';
        alertBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        alertBox.style.zIndex = '1000';
        alertBox.style.fontSize = '16px';
        alertBox.style.maxWidth = '300px';
        alertBox.style.wordWrap = 'break-word';
        alertBox.innerHTML = `
            <strong>關鍵字提示:</strong><br>
            ${textMessage.replace(/\n/g, '<br>')}
            <button style="margin-top: 10px; padding: 5px 10px; background-color: #721c24; color: #fff; border: none; border-radius: 3px; cursor: pointer;">關閉</button>
        `;

        document.body.appendChild(alertBox);

        const closeButton = alertBox.querySelector('button');
        closeButton.addEventListener('click', () => {
            alertBox.remove();
        });

        setTimeout(() => {
            alertBox.remove();
        }, 5000);

    }
});

function highlightText(element, regex, highlightColor, fontSizeMultiplier) {
    if (element.hasChildNodes()) {
        element.childNodes.forEach((child) => highlightText(child, regex, highlightColor, fontSizeMultiplier));
    } else if (element.nodeType === Text.TEXT_NODE) {
        const text = element.textContent;
        const replacedText = text.replace(regex, (match) => {
            return `<span style="background-color: ${highlightColor}; font-size: ${fontSizeMultiplier}em;">${match}</span>`;
        });

        if (replacedText !== text) {
            const wrapper = document.createElement("span");
            wrapper.innerHTML = replacedText;
            element.replaceWith(wrapper);
        }
    }
}

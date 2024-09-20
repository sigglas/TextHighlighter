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
        alert(`頁面中出現了關鍵字: \n${textMessage}`);
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

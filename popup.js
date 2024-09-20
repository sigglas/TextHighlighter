document.addEventListener('DOMContentLoaded', () => {
  // 載入儲存的資料並顯示在列表中
  chrome.storage.local.get("savedData", (result) => {
      const savedData = result.savedData || [];
      const list = document.getElementById('savedItems');

      savedData.forEach((entry, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = entry.selectedText;

          // // 預設顏色選擇器
          // const colorLabel = document.createElement('label');
          // colorLabel.textContent = '顏色:';
          // const colorSelect = document.createElement('select');
          // const colors = ['yellow', 'blue', 'green', 'red'];
          // colors.forEach((color) => {
          //     const option = document.createElement('option');
          //     option.value = color;
          //     option.textContent = color;
          //     if (entry.highlightColor === color) {
          //         option.selected = true;
          //     }
          //     colorSelect.appendChild(option);
          // });

          // 自定義顏色選擇器
          const customColorLabel = document.createElement('label');
          customColorLabel.textContent = 'Color:';
          const customColorInput = document.createElement('input');
          customColorInput.type = 'color';
          customColorInput.value = entry.highlightColor?.startsWith('#') ? entry.highlightColor : '#ffff00';

          customColorInput.addEventListener('change', () => {
              updateItem(index, customColorInput.value, parseInt(fontSizeSelect.value), alertCheckbox.checked);
          });

          // 字體大小選擇器
          const fontSizeLabel = document.createElement('label');
          fontSizeLabel.textContent = '字體放大:';
          const fontSizeSelect = document.createElement('select');
          for (let i = 1; i <= 3; i++) {
              const option = document.createElement('option');
              option.value = i;
              option.textContent = `${i}x`;
              if (entry.fontSizeMultiplier === i) {
                  option.selected = true;
              }
              fontSizeSelect.appendChild(option);
          }

          // 警示開關
          const alertLabel = document.createElement('label');
          alertLabel.textContent = '警示:';
          const alertCheckbox = document.createElement('input');
          alertCheckbox.type = 'checkbox';
          alertCheckbox.checked = entry.alertEnabled || false;

          alertCheckbox.addEventListener('change', () => {
              updateItemAlert(index, alertCheckbox.checked);
          });

          // 更新按鈕
          const updateButton = document.createElement('button');
          updateButton.textContent = '儲存';
          updateButton.addEventListener('click', () => {
              const selectedColor = customColorInput.value || colorSelect.value;
              updateItem(index, selectedColor, parseInt(fontSizeSelect.value), alertCheckbox.checked);
          });

          // 刪除按鈕
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '刪除';
          deleteButton.addEventListener('click', () => {
              deleteItem(index);
          });

          // 添加屬性選擇到列表項目中
          const attributesDiv = document.createElement('div');
          attributesDiv.classList.add('attributes');
          //attributesDiv.appendChild(colorLabel);
          //attributesDiv.appendChild(colorSelect);
          attributesDiv.appendChild(customColorLabel);
          attributesDiv.appendChild(customColorInput);
          attributesDiv.appendChild(fontSizeLabel);
          attributesDiv.appendChild(fontSizeSelect);
          attributesDiv.appendChild(alertLabel);
          attributesDiv.appendChild(alertCheckbox);
          attributesDiv.appendChild(updateButton);
          attributesDiv.appendChild(deleteButton);

          listItem.appendChild(attributesDiv);
          list.appendChild(listItem);
      });
  });

  // 下載 JSON 資料的功能
  document.getElementById('downloadBtn').addEventListener('click', () => {
      chrome.storage.local.get("savedData", (result) => {
          const savedData = result.savedData || [];
          const blob = new Blob([JSON.stringify(savedData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'saved_data.json';
          link.click();
      });
  });
});

// 更新特定項目的屬性
function updateItem(index, highlightColor, fontSizeMultiplier, alertEnabled) {
  chrome.storage.local.get("savedData", (result) => {
      let savedData = result.savedData || [];
      savedData[index].highlightColor = highlightColor;
      savedData[index].fontSizeMultiplier = fontSizeMultiplier;
      savedData[index].alertEnabled = alertEnabled;

      // 更新儲存的資料
      chrome.storage.local.set({ savedData: savedData }, () => {
          alert('屬性已更新！');
      });
  });
}

// 更新特定項目的警示開關
function updateItemAlert(index, alertEnabled) {
  chrome.storage.local.get("savedData", (result) => {
      let savedData = result.savedData || [];
      savedData[index].alertEnabled = alertEnabled;

      // 更新儲存的資料
      chrome.storage.local.set({ savedData: savedData }, () => {
          alert('警示設定已更新！');
      });
  });
}

// 刪除特定項目的函數
function deleteItem(index) {
  chrome.storage.local.get("savedData", (result) => {
      let savedData = result.savedData || [];
      // 刪除特定索引的項目
      savedData.splice(index, 1);

      // 更新儲存的資料
      chrome.storage.local.set({ savedData: savedData }, () => {
          // 重新載入 popup 以更新顯示
          window.location.reload();
      });
  });
}

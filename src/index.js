(() => {
  // Saving to window for now. Need better data persistency
  window.sheetData = {};

  const handleCellUpdate = cellData => {
    // Update sheet with new data
    for (const key in cellData) {
      if (window.sheetData.hasOwnProperty(key)) {
        window.sheetData[key] = cellData[key];
      } else {
        window.sheetData[key] = cellData[key];
      }
    }

    console.log(window.sheetData);
  };

  const addRefreshButton = () => {
    const handleRefresh = () => {
      const spreadsheetContainer = document.getElementById(
        "spreadsheetContainer"
      );
      spreadsheetContainer.innerHTML = "";
      spreadsheetContainer.append(
        spreadsheet.newWithData(window.sheetData, handleCellUpdate)
      );
    };

    const refreshButton = document.getElementById("refresh");
    refreshButton.onclick = () => {
      handleRefresh();
    };
  };

  const drawSpreadsheet = () => {
    const container = document.getElementById("spreadsheetContainer");
    container.append(spreadsheet.new(handleCellUpdate));
  };

  addRefreshButton();
  drawSpreadsheet();
})();

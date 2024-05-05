(() => {
  let sheetData = {};

  const handleCellUpdate = cellData => {
    // Update sheet with new data
    for (const key in cellData) {
      if (sheetData.hasOwnProperty(key)) {
        sheetData[key] = cellData[key];
      } else {
        sheetData[key] = cellData[key];
      }
    }

    console.log(sheetData);
  };

  const addRefreshButton = () => {
    const handleRefresh = () => {
      const spreadsheetContainer = document.getElementById(
        "spreadsheetContainer"
      );
      spreadsheetContainer.innerHTML = "";
      spreadsheetContainer.append(
        spreadsheet.newWithData(sheetData, handleCellUpdate)
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

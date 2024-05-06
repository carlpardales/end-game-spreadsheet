(() => {
  // Saving to window for now. Need better data persistency
  window.sheetData = {};

  const updateDependentCells = dependents => {
    dependents?.forEach(id => {
      spreadsheet.refreshCell(window.sheetData[id], updateDependentCells);
    });
  };

  const handleCellUpdate = newData => {
    // Update sheet with new data
    for (const key in newData) {
      if (window.sheetData.hasOwnProperty(key)) {
        Object.assign(window.sheetData[key], newData[key]);
      } else {
        window.sheetData[key] = newData[key];
      }
    }

    const cellId = Object.keys(newData)[0];
    const cellData = window.sheetData[cellId];
    const dependents = cellData.dependencies;
    updateDependentCells(dependents);
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

  const handleItalize = () => {
    // Using saved cell and row indices, query table to get the cell.
    // Programmatically set text font style to 'italic'
  };

  const handleBold = () => {
    // Using saved cell and row indices, query table to get the cell.
    // Programmatically set fontWeight = "bold"
  };

  const handleUndelrine = () => {
    // Using saved cell and row indices, query table to get the cell.
    // Programmatically set text decoration = 'underline'
  };




  const drawSpreadsheet = () => {
    const container = document.getElementById("spreadsheetContainer");
    container.append(spreadsheet.new(handleCellUpdate));
  };

  addRefreshButton();
  drawSpreadsheet();
})();

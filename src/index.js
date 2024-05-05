(() => {
  let sheetData = [];

  const handleCellUpdate = cellData => {
    let indexToUpdate = sheetData.findIndex(
      obj => obj.row === cellData.row && obj.column === cellData.column
    );

    if (indexToUpdate !== -1) {
      sheetData[indexToUpdate].value = cellData.value;
    } else {
      sheetData.push(cellData);
    }

    console.log(sheetData);
  };

  const addRefreshButton = () => {
    const handleRefresh = () => {
      const spreadsheetContainer = document.getElementById(
        "spreadsheetContainer"
      );
      spreadsheetContainer.innerHTML = "";
      spreadsheetContainer.append(spreadsheet.redraw());
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

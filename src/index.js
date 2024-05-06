(() => {
  const addRefreshButton = () => {
    const handleRefresh = () => {
      const spreadsheetContainer = document.getElementById(
        "spreadsheetContainer"
      );
      spreadsheetContainer.innerHTML = "";
      spreadsheetContainer.append(spreadsheet.newWithData());
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
    container.append(spreadsheet.new());
  };

  addRefreshButton();
  drawSpreadsheet();
})();

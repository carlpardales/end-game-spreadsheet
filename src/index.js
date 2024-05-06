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

  const toolbar = () => {
    const boldButton = document.getElementById("bold");
    boldButton.onclick = () => {
      // Using saved cell and row indices, query table to get the cell.
      // Programmatically set text font style to 'italic'
      // Save formatting in cellData
    };

    const italiseButton = document.getElementById("italics");
    italiseButton.onclick = () => {
      // Using saved cell and row indices, query table to get the cell.
      // Programmatically set text font style to 'italic'
    };

    const underlineButton = document.getElementById("underline");
    underlineButton.onclick = () => {
      // Using saved cell and row indices, query table to get the cell.
      // Programmatically set text decoration = 'underline'
    };
  };

  const drawSpreadsheet = () => {
    const container = document.getElementById("spreadsheetContainer");
    container.append(spreadsheet.new());
  };

  toolbar();
  addRefreshButton();
  drawSpreadsheet();
})();

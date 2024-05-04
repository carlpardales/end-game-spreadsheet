(() => {
  const dimension = {
    column: 100,
    row: 100,
  };

  const drawHeader = table => {
    const tableHead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    for (let i = 0; i <= dimension.column; i++) {
      const cell = document.createElement("th");
      if (i != 0) {
        const cellText = document.createTextNode(generateColumnLabel(i - 1));
        cell.appendChild(cellText);
      }
      headerRow.appendChild(cell);
    }

    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);
  };

  const generateColumnLabel = columnNumber => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let label = alphabet[columnNumber % 26];
    if (columnNumber >= 26) {
      label =
        alphabet[Math.floor(columnNumber / 26) - 1] +
        alphabet[columnNumber % 26];
    }

    return label;
  };

  const drawBody = table => {
    const tableBody = document.createElement("tbody");
    for (let i = 0; i < dimension.row; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j <= dimension.column; j++) {
        const cell = document.createElement("td");
        if (j == 0) {
          const cellText = document.createTextNode(i + 1);
          cell.appendChild(cellText);
        }

        row.appendChild(cell);
      }

      tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
  };

  const drawSpreadsheet = () => {
    const table = document.createElement("table");

    drawHeader(table);
    drawBody(table);

    document.body.appendChild(table);
  };

  drawSpreadsheet();
})();

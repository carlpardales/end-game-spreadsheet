const dimension = {
  column: 100,
  row: 100,
};

// Expect zero-based index
const spreadsheetCreator = () => {
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

  const editCell = (cell, onUpdate) => {
    if (cell.hasAttribute("data-clicked")) {
      return;
    }

    cell.setAttribute("data-clicked", "true");
    const input = document.createElement("input");
    input.value = cell.innerText;

    input.onblur = () => {
      var parentCell = input.parentElement;

      cell.removeAttribute("data-clicked");

      // Save only if we have a value
      if (input.value) {
        const cellData = {
          row: cell.parentNode.rowIndex,
          column: cell.cellIndex,
          value: input.value,
        };
        onUpdate(cellData);
      }
      parentCell.innerText = input.value;
    };

    input.onkeydown = event => {
      if (event.key == "Enter") {
        input.blur();

        //TODO: Focus below cell
      }
    };

    cell.innerHTML = "";
    cell.append(input);
    cell.firstElementChild.select();
  };

  const drawBody = (table, onCellUpdate) => {
    const tableBody = document.createElement("tbody");
    for (let i = 0; i < dimension.row; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j <= dimension.column; j++) {
        const cell = document.createElement("td");

        if (j == 0) {
          const cellText = document.createTextNode(i + 1);
          cell.appendChild(cellText);
        } else {
          cell.onclick = () => {
            editCell(cell, onCellUpdate);
          };
        }

        row.appendChild(cell);
      }

      tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
  };

  const drawSpreadsheet = onCellUpdate => {
    const table = document.createElement("table");
    drawHeader(table);
    drawBody(table, onCellUpdate);

    return table;
  };

  const drawSpreadsheetWithData = (initialData, onCellUpdate) => {
    const table = drawSpreadsheet(onCellUpdate);

    if (initialData) {
      // Sort by row and column
      initialData.sort((a, b) => {
        if (a.row !== b.row) {
          return a.row - b.row;
        }
        return a.column - b.column;
      });

      initialData.forEach(cellData => {
        const rowIndex = cellData.row;
        const columnIndex = cellData.column;
        const cell = table.rows[rowIndex].cells[columnIndex];

        cell.textContent = cellData.value;
      });
    }

    return table;
  };

  return {
    new: onCellUpdate => drawSpreadsheet(onCellUpdate),
    newWithData: (initialData, onCellUpdate) =>
      drawSpreadsheetWithData(initialData, onCellUpdate),
  };
};

var spreadsheet = spreadsheetCreator();

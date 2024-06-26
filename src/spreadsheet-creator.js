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

  const editCell = cell => {
    if (cell.hasAttribute("data-clicked")) {
      return;
    }

    // Get formula or value
    const columnIndex = cell.cellIndex;
    const rowIndex = cell.parentElement.rowIndex;
    const cellData = spreadsheetData.readCell(rowIndex, columnIndex);
    const cellFormula = cellData?.formula;
    const cellValue = cell.innerText || cellData?.value || "";
    const oldValue = cellFormula || cellValue || "";

    const input = document.createElement("input");
    input.value = oldValue;

    cell.setAttribute("data-clicked", "true ");

    cell.innerHTML = "";
    cell.append(input);
    cell.firstElementChild.select();

    input.onblur = () => {
      var parentCell = input.parentElement;

      cell.removeAttribute("data-clicked");

      // Save only if we have a value
      const newValue = input.value;
      const hasChanged = oldValue !== newValue;
      if (hasChanged) {
        const cellId = `${generateColumnLabel(cell.cellIndex - 1)}${
          cell.parentNode.rowIndex
        }`;

        const newData = {
          [cellId]: {
            row: cell.parentNode.rowIndex,
            column: cell.cellIndex,
            value: "",
            formula: "",
          },
        };

        const isFormula = newValue.startsWith("=") && newValue.length > 1;
        if (isFormula) {
          const result = formula.run(newValue.substring(1));
          newData[cellId].formula = newValue;

          parentCell.innerText = result.value;

          // Update spreadsheetData and add cellId as dependent for all cells in result.referencedCells
          // TODO: Need to update dependency when referencing cell updates formula and no longer refer to this cell/s
          spreadsheetData.update(result.referencedCells, cellId);
        } else {
          newData[cellId].value = newValue;
          parentCell.innerText = newValue;
        }

        spreadsheetData.upsert(newData);
      } else {
        parentCell.innerText = cellValue;
      }
    };

    input.onkeydown = event => {
      if (event.key == "Enter") {
        input.blur();

        //TODO: Focus below cell
      }
    };
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
        } else {
          cell.onclick = () => {
            editCell(cell);
          };
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

    return table;
  };

  const drawSpreadsheetWithData = () => {
    const table = drawSpreadsheet();

    // If there is a formula, calculate value and cascade to dependents.
    // Defaults to the value propoerty.
    const getValue = cellData => {
      const cellFormula = cellData.formula;

      return cellFormula
        ? formula.run(cellFormula.substring(1)).value
        : cellData.value;
    };

    const initialData = spreadsheetData.read();
    if (initialData) {
      for (const key in initialData) {
        if (initialData.hasOwnProperty(key)) {
          const entry = initialData[key];
          const rowIndex = entry.row;
          const columnIndex = entry.column;

          const cell = table.rows[rowIndex].cells[columnIndex];
          cell.textContent = getValue(entry);
        }
      }
    }

    return table;
  };

  const handleCellRefresh = (cellData, updateDependentCells) => {
    const container = document.getElementById("spreadsheetContainer");
    const table = container.querySelector("table");
    const cell = table.rows[cellData.row].cells[cellData.column];

    const cellFormula = cellData.formula;
    if (cellFormula) {
      const result = formula.run(cellFormula.substring(1));

      cell.innerText = result.value;
    }

    updateDependentCells(cellData.dependencies);
  };

  return {
    new: () => drawSpreadsheet(),
    newWithData: () => drawSpreadsheetWithData(),
    refreshCell: (cellData, updateDependentCells) =>
      handleCellRefresh(cellData, updateDependentCells),
  };
};

var spreadsheet = spreadsheetCreator();

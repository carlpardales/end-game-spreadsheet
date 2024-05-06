const formulaProcessor = () => {
  const tokenizeFormula = formula => {
    const tokens = [];
    let token = "";

    for (let i = 0; i < formula.length; i++) {
      const char = formula[i];

      const delimeter = ["+", "-", "*", "/", "(", ")"];
      if (delimeter.includes(char)) {
        // Add the current token to the tokens array
        if (token !== "") {
          tokens.push(token);
          token = ""; // Reset token
        }
        tokens.push(char); // Add the delimiter as a separate token
      } else if (char !== " ") {
        // Skip whitespace
        token += char; // Append the character to the current token
      }
    }

    // Add the last token if it exists
    if (token !== "") {
      tokens.push(token);
    }

    return tokens;
  };

  const isValidCellId = id => {
    // TODO: This handles fixed range for now but should changed to accomodate grid  dimension changes

    // Regular expression to match cell references from A1 to CV100
    const regex = /^[A-Z]{1,2}(?:100|[1-9][0-9]?)?$/;

    return regex.test(id);
  };

  const evaluateFormula = (tokens, cellData) => {
    const stack = [];
    const referencedCells = [];

    // Helper function to perform arithmetic operations
    function applyOperation(operator, operand2, operand1) {
      switch (operator) {
        case "+":
          return operand1 + operand2;
        case "-":
          return operand1 - operand2;
        case "*":
          return operand1 * operand2;
        case "/":
          return operand1 / operand2;
        default:
          throw new Error("Invalid operator: " + operator);
      }
    }

    const getValue = cellData => {
      const cellFormula = cellData.formula;

      return cellFormula
        ? formula.run(cellFormula.substring(1)).value
        : cellData.value;
    };

    function evaluateRange(range) {
      const [startCell, endCell] = range.split(":");
      const [startCol, startRow] = startCell.match(/[A-Z]+|\d+/g);
      const [endCol, endRow] = endCell.match(/[A-Z]+|\d+/g);
      const startRowIndex = parseInt(startRow, 10);
      const endRowIndex = parseInt(endRow, 10);
      const startColIndex = columnToIndex(startCol);
      const endColIndex = columnToIndex(endCol);
      let cellValues = [];

      for (let i = startRowIndex; i <= endRowIndex; i++) {
        for (let j = startColIndex; j <= endColIndex; j++) {
          const cellId = indexToColumn(j) + i;
          const sheetData = spreadsheetData.read();
          const cellValue = sheetData[cellId]?.value;
          if (cellValue !== undefined && cellValue !== "") {
            cellValues.push(parseFloat(cellValue));
            referencedCells.push(cellId);
          }
        }
      }
      return cellValues;
    }

    // Function to convert column letter to index (A=0, B=1, ..., Z=25)
    function columnToIndex(column) {
      let index = 0;
      for (let i = 0; i < column.length; i++) {
        index = index * 26 + (column.charCodeAt(i) - 65 + 1);
      }
      return index - 1;
    }

    // Function to convert index to column letter (0=A, 1=B, ..., 25=Z)
    function indexToColumn(index) {
      let column = "";
      while (index >= 0) {
        column = String.fromCharCode((index % 26) + 65) + column;
        index = Math.floor(index / 26) - 1;
      }
      return column;
    }

    // Function to perform common Excel functions
    function evaluateFunction(func, operands) {
      switch (func.toUpperCase()) {
        case "SUM":
          return operands.reduce((acc, val) => acc + val, 0);
        case "AVE":
          return operands.reduce((acc, val) => acc + val, 0) / operands.length;
        case "MAX":
          return Math.max(...operands);
        case "MIN":
          return Math.min(...operands);
        case "COUNT":
          return operands.length;
        default:
          throw new Error("Invalid function: " + func);
      }
    }

    // Iterate through tokens and evaluate the expression
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        const operands = [];
        let operand = stack.pop();
        while (operand !== "(") {
          if (isValidCellId(operand)) {
            // Check if the operand is a single cell reference
            const sheetData = spreadsheetData.read();
            operands.push(parseFloat(sheetData[operand]?.value || 0));
          } else if (/^[A-Z]+\d+:[A-Z]+\d+$/.test(operand)) {
            // Check if the operand is a range (e.g., A1:A3)
            let valueRange = evaluateRange(operand);
            operands.push(...valueRange);
          } else {
            throw new Error("Invalid operand: " + operand);
          }
          operand = stack.pop();
        }
        const func = stack.pop();
        const result = evaluateFunction(func, operands);
        stack.push(result);
      } else if (["+", "-", "*", "/"].includes(token)) {
        stack.push(token);
      } else if (isValidCellId(token)) {
        const cellId = token;
        // TODO: Formula breaks when cell is empty. Sort out and make sure empty cell
        // is ignored when processing formula. reprocesss formula if breaking cell no longer empty
        const sheetData = spreadsheetData.read();
        const cellData = sheetData[cellId];
        const cellFormula = cellData?.formula;
        const cellValue = cellData?.value || "";

        if (cellFormula) {
          const result = runProcessor(cellFormula.substring(1));
          stack.push(parseFloat(result.value));
        } else {
          stack.push(parseFloat(cellValue));
        }

        referencedCells.push(cellId);
      } else {
        stack.push(token);
      }
    }

    // Evaluate the remaining expression in the stack
    while (stack.length > 1) {
      const operand2 = parseFloat(stack.pop());
      const operator = stack.pop();
      const operand1 = parseFloat(stack.pop());
      const result = applyOperation(operator, operand2, operand1);
      stack.push(result);
    }

    // The final result is the only element remaining in the stack
    return { value: stack.pop(), referencedCells: referencedCells };
  };

  const runProcessor = formula => {
    const cellData = spreadsheetData.read();
    const tokens = tokenizeFormula(formula);
    const result = evaluateFormula(tokens, cellData);

    return result;
  };

  return {
    run: formula => runProcessor(formula),
  };
};

var formula = formulaProcessor();

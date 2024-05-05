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

    //TODO: Perform functions like  ["SUM", "AVE", "MAX", "MIN", "COUNT"];

    // Iterate through tokens and evaluate the expression
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        const operand2 = parseFloat(stack.pop());
        const operator = stack.pop(); // Discard opening parenthesis
        const operand1 = parseFloat(stack.pop());

        const result = applyOperation(operator, operand2, operand1);
        stack.push(result); // Push the result of the subexpression back to the stack
      } else if (["+", "-", "*", "/"].includes(token)) {
        stack.push(token);
      } else if (isValidCellId(token)) {
        const cellId = token;
        const cellData = window.sheetData[cellId];
        const cellFormula = cellData.formula;
        const cellValue = cellData.value;

        if (cellFormula) {
          const result = runProcessor(
            cellFormula.substring(1),
            window.sheetData
          );
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

  const runProcessor = (formula, cellData) => {
    const tokens = tokenizeFormula(formula);
    const result = evaluateFormula(tokens, cellData);

    return result;
  };

  return {
    run: (formula, cellData) => runProcessor(formula, cellData),
  };
};

var formula = formulaProcessor();

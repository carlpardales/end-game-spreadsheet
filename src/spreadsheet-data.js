const spreadsheetData = (() => {
  data = {};

  const updateDependentCells = dependents => {
    dependents?.forEach(id => {
      spreadsheet.refreshCell(data[id], updateDependentCells);
    });
  };

  const handleRead = () => {
    return data;
  };

  const handleReadCell = (row, column) => {
    for (const key in data) {
      if (data[key].row === row && data[key].column === column) {
        return data[key];
      }
    }
    return null;
  };

  const handleUpdate = (referencedCells, cellId) => {
    referencedCells.forEach(id => {
      if (data.hasOwnProperty(id)) {
        if (!data[id].dependencies) {
          data[id].dependencies = [];
        }
        data[id].dependencies.push(cellId);
      } else {
        data[id] = { dependencies: [cellId] };
      }
    });
  };

  const handleUpsert = cell => {
    for (const key in cell) {
      if (data.hasOwnProperty(key)) {
        Object.assign(data[key], cell[key]);
      } else {
        data[key] = cell[key];
      }
    }

    const cellId = Object.keys(cell)[0];
    const cellData = data[cellId];
    const dependents = cellData.dependencies;
    updateDependentCells(dependents);
  };

  return {
    read: () => handleRead(),
    readCell: (row, column) => handleReadCell(row, column),
    update: (referencedCells, cellId) => handleUpdate(referencedCells, cellId),
    upsert: cell => handleUpsert(cell),
  };
})();

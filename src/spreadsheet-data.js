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

  const readCellById = id => {
    return data[id];
  };

  const handleReadCellValueById = id => {
    return data[id]?.value;
  };

  const handleUpdate = (referencedCells, id) => {
    referencedCells.forEach(refId => {
      if (data.hasOwnProperty(refId)) {
        if (!data[refId].dependencies) {
          data[refId].dependencies = [];
        }
        data[refId].dependencies.push(id);
      } else {
        data[refId] = { dependencies: [id] };
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
    readCellById: id => readCellById(id),
    readCellValueById: id => handleReadCellValueById(id),
    update: (referencedCells, id) => handleUpdate(referencedCells, id),
    upsert: cell => handleUpsert(cell),
  };
})();

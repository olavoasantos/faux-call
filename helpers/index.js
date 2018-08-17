  /**
   *  getDataFromBody
   *  Gets the column data from the request body.
   */
  const getDataFromBody = (columns, body, shouldIncludeNull = true) =>
    columns.reduce((data, column) => {
      if (shouldIncludeNull || body[column]) {
        data[column] = body[column];
      }
      return data;
    }, {});

module.exports = { getDataFromBody };
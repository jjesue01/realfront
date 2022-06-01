export function csvToArray(str, delimiter = ",") {
  const headersString = str.slice(0, str.indexOf("\r\n")).split(delimiter);

  let headers = headersString.map(item => item.match(/[A-Z][a-z]+/g).join("_").toLowerCase())

  // eslint-disable-next-line
  let reg = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/
  const rows = str.slice(str.indexOf("\n") + 1).split('\n');

  const arr = rows.map(function (row) {
    const values = row.split(reg,-1);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  return arr;
}
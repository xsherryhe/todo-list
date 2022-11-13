export function getData() {
  if(!localStorage.data) return;
  const JSONData = JSON.parse(localStorage.data),
        data = {};
  for(const key in JSONData)
    data[key] = JSON.parse(JSONData[key]);
  return data;
}

export function saveData(data) {
  const JSONData = {};
  for(const key in data)
    JSONData[key] = JSON.stringify(data[key]);
  localStorage.data = JSON.stringify(JSONData);
}

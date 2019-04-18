const axios = require("axios");

// var i = 0;
//
// (async function() {
//     let i = axios.get(`http://localhost:8888/nextIdx`);
//
//     console.log("result", i);
// })();

// async getIdx() {
//   return axios.get(`http://localhost:8888/nextIdx`);
// }
//
// async saveDataWithID(data) {
//     this.getIdx().then(async id => {
//       await axios({
//           method: "PUT",
//           url: `http://localhost:8888/${id}`,
//           headers: { 'Content-Type': 'application/json' },
//           data: {
//             id: id,
//             data: data
//           }
//       });
//       return id;
//     }).then(async (id) => {
//       await axios({
//           method: "PUT",
//           url: `http://localhost:8888/nextIdx`,
//           headers: { 'Content-Type': 'application/json' },
//           data: {
//             idx: id+1,
//           }
//       });
//       return id
//     }).then(id => {
//       return id;
//     });
// }

export async function saveData(action, caseID, value, hash, location) {
  var data = {
    action: action,
    caseID: caseID,
    value: value,
    hash: hash,
    location: location
  };
  console.log(data);
  var response = await axios({
    method: "PUT",
    url: `http://localhost:8888/${data.location}`,
    headers: { "Content-Type": "application/json" },
    data
  });
  return response;
}

export async function getData(id) {
  try {
    var res = await axios.get(`http://localhost:8888/${id}`);
    return res.data;
  } catch (error) {
    console.log(`Get data error [location: ${id}]`);
    return null;
  }
}

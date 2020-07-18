const axios = require("axios");

let createBuildingRequest1 = {
  operationName: null,
  variables: {},
  query:
    'mutation {  createBuilding(address: "111 special street") {    id  }}',
};
let createBuildingRequest2 = {
  operationName: null,
  variables: {},
  query:
    'mutation {  createBuilding(address: "222 special street") {    id  }}',
};

let doRequest = (jsonRequest) => {
  axios
    .post("http://localhost:4000", jsonRequest)
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
      // console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
};

doRequest(createBuildingRequest1);
doRequest(createBuildingRequest2);

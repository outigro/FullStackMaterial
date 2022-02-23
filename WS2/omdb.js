var axios = require("axios");

const promise = axios
  .get("http://www.omdbapi.com/?s=star+wars&apikey=cbbc6750")
  .then(response => {
    const data = response.data;
    console.log(data);
 
    for (var i = 0; i < 10; i++) {
      console.log(data.Search[i].Title);
    }
  });

console.log(promise);

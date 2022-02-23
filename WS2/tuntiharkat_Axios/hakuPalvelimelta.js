// Otetaan axios-moduuli käyttöön
var axios = require("axios");
// Luodaan AJAX-kysely ja lähetetään pyyntö
const promise = axios
 .get("http://www.omdbapi.com/?s=James+Bond&apikey=cbbc6750")
 // Käsitellään vastaus kun se saapuu
  .then(response => {
    const data = response.data;
//    console.log("NYT: ");
    console.log(data);
  });
// Tulostetaan konsoliin promise-objektin tilatietoja AJAX-pyynnön käsittelyn aikana  
//console.log("LOPPU: ");
console.log(promise);
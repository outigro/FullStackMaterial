var fs = require('fs')

console.log('Aloitetaan lukuoperaatio.')
var data = fs.readFile('uusiFile.txt', function (err, data) {
  if (err) {
    console.log('Tapahtui virhe!')
  }
  console.log('Luettu tiedosto:\n')
  console.log(data.toString())
})

for (var i = 0; i < 10; i++) {
  console.log('Tulostetaan rivi tiedoston sisältöä odotellessa..' + i)
}

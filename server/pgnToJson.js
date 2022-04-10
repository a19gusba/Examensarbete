const parser = require('chess-pgn-parser');
const fs = require('fs');

// Read PGN file
//var pgn_file = fs.readFileSync('lichess_db_standard_rated_2013-08.pgn') + "";
var pgn_file = fs.readFileSync('test_data.pgn') + "";
var pgn = pgn_file.split('\n');
var games = [];
var curGame = ``

// Loop through PGN and split up each game into arrays
pgn.forEach(element => {
    var bool = element.includes('[Event "')

    if (bool) {
        games.push(curGame)
        curGame = ``
    }
    else {
        curGame += `${element}        
`
    }
});
games.shift();
// Convert games array to json format
var json_arr = []
games.forEach(element => {
    var json = JSON.parse(parser.pgn2json(element));
    json_arr.push(json);
});

// Create output file with PGN JSON data
let data = JSON.stringify(json_arr);
fs.writeFileSync('output_test_data.json', data);

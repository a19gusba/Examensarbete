const fs = require('fs').promises;
const { type } = require('express/lib/response');
const gameModel = require("../models/game")
const squareModel = require("../models/squares")

const dataPath = "../dataset/lichess_db_standard_rated_2013-01.json"
const dataPath2 = "../dataset/output_test_data.json"
let data = "";

async function readFile(filePath) {
    try {
        data = await fs.readFile(filePath);
        data = data.toString()
        data = JSON.parse(data)

    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

const getAllData = async (req, res) => {
    try {
        let games = await gameModel.find().limit(100000)
        res.send(games)
    } catch (error) {
        res.send({ message: error })
    }
}

const getAllMoves = async (req, res) => {
    try {
        let games = await gameModel.find();
        let moves = [];
        for (let game of games)
            moves.push(game.moves)
        res.send(moves.flat())
    } catch (error) {
        console.log(error)
        res.send({ message: error })
    }
}

const getAllSquares = async (req, res) => {
    try {
        let games = await squareModel.find().limit(100);
        let squares = [];

        for (let game of games) {
            squares.push(game.squares)
        }

        res.send(squares.flat())
    } catch (error) {
        console.log(error)
        res.send({ message: error })
    }
}

async function insertData(data) {
    for (let game of data) {
        let gameStr = [];
        let gameMoves = [];
        for (let key in game) {
            if (key == "str") gameStr[key] = game[key]
            else if (key == "moves") gameMoves[key] = game[key]
        }
        gameStr = gameStr.str
        gameMoves = gameMoves.moves
        console.log(gameStr)

        try {
            let newGameModel = new gameModel({
                str: {
                    Black: gameStr.Black,
                    BlackElo: gameStr.BlackElo,
                    BlackRatingDiff: gameStr.BlackRatingDiff,
                    ECO: gameStr.ECO,
                    Opening: gameStr.Opening,
                    Site: gameStr.Site,
                    Termination: gameStr.Termination,
                    TimeControl: gameStr.TimeControl,
                    UTCDate: gameStr.UTCDate,
                    UTCTime: gameStr.UTCTime,
                    White: gameStr.White,
                    WhiteElo: gameStr.WhiteElo,
                    WhiteRatingDiff: gameStr.WhiteRatingDiff,
                },
                moves: gameMoves
            })
            await newGameModel.save()

        } catch (error) {
            console.log(error)
        }
    }
}

async function insertSquaresData() {

    try {
        let games = await gameModel.find();
        let gameIndex = 1

        for (let game of games) {
            let currentGameSquares = []
            for (let key in game) {
                if (key == "moves") {
                    for (let move of game[key]) {
                        let square = getSquareFromStr(move)
                        if (square != undefined)
                            currentGameSquares.push(square)
                    }
                }
            }

            try {
                console.log(`\nStoring game ${gameIndex}/${games.length} in database...`)
                let newSquareModel = new squareModel({
                    squares: currentGameSquares
                })
                await newSquareModel.save()
                console.log(`Game ${gameIndex}/${games.length} successfully saved!`)
            } catch (error) {
                console.log(error)
            }

            gameIndex++
        }
    } catch (error) {
        console.log(error)
    }

}

function getSquareFromStr(str) {
    let regex = /\d+/g;
    let match = str.match(regex);  // creates array from matches
    let index = str.indexOf(match)
    let result = str[index - 1] + str[index]

    if (typeof result != "string") {
        result = undefined
    }

    return result
}

/* readFile(dataPath) */

module.exports = { getAllData, getAllMoves, getAllSquares }
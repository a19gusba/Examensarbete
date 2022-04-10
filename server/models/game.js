const mongoose = require("mongoose")

const infoSchema = new mongoose.Schema({
    Black: String,
    BlackElo: String,
    BlackRatingDiff: String,
    ECO: String,
    Opening: String,
    Site: String,
    Termination: String,
    TimeControl: String,
    UTCDate: String,
    UTCTime: String,
    White: String,
    WhiteElo: String,
    WhiteRatingDiff: String,
})

const gameSchema = new mongoose.Schema({
    moves: [String],
    str: infoSchema
})

module.exports = mongoose.model("gameModel", gameSchema)
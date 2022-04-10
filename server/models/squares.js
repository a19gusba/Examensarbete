const mongoose = require("mongoose")

const squaresSchema = new mongoose.Schema({
    squares: [String]
})

module.exports = mongoose.model("squaresModel", squaresSchema)
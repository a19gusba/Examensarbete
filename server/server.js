const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())

app.listen(5000, console.log("server started"))

mongoose.connect("mongodb://localhost/examensarbete")
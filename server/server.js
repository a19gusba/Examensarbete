const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
const dataRouter = require("./routes/chess")

app.use(cors())
app.use("/data/", dataRouter)

app.listen(5000, console.log("server started"))

mongoose.connect("mongodb://localhost/examensarbete")
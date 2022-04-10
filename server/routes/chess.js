const express = require("express")
const router = express.Router()
const { getAllData, getAllMoves, getAllSquares } = require("../controllers/chess")

router.get("/all", getAllData)
router.get("/moves", getAllMoves)
router.get("/squares", getAllSquares)

module.exports = router
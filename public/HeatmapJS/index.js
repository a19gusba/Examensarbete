generateChessBoard()
generateButtons()

// Heatmap
var heatmapInstance = h337.create({
    container: document.getElementById('container')
});

const canvasElement = document.querySelector(".heatmap-canvas")
const ctx = canvasElement.getContext("2d")

const url = "http://localhost:5000/data/squares"

let squareFrequency
let maxFrequency
let data;
let formatedData;

async function loadData() {
    data = await getAllData()
}

async function formatData(piece) {
    let movesData = await formatDataMoves(data)
    formatedData = await formatDataSquares(movesData, piece)

    let [max, all] = await getMostFrequentSquare(formatedData)
    maxFrequency = max
    squareFrequency = all

    console.log(squareFrequency)
}

async function render() {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)

    var points = [];
    for (let square in squareFrequency) {
        var coord = getCoordByNotation(square)
        var point = {
            x: coord.x,
            y: coord.y,
            value: squareFrequency[square],
            radius: squareSize
        };
        points.push(point);
    }
    heatmapInstance.setData({ max: maxFrequency, data: points });
}

async function render_OLD() {
    // Clear canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)

    var points = [];
    formatedData.forEach(square => {
        var coord = getCoordByNotation(square)
        var point = {
            x: coord.x,
            y: coord.y,
            value: 1,
            radius: 60
        };
        points.push(point);
    });

    var data2 = {
        max: maxFrequency,
        data: points
    };

    heatmapInstance.setData(data2);
}





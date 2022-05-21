/* generateChessBoard() */
generateButtons()

let data
let formatedData
let maxFrequency
let squareFrequency



// Labels of row and columns
var myGroups = ["a", "b", "c", "d", "e", "f", "g", "h"]
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8"]
var svg;
var x;
var y;


// Build color scale
var myColor


//Read the data
async function loadData() {
    data = await getAllData()
}

async function formatData(piece) {
    let movesData = await formatDataMoves(data)
    formatedData = await formatDataSquares(movesData, piece)

    let [max, all] = await getMostFrequentSquare(formatedData)
    maxFrequency = max * 1
    squareFrequency = all

    myColor = d3.scaleLinear()
        // .range(["rgba(255, 255, 255, 0)", "#7EE081"])
        .range(["#000000", "#00C2D1"]) /* 00C2D1 DB504A 7EE081*/
        .domain([0, maxFrequency])
}

function setupSvg() {
    document.getElementById("test").innerHTML = ""

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg = d3.select("#test")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Build X scales and axis:
    x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)

    svg.append("g")
        .style("font-size", 15)
        .style("stroke", "white")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Build Y scales and axis:
    y = d3.scaleBand()
        .range([height, 0])
        .domain(myVars)

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", 15)
        .style("stroke", "white");
}

function render() {
    let data = squareFrequency
    setupSvg()


    for (let square in data) {
        svg.selectAll()
            .data(square)
            .enter()
            .append("rect")
            .attr("x", () => { return x(square[0]) })
            .attr("y", () => { return y(square[1]) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(squareFrequency[square]) })
            .style("stroke-width", 4)
            .style("stroke", "none")
    }

}

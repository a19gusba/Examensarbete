let startTime
let stopTime

let currentResult
let allResults = { dataLoadTime: "", games: 50000, loaded: [] }
let isLoaded = false

let libraries = ["heatmap", "d3"]
let repeat = { repeat: true, am: 1, current: 0, library: "D3" }

function startTimer() {
    currentResult = { format: "", render: "", total: "" }
    startTime = new Date();
}

function setTimestamp(type) {
    result[type] = new Date()
}

function timestampFormat() {
    result.load = startTime - new Date()
}

async function stopTimer() {
    stopTime = new Date()

    currentResult.total = currentResult.format + currentResult.render
    allResults.loaded.push(currentResult)

    console.log(repeat.current)

    if (repeat.repeat == false) return
    repeat.current++
    if (repeat.current >= repeat.am) {
        downloadResults()
        return
    }
    beginMeasure()
}

async function beginMeasure() {
    startTimer()

    if (isLoaded == false) await measureLoad()
    await measureFormat()
    await measureRender()

    stopTimer()
}

async function measureLoad() {
    console.log("Starting data load")
    let startDate = new Date()
    await loadData()
    allResults.dataLoadTime = new Date() - startDate
    isLoaded = true

    console.log("Data loaded")
}

async function measureFormat() {
    let startDate = new Date()
    await formatData()
    currentResult.format = new Date() - startDate
}

async function measureRender() {
    let startDate = new Date()
    await render()
    currentResult.render = new Date() - startDate
}

function downloadResults() {
    let dateObj = new Date().toLocaleDateString('en-GB');
    let dateStr = dateObj.toString().replaceAll("/", "_")
    let fileName = `${repeat.library}_DATA_${dateStr}`
    // Create download element
    var htmlElement = `<a id="downloadObElement" style="display:none"></a>`;
    document.querySelector("#container").insertAdjacentHTML("beforeend", htmlElement)

    // Add the data to the element
    var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allResults))}`;
    var e = document.getElementById('downloadObElement');
    e.setAttribute("href", dataStr);
    e.setAttribute("download", `${fileName}.json`);
    /* e.click(); */

    // Remove element
    e.parentNode.removeChild(e);

    console.log(allResults)
}


beginMeasure()

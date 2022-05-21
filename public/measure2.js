let startTime
let stopTime

let currentResult
let allResults = { dataLoadTime: "", games: 1000, loaded: [] }
let isLoaded = false

let libraries = ["heatmap", "d3"]
let repeat = { repeat: true, am: 100, current: 0, library: "D3" }

function startTimer() {
    currentResult = { format: "", render: "", total: "" }
    startTime = performance.now();
}

function setTimestamp(type) {
    result[type] = performance.now()
}

function timestampFormat() {
    result.load = startTime - performance.now()
}

async function stopTimer() {
    stopTime = performance.now()

    currentResult.total = currentResult.format + currentResult.render
    allResults.loaded.push(currentResult)

    /* console.log(repeat.current) */

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
    /* console.log("Starting data load") */
    let startDate = performance.now()
    await loadData()
    allResults.dataLoadTime = performance.now() - startDate
    isLoaded = true

    /* console.log("Data loaded") */
}

async function measureFormat() {
    let startDate = performance.now()
    await formatData()
    currentResult.format = performance.now() - startDate
}

async function measureRender() {
    let startDate = performance.now()
    await render()
    currentResult.render = performance.now() - startDate
}

function downloadResults() {
    let dateObj = new Date().toLocaleDateString('en-GB');
    let dateStr = dateObj.toString().replaceAll("/", "_")
    let fileName = `${repeat.library}_DATA_${dateStr}_games-${allResults.games}`
    // Create download element
    var htmlElement = `<a id="downloadObElement" style="display:none"></a>`;
    document.querySelector("#container").insertAdjacentHTML("beforeend", htmlElement)

    // Add the data to the element
    var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allResults))}`;
    var e = document.getElementById('downloadObElement');
    e.setAttribute("href", dataStr);
    e.setAttribute("download", `${fileName}.json`);
    e.click();

    // Remove element
    e.parentNode.removeChild(e);

    /* console.log(allResults) */
}


beginMeasure()

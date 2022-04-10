async function getAllData() {
    const url = "http://localhost:5000/data/all"

    let response = await fetch(url);
    let data = await response.text();

    return data
}

async function formatDataMoves(data) {
    let empty_arr_am = 0
    let result = []

    let is_data = false

    await JSON.parse(data, (key, value) => {
        if (key == "moves") {
            empty_arr_am++

            if (empty_arr_am >= 2) {
                empty_arr_am = 0
                is_data = true
            }
        }

        if (is_data) {
            result.push(value)
            is_data = false
        }

        return value;
    })

    return result.flat()
}

async function formatDataSquares(data, piece="") {
    let result = []

    data.forEach(move => {
        let square = getSquareFromMove(move, piece)
        if (square != undefined) result.push(square)
    })

    return result
}

async function getMostFrequentSquare(data) {
    if (data.length == 0)
        return null;
    var modeMap = {};
    var maxEl = data[0], maxCount = 1;
    for (var i = 0; i < data.length; i++) {
        var el = data[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }

    return [modeMap[maxEl], modeMap]
    /* return { max: modeMap[maxEl], squares: { modeMap } }; */
}

function getSquareFromMove(move, piece = "") {
    if (move.includes(piece) == false) return // Filtering
    let regex = /\d+/g;
    let match = move.match(regex);
    let index = move.indexOf(match)
    let result = move[index - 1] + move[index]

    if (typeof result != "string") {
        result = undefined
    }

    return result
}

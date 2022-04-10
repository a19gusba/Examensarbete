let squareSize = getComputedStyle(document.documentElement).getPropertyValue('--square-size').replace("px", "");
squareSize = parseInt(squareSize)

function generateChessBoard() {
    var boardElement = document.querySelector(".chess-board")

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var index = i * 8 + j
            var cssClasses = ["dark", "light"]
            var cssClass = cssClasses[(index + i) % 2]
            var squareElement = `<div class="square ${cssClass}">${getNotaionByIndex(index)}</div>`
            boardElement.insertAdjacentHTML('beforeend', squareElement);
        }
    }
}

function generateButtons() {
    const container = document.querySelector(".buttons-container")
    container.innerHTML = ""
    const pieces = ["all", "knight", "bishop", "queen", "rook", "king"]

    pieces.forEach((piece, i) => {
        let className = (i == 0) ? "btn btn--active" : "btn"
        container.innerHTML += `<div class="${className}" data-piece="${piece}">${piece}</div>`
    })

    const buttons = document.querySelectorAll(".btn")
    buttons.forEach(btn => {
        let piece = btn.dataset.piece
        let letter = capitalizeFirstLetter(piece[0])

        if (piece == "all") letter = ""
        else if (piece == "knight") letter = "N"

        btn.addEventListener("click", async () => {
            buttons.forEach(e => { e.classList.remove("btn--active") })
            btn.classList.add("btn--active")

            await formatData(letter)
            await render()
        })
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEven(n) {
    return n % 2 == 0
}

function getNotaionByIndex(i) {
    var colNotations = ["a", "b", "c", "d", "e", "f", "g", "h"]
    var row = Math.floor(i / 8)
    var col = i - (row * 8)
    return `${colNotations[col]}${row + 1}`
}

function getIndexByNotation(x) {
    var colNotations = ["a", "b", "c", "d", "e", "f", "g", "h"]
    var col = colNotations.indexOf(x[0])
    var row = parseInt(x[1] - 1)
    return row * 8 + col
}

function getCoordByNotation(x) {
    var colNotations = ["a", "b", "c", "d", "e", "f", "g", "h"]
    var col = colNotations.indexOf(x[0])
    var row = parseInt(x[1] - 1)

    var centerOffset = squareSize / 2

    if (row * squareSize + centerOffset < 0) {
        console.log(x)
    }

    return { x: col * squareSize + centerOffset, y: row * squareSize + centerOffset }
}


function mode(arr) {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).pop();
}

function getRandomMoves(n = 1) {
    var colNotations = ["a", "b", "c", "d", "e", "f", "g", "h"]
    var moves = []
    for (var i = 0; i < n; i++) {
        var coli = Math.round(Math.random() * 7)
        var rowi = Math.round(Math.random() * 7) + 1
        moves.push(`${colNotations[coli]}${rowi}`)
    }

    return moves
}
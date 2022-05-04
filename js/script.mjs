'use strict'
let peices = document.querySelector(".peices");
let peiceArray = [...document.querySelectorAll(".peice")];
let peice = document.querySelectorAll(".peice");
let clicked;
let controlDoubleClickMovement = 0;
let controlDifferentSquareMovement = 0;
let squaresAllowedToMove = [];
let clickedPeice = false;
let firstMove = false;
let row = 0,
    col = 0;
let turn = 0;
let chessPeiceSound = new Audio("audio/chess-peice-2.mp3");
let castlingSound = new Audio("audio/castling-sound-effect.mp3");
let chessPeiceCapture = new Audio("audio/chess-peice-capture-2.mp3");
let images = [...document.body.querySelector(".peices").querySelectorAll("img")];
let boardFlipped = false;
let canCastle = false;
let peiceFlipped = false;
let preventDoubleUndoClick = 0;
let isMate;
let modals = [...document.querySelectorAll(".modalChilds")];
let promotedPeice;
let rowPromoted, colPromoted;
let isNotStaleMate = false;
let isElPasant = false;
let previewBoardImage = document.querySelector(".boardImage");
let themeImages = ["board-1.jpg", "board-2.png", "board-3.jpg"];

let currentThemeIndex = 2;
document.querySelector(".leftBoard ").addEventListener("click", () => {
    if (currentThemeIndex != 0) {
        currentThemeIndex--;
    } else {
        currentThemeIndex = themeImages.length - 1;
    }
    previewBoardImage.children[0].src = `../images/${themeImages[currentThemeIndex]}`;

})

document.querySelector(".rightBoard ").addEventListener("click", () => {
    if (currentThemeIndex != themeImages.length - 1) {
        currentThemeIndex++;
    } else {
        currentThemeIndex = 0;
    }
    previewBoardImage.children[0].src = `../images/${themeImages[currentThemeIndex]}`;
})



document.querySelector(".save").addEventListener("click", () => {
    document.querySelector(".board").children[0].src = `../images/${themeImages[currentThemeIndex]}`;
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".optionsModal").classList.add("hidden");
})

document.querySelector(".options").addEventListener("click", (e) => {
    document.querySelector(".overlay").classList.remove("hidden");

    document.querySelector(".optionsModal").classList.remove("hidden");
})

let optionsCloseButtons = [...document.querySelectorAll(".close")];


optionsCloseButtons.forEach(clsbtn => {

    clsbtn.addEventListener("click", (e) => {
        document.querySelector(".overlay").classList.add("hidden");

        document.querySelector(".optionsModal").classList.add("hidden");

    })


})
document.querySelector(".promotionModal").addEventListener("click", (e) => {
    let clicked = e.target;
    clicked = clicked.closest("div");

    if (clicked.classList.contains("modalChilds") === false)
        return;
    else if (clicked.classList.contains("modalChilds")) {
        promotedPeice = clicked.classList[0];
        controlPromotion(clicked);
        removePromotionModal();
    }

})


let positions = [
    ['br', 'bk', 'bb', 'bq', 'cbK', 'bb', 'bk', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wk', 'wb', 'wq', 'cwK', 'wb', 'wk', 'wr'],
]
// let positions = [
//     ['e', 'e', 'e', 'e', 'cbK', 'e', 'e', 'e'],
//     ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
//     ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
//     ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
//     ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
//     ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
//     ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
//     ['wr', 'wk', 'wb', 'wq', 'cwK', 'wb', 'wk', 'wr'],
// ]
let peice2dArray = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];
for (let i = 0, k = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
        peice2dArray[i][j] = peiceArray[k];
        k++;
    }
}

function resetHighlightSquares() {
    peiceArray.forEach(p => {
        p.style.backgroundColor = "";
    })
}

function setPeicesClassControl() {
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            peice2dArray[i][j].classList.value = '';
            peice2dArray[i][j].classList.add("peice");
        }
    }

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let type = "empty";
            if (positions[i][j] == 'br') {
                peice2dArray[i][j].classList.add("black-rook");
                type = "black";
            } else if (positions[i][j] == 'wr') {
                peice2dArray[i][j].classList.add("white-rook");
                type = "white";
            } else if (positions[i][j] == 'bk') {
                peice2dArray[i][j].classList.add("black-knight");
                type = "black";

            } else if (positions[i][j] == 'wk') {
                peice2dArray[i][j].classList.add("white-knight");
                type = "white";

            } else if (positions[i][j] == 'bb') {
                peice2dArray[i][j].classList.add("black-bishop");
                type = "black";

            } else if (positions[i][j] == 'wb') {
                peice2dArray[i][j].classList.add("white-bishop");
                type = "white";

            } else if (positions[i][j] == 'bq') {
                peice2dArray[i][j].classList.add("black-queen");
                type = "black";

            } else if (positions[i][j] == 'wq') {
                peice2dArray[i][j].classList.add("white-queen");
                type = "white";

            } else if (positions[i][j] == 'bK') {
                peice2dArray[i][j].classList.add("black-king");
                type = "black";

            } else if (positions[i][j] == 'cbK') {
                peice2dArray[i][j].classList.add("black-king");
                peice2dArray[i][j].classList.add("castlingAllowedBlack");
                type = "black";

            } else if (positions[i][j] == 'wK') {
                peice2dArray[i][j].classList.add("white-king");
                type = "white";

            } else if (positions[i][j] == 'cwK') {
                peice2dArray[i][j].classList.add("white-king");
                peice2dArray[i][j].classList.add("castlingAllowedWhite");

                type = "white";

            } else if (positions[i][j] == 'bp') {
                peice2dArray[i][j].classList.add("black-pawn");
                type = "black";

            } else if (positions[i][j] == 'sbp') {
                peice2dArray[i][j].classList.add("black-pawn");
                peice2dArray[i][j].classList.add("secondMove");
                type = "black";

            } else if (positions[i][j] == 'swp') {
                peice2dArray[i][j].classList.add("white-pawn");
                peice2dArray[i][j].classList.add("secondMove");

                type = "white";

            } else if (positions[i][j] == 'wp') {
                peice2dArray[i][j].classList.add("white-pawn");
                type = "white";

            } else {
                peice2dArray[i][j].classList.add("empty-square");
            }

            peice2dArray[i][j].classList.add(type);

        }

    }

}

function setPeices() {
    peice.forEach(p => {
        if (p.classList.contains("black-bishop")) {
            p.children[0].src = "images/bishop.png"
        } else if (p.classList.contains("white-bishop")) {
            p.children[0].src = "images/bishopW.png"
        } else if (p.classList.contains("black-knight")) {
            p.children[0].src = "images/knight.png"
        } else if (p.classList.contains("white-knight")) {
            p.children[0].src = "images/knightW.png"
        } else if (p.classList.contains("black-rook")) {
            p.children[0].src = "images/rook.png"
        } else if (p.classList.contains("white-rook")) {
            p.children[0].src = "images/rookW.png"
        } else if (p.classList.contains("black-king")) {
            p.children[0].src = "images/king.png"
        } else if (p.classList.contains("white-king")) {
            p.children[0].src = "images/kingW.png"
        } else if (p.classList.contains("black-queen")) {
            p.children[0].src = "images/queen.png"
        } else if (p.classList.contains("white-queen")) {
            p.children[0].src = "images/queenW.png"
        } else if (p.classList.contains("black-pawn")) {
            p.children[0].src = "images/pawn.png"
        } else if (p.classList.contains("white-pawn")) {
            p.children[0].src = "images/pawnW.png"
        } else if (p.classList.contains("empty-square")) {
            p.children[0].src = "images/empty.png"
        }
    })
}
setPeicesClassControl();
setPeices();



function helpGDMS(i, j, squaresAllowedToMove, type) {


    let againstType = type == "black" ? "white" : "black";
    if (peice2dArray[i][j].classList.contains("empty-square")) {
        squaresAllowedToMove.push(peice2dArray[i][j])
        return 0;
    } else if (peice2dArray[i][j].classList.contains(againstType)) {
        squaresAllowedToMove.push(peice2dArray[i][j]);
        return 1;
    } else if (peice2dArray[i][j].classList.contains(type)) {
        return 1;
    }
}


function giveDiagnolMovementSquares(square, squaresAllowedToMove, row, col) {
    let type = (square.classList.contains("black")) ? "black" : "white";

    for (let i = row - 1, j = col + 1; i >= 0 && j <= 7; --i, ++j) {
        if (helpGDMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
        if (helpGDMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }
    for (let i = row + 1, j = col + 1; i <= 7 && j <= 7; ++i, ++j) {
        if (helpGDMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }
    for (let i = row + 1, j = col - 1; i <= 7 && j >= 0; ++i, --j) {
        if (helpGDMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }

}

function helpGPMS(i, j, squaresAllowedToMove, type) {


    let againstType = type == "black" ? "white" : "black";
    if (peice2dArray[i][j].classList.contains("empty-square")) {
        squaresAllowedToMove.push(peice2dArray[i][j])
        return 0;
    } else if (peice2dArray[i][j].classList.contains(againstType)) {
        squaresAllowedToMove.push(peice2dArray[i][j]);
        return 1;
    } else if (peice2dArray[i][j].classList.contains(type)) {
        return 1;
    }
}

function givePerpendicularMovementSquares(square, squaresAllowedToMove, row, col) {
    let type = (square.classList.contains("black")) ? "black" : "white";

    for (let i = row - 1, j = col; i >= 0; --i) {
        if (helpGPMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }
    for (let i = row, j = col + 1; j <= 7; ++j) {
        if (helpGPMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }
    for (let i = row + 1, j = col; i <= 7; ++i) {
        if (helpGPMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }
    for (let i = row, j = col - 1; j >= 0; --j) {
        if (helpGPMS(i, j, squaresAllowedToMove, type)) {
            break;
        }
    }


}

function giveLshapeMovementSquares(square, squaresAllowedToMove, row, col) {
    let type = (square.classList.contains("black")) ? "white" : "black";

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (i == row - 2 || i == row + 2) {
                if (j == col - 1 || j == col + 1) {
                    if (peice2dArray[i][j].classList.contains(type) || peice2dArray[i][j].classList.contains("empty-square")) {
                        squaresAllowedToMove.push(peice2dArray[i][j]);
                    }
                }
            } else if (i == row + 1 || i == row - 1) {
                if (j == col - 2 || j == col + 2) {
                    if (peice2dArray[i][j].classList.contains(type) || peice2dArray[i][j].classList.contains("empty-square")) {
                        squaresAllowedToMove.push(peice2dArray[i][j]);
                    }
                }
            }
        }

    }
}

function getKingMovement(type, squaresAllowedToMove, row, col) {
    type = (type.slice(0, 5) == "black") ? "white" : "black";

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let check = false;

            if (i == row && j == col - 1) {
                check = true;
            } else if (i == row && j == col + 1) {
                check = true;
            } else if (i == row - 1 && j == col) {
                check = true;
            } else if (i == row - 1 && j == col - 1) {
                check = true;
            } else if (i == row - 1 && j == col + 1) {
                check = true;
            } else if (i == row + 1 && j == col) {
                check = true;
            } else if (i == row + 1 && j == col - 1) {
                check = true;
            } else if (i == row + 1 && j == col + 1) {
                check = true;
            }

            if (check)
                if (peice2dArray[i][j].classList.contains("empty-square") || peice2dArray[i][j].classList.contains(type))
                    squaresAllowedToMove.push(peice2dArray[i][j]);
        }
    }
}

function showPeiceMovement(peiceType, square) {

    resetHighlightSquares();
    squaresAllowedToMove = [];

    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (peice2dArray[i][j] == square) {
                row = i;
                col = j;
            }
        }
    }
    if (peiceType == "black-pawn") {

        if (square.classList.contains("secondMove") === false) {
            firstMove = true;
            if (boardFlipped === false) {
                for (let i = row + 1, j = col; i <= row + 2 && i <= 7; ++i) {
                    if (peice2dArray[i][j].classList.contains("empty-square")) {
                        squaresAllowedToMove.push(peice2dArray[i][j]);
                    } else
                        break;
                }
            } else {
                for (let i = row - 1, j = col; i >= row - 2 && i >= 0; --i) {
                    if (peice2dArray[i][j].classList.contains("empty-square")) {
                        squaresAllowedToMove.push(peice2dArray[i][j]);

                    } else
                        break;
                }
            }

        } else {
            if (boardFlipped == false) {
                if (row + 1 <= 7 && peice2dArray[row + 1][col].classList.contains("empty-square")) {
                    squaresAllowedToMove.push(peice2dArray[row + 1][col]);
                }
            } else {
                if (row - 1 >= 0 && peice2dArray[row - 1][col].classList.contains("empty-square")) {
                    squaresAllowedToMove.push(peice2dArray[row - 1][col]);
                }
            }
        }
        if (boardFlipped == false) {

            if (row + 1 <= 7 && col - 1 >= 0 && peice2dArray[row + 1][col - 1].classList.contains("white")) {
                squaresAllowedToMove.push(peice2dArray[row + 1][col - 1]);
            }
            if (row + 1 <= 7 && col + 1 <= 7 && peice2dArray[row + 1][col + 1].classList.contains("white")) {
                squaresAllowedToMove.push(peice2dArray[row + 1][col + 1]);
            }
        } else {
            if (row - 1 >= 0 && col - 1 >= 0 && peice2dArray[row - 1][col - 1].classList.contains("white")) {
                squaresAllowedToMove.push(peice2dArray[row - 1][col - 1]);
            }
            if (row - 1 >= 0 && col + 1 <= 7 && peice2dArray[row - 1][col + 1].classList.contains("white")) {
                squaresAllowedToMove.push(peice2dArray[row - 1][col + 1]);
            }

        }

        if (boardFlipped == false) {
            if (peice2dArray[row][col - 1] && peice2dArray[row][col - 1].classList.contains("white-pawn")) {
                if (previouspositions[row + 2][col - 1] && previouspositions[row + 2][col - 1] == "wp") {
                    squaresAllowedToMove.push(peice2dArray[row + 1][col - 1]);
                    positions[row + 1][col - 1] = 'ee'


                    isElPasant = true;
                }
            }
            if (peice2dArray[row][col + 1] && peice2dArray[row][col + 1].classList.contains("white-pawn")) {
                if (previouspositions[row + 2][col + 1] && previouspositions[row + 2][col + 1] == "wp") {
                    squaresAllowedToMove.push(peice2dArray[row + 1][col + 1]);
                    positions[row + 1][col + 1] = 'ee'

                    isElPasant = true;
                }
            }
        } else {
            if (peice2dArray[row][col - 1] && peice2dArray[row][col - 1].classList.contains("white-pawn")) {
                if (previouspositions[row - 2][col - 1] && previouspositions[row - 2][col - 1] == "wp") {
                    squaresAllowedToMove.push(peice2dArray[row - 1][col - 1]);
                    positions[row - 1][col - 1] = 'ee'


                    isElPasant = true;
                }
            }
            if (peice2dArray[row][col + 1] && peice2dArray[row][col + 1].classList.contains("white-pawn")) {
                if (previouspositions[row - 2][col + 1] && previouspositions[row - 2][col + 1] == "wp") {
                    squaresAllowedToMove.push(peice2dArray[row - 1][col + 1]);
                    positions[row - 1][col + 1] = 'ee'


                    isElPasant = true;
                }
            }
        }

        checkPeiceMovementValidation();

        squaresAllowedToMove.forEach((s) => {
            if (s.classList.contains("white")) {
                s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"

            } else
                s.style.backgroundColor = "rgba(51, 244, 74, 0.4)";
        })
    } else if (peiceType == "white-pawn") {
        if (square.classList.contains("secondMove") === false) {
            firstMove = true;
            if (boardFlipped === true) {
                for (let i = row + 1, j = col; i <= row + 2 && i <= 7; ++i) {
                    if (peice2dArray[i][j].classList.contains("empty-square")) {
                        squaresAllowedToMove.push(peice2dArray[i][j]);
                    } else
                        break;
                }
            } else {
                for (let i = row - 1, j = col; i >= row - 2 && i >= 0; --i) {
                    if (peice2dArray[i][j].classList.contains("empty-square")) {
                        squaresAllowedToMove.push(peice2dArray[i][j]);

                    } else
                        break;
                }
            }

        } else {
            if (boardFlipped == true) {
                if (row + 1 <= 7 && peice2dArray[row + 1][col].classList.contains("empty-square")) {
                    squaresAllowedToMove.push(peice2dArray[row + 1][col]);
                }
            } else {
                if (row - 1 >= 0 && peice2dArray[row - 1][col].classList.contains("empty-square")) {
                    squaresAllowedToMove.push(peice2dArray[row - 1][col]);
                }
            }
        }
        if (boardFlipped == true) {

            if (row + 1 <= 7 && col - 1 >= 0 && peice2dArray[row + 1][col - 1].classList.contains("black")) {
                squaresAllowedToMove.push(peice2dArray[row + 1][col - 1]);
            }
            if (row + 1 <= 7 && col + 1 <= 7 && peice2dArray[row + 1][col + 1].classList.contains("black")) {
                squaresAllowedToMove.push(peice2dArray[row + 1][col + 1]);
            }
        } else {
            if (row - 1 >= 0 && col - 1 >= 0 && peice2dArray[row - 1][col - 1].classList.contains("black")) {
                squaresAllowedToMove.push(peice2dArray[row - 1][col - 1]);
            }
            if (row - 1 >= 0 && col + 1 <= 7 && peice2dArray[row - 1][col + 1].classList.contains("black")) {
                squaresAllowedToMove.push(peice2dArray[row - 1][col + 1]);
            }

        }
        if (boardFlipped != false) {
            if (peice2dArray[row][col - 1] && peice2dArray[row][col - 1].classList.contains("black-pawn")) {
                if (previouspositions[row + 2][col - 1] && previouspositions[row + 2][col - 1] == "bp") {
                    squaresAllowedToMove.push(peice2dArray[row + 1][col - 1]);
                    positions[row + 1][col - 1] = 'ee'


                    isElPasant = true;
                }
            }
            if (peice2dArray[row][col + 1] && peice2dArray[row][col + 1].classList.contains("black-pawn")) {
                if (previouspositions[row + 2][col + 1] && previouspositions[row + 2][col + 1] == "bp") {
                    squaresAllowedToMove.push(peice2dArray[row + 1][col + 1]);
                    positions[row + 1][col + 1] = 'ee'

                    isElPasant = true;
                }
            }
        } else {
            if (peice2dArray[row][col - 1] && peice2dArray[row][col - 1].classList.contains("black-pawn")) {
                if (previouspositions[row - 2][col - 1] && previouspositions[row - 2][col - 1] == "bp") {
                    squaresAllowedToMove.push(peice2dArray[row - 1][col - 1]);
                    positions[row - 1][col - 1] = 'ee'
                    isElPasant = true;
                }
            }
            if (peice2dArray[row][col + 1] && peice2dArray[row][col + 1].classList.contains("black-pawn")) {
                if (previouspositions[row - 2][col + 1] && previouspositions[row - 2][col + 1] == "bp") {
                    positions[row - 1][col + 1] = 'ee'

                    squaresAllowedToMove.push(peice2dArray[row - 1][col + 1]);
                    isElPasant = true;
                }
            }
        }


        checkPeiceMovementValidation();

        squaresAllowedToMove.forEach((s) => {
            if (s.classList.contains("black")) {
                s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"

            } else
                s.style.backgroundColor = "rgba(51, 244, 74, 0.4)";
        })
    } else if (peiceType == "black-king" || peiceType == "white-king") {

        getKingMovement(peiceType, squaresAllowedToMove, row, col);



        if (square.classList.contains("castlingAllowedWhite")) {
            if (boardFlipped == false) {
                if (positions[row][col + 1] == 'e' && positions[row][col + 2] == 'e' && positions[row][col + 3] == "wr") {
                    squaresAllowedToMove.push(peice2dArray[row][col + 2]);

                    canCastle = true;
                }
                if (positions[row][col - 1] == 'e' && positions[row][col - 2] == 'e' && positions[row][col - 3] == "e" && positions[row][col - 4] == "wr") {
                    squaresAllowedToMove.push(peice2dArray[row][col - 2]);
                    canCastle = true;
                }
            } else {
                if (positions[row][col - 1] == 'e' && positions[row][col - 2] == 'e' && positions[row][col - 3] == "wr") {
                    squaresAllowedToMove.push(peice2dArray[row][col - 2]);
                    canCastle = true;
                }
                if (positions[row][col + 1] == 'e' && positions[row][col + 2] == 'e' && positions[row][col + 3] == "e" && positions[row][col + 4] == "wr") {
                    squaresAllowedToMove.push(peice2dArray[row][col + 2]);
                    canCastle = true;
                }
            }
        } else if (square.classList.contains("castlingAllowedBlack")) {
            if (boardFlipped == false) {
                if (positions[row][col + 1] == 'e' && positions[row][col + 2] == 'e' && positions[row][col + 3] == "br") {
                    squaresAllowedToMove.push(peice2dArray[row][col + 2]);
                    canCastle = true;
                }
                if (positions[row][col - 1] == 'e' && positions[row][col - 2] == 'e' && positions[row][col - 3] == "e" && positions[row][col - 4] == "br") {
                    squaresAllowedToMove.push(peice2dArray[row][col - 2]);
                    canCastle = true;
                }
            } else {
                if (positions[row][col - 1] == 'e' && positions[row][col - 2] == 'e' && positions[row][col - 3] == "br") {
                    squaresAllowedToMove.push(peice2dArray[row][col - 2]);
                    canCastle = true;
                }
                if (positions[row][col + 1] == 'e' && positions[row][col + 2] == 'e' && positions[row][col + 3] == "e" && positions[row][col + 4] == "br") {
                    squaresAllowedToMove.push(peice2dArray[row][col + 2]);
                    canCastle = true;
                }
            }
        }
        checkPeiceMovementValidation();

        squaresAllowedToMove.forEach(s => {
            s.style.backgroundColor = "rgba(51, 244, 74, 0.4)"
            if (peiceType == "white-king") {
                if (s.classList.contains('black'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
            if (peiceType == "black-king") {
                if (s.classList.contains('white'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
        })

    } else if (peiceType == "white-bishop" || peiceType == "black-bishop") {

        giveDiagnolMovementSquares(square, squaresAllowedToMove, row, col);

        checkPeiceMovementValidation();

        squaresAllowedToMove.forEach(s => {
            s.style.backgroundColor = "rgba(51, 244, 74, 0.4)"
            if (peiceType == "white-bishop") {
                if (s.classList.contains('black'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
            if (peiceType == "black-bishop") {
                if (s.classList.contains('white'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
        })

    } else if (peiceType == "white-rook" || peiceType == "black-rook") {

        givePerpendicularMovementSquares(square, squaresAllowedToMove, row, col);

        checkPeiceMovementValidation();

        squaresAllowedToMove.forEach(s => {
            s.style.backgroundColor = "rgba(51, 244, 74, 0.4)"
            if (peiceType == "white-rook") {
                if (s.classList.contains('black'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
            if (peiceType == "black-rook") {
                if (s.classList.contains('white'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
        })

    } else if (peiceType == "white-knight" || peiceType == "black-knight") {

        giveLshapeMovementSquares(square, squaresAllowedToMove, row, col);

        checkPeiceMovementValidation();

        squaresAllowedToMove.forEach(s => {
            s.style.backgroundColor = "rgba(51, 244, 74, 0.4)"
            if (peiceType == "white-knight") {
                if (s.classList.contains('black'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
            if (peiceType == "black-knight") {
                if (s.classList.contains('white'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
        })

    } else if (peiceType == "white-queen" || peiceType == "black-queen") {
        giveDiagnolMovementSquares(square, squaresAllowedToMove, row, col);
        givePerpendicularMovementSquares(square, squaresAllowedToMove, row, col);
        checkPeiceMovementValidation();
        squaresAllowedToMove.forEach(s => {
            s.style.backgroundColor = "rgba(51, 244, 74, 0.4)"
            if (peiceType == "white-queen") {
                if (s.classList.contains('black'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }
            if (peiceType == "black-queen") {
                if (s.classList.contains('white'))
                    s.style.backgroundColor = "rgba(244, 51, 51, 0.611)"
            }

        })
    }
}

let previouspositions = [
    []
];

function checkKingToBishopMovement(rowK, colK, redSquares, peiceMandatory) {
    for (let i = rowK - 1, j = colK + 1; i >= 0 && j <= 7; --i, ++j) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);
        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
    for (let i = rowK - 1, j = colK - 1; i >= 0 && j >= 0; --i, --j) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);

        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
    for (let i = rowK + 1, j = colK + 1; i <= 7 && j <= 7; ++i, ++j) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);

        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
    for (let i = rowK + 1, j = colK - 1; i <= 7 && j >= 0; ++i, --j) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);

        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
}

function checkKingToRookMovement(rowK, colK, redSquares, peiceMandatory) {

    for (let i = rowK - 1, j = colK; i >= 0; --i) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);
        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
    for (let i = rowK, j = colK + 1; j <= 7; ++j) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);
        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
    for (let i = rowK + 1, j = colK; i <= 7; ++i) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);
        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
    for (let i = rowK, j = colK - 1; j >= 0; --j) {
        if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
            redSquares.push(peice2dArray[i][j]);
        }
        if (peice2dArray[i][j].classList.contains("empty-square") === false) {
            break;
        }
    }
}

function checkKingToKnightMovement(rowK, colK, redSquares, peiceMandatory) {
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (i == rowK - 2 || i == rowK + 2) {
                if (j == colK - 1 || j == colK + 1) {
                    if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
                        redSquares.push(peice2dArray[i][j]);
                    }
                }
            } else if (i == rowK + 1 || i == rowK - 1) {
                if (j == colK - 2 || j == colK + 2) {
                    if (peice2dArray[i][j].classList.contains(peiceMandatory)) {
                        redSquares.push(peice2dArray[i][j]);
                    }
                }
            }
        }

    }

}

function checkKingToKingMovement(rowK, colK, redSquares, peiceMandatory) {
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            let check = false;

            if (i == rowK && j == colK - 1) {
                check = true;
            } else if (i == rowK && j == colK + 1) {
                check = true;
            } else if (i == rowK - 1 && j == colK) {
                check = true;
            } else if (i == rowK - 1 && j == colK - 1) {
                check = true;
            } else if (i == rowK - 1 && j == colK + 1) {
                check = true;
            } else if (i == rowK + 1 && j == colK) {
                check = true;
            } else if (i == rowK + 1 && j == colK - 1) {
                check = true;
            } else if (i == rowK + 1 && j == colK + 1) {
                check = true;
            }

            if (check)
                if (peice2dArray[i][j].classList.contains(peiceMandatory))
                    redSquares.push(peice2dArray[i][j]);
        }
    }
}

function checkKingToPawnMovement(rowK, colK, redSquares, peiceMandatory) {

    if (boardFlipped == false) {
        if (peice2dArray[rowK][colK].classList.contains("white-king")) {
            if (peice2dArray[rowK - 1][colK + 1] && peice2dArray[rowK - 1][colK + 1].classList.contains("black-pawn"))
                redSquares.push(peice2dArray[rowK - 1][colK + 1]);
            else if (peice2dArray[rowK - 1][colK - 1] && peice2dArray[rowK - 1][colK - 1].classList.contains("black-pawn"))
                redSquares.push((peice2dArray[rowK - 1][colK - 1]))
        } else if (peice2dArray[rowK][colK].classList.contains("black-king")) {
            if (peice2dArray[rowK + 1][colK + 1] && peice2dArray[rowK + 1][colK + 1].classList.contains("white-pawn"))
                redSquares.push(peice2dArray[rowK + 1][colK + 1]);
            else if (peice2dArray[rowK + 1][colK - 1] && peice2dArray[rowK + 1][colK - 1].classList.contains("white-pawn"))
                redSquares.push((peice2dArray[rowK + 1][colK - 1]))
        }

    } else {
        if (peice2dArray[rowK][colK].classList.contains("white-king")) {
            if (peice2dArray[rowK + 1][colK + 1] && peice2dArray[rowK + 1][colK + 1].classList.contains("black-pawn"))
                redSquares.push(peice2dArray[rowK + 1][colK + 1]);
            else if (peice2dArray[rowK + 1][colK - 1] && peice2dArray[rowK + 1][colK - 1].classList.contains("black-pawn"))
                redSquares.push((peice2dArray[rowK + 1][colK - 1]))
        } else if (peice2dArray[rowK][colK].classList.contains("black-king")) {
            if (peice2dArray[rowK - 1][colK + 1] && peice2dArray[rowK - 1][colK + 1].classList.contains("white-pawn"))
                redSquares.push(peice2dArray[rowK - 1][colK + 1]);
            else if (peice2dArray[rowK - 1][colK - 1] && peice2dArray[rowK - 1][colK - 1].classList.contains("white-pawn"))
                redSquares.push((peice2dArray[rowK - 1][colK - 1]))
        }
    }
}

function checkKingPositionAndOperateAccordingly(type, index) {
    let rowKing, colKing;
    let king = type === "black" ? 'bK' : 'wK';
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (positions[i][j] == king || positions[i][j].slice(1) == king) {
                rowKing = i;
                colKing = j;
            }
        }
    }
    let redSquares = [];
    let bishop = type !== "black" ? 'black-bishop' : 'white-bishop';
    let rook = type !== "black" ? 'black-rook' : 'white-rook';
    let queen = type !== "black" ? 'black-queen' : 'white-queen';
    let knight = type !== "black" ? 'black-knight' : 'white-knight';
    let pawn = type !== "black" ? 'black-pawn' : 'white-pawn';
    let kingPeice = type !== "black" ? 'black-king' : 'white-king';

    checkKingToBishopMovement(rowKing, colKing, redSquares, bishop);
    checkKingToRookMovement(rowKing, colKing, redSquares, rook);
    checkKingToBishopMovement(rowKing, colKing, redSquares, queen);
    checkKingToRookMovement(rowKing, colKing, redSquares, queen);
    checkKingToKnightMovement(rowKing, colKing, redSquares, knight);
    checkKingToPawnMovement(rowKing, colKing, redSquares, pawn);
    checkKingToKingMovement(rowKing, colKing, redSquares, kingPeice);
    if (redSquares.length > 0) {

        squaresAllowedToMove.splice(index, 1);
        return true;
    } else
        return false;
}

function checkPeiceMovementValidation() {
    let type = peice2dArray[row][col].classList.contains("black") ? "black" : "white";
    let previousPositionToCheck = [
        []
    ];
    positions.forEach((o, i) => {
        previousPositionToCheck[i] = [...o]
    });
    for (let i = 0; i < squaresAllowedToMove.length; ++i) {

        previousPositionToCheck.forEach((o, i) => {
            positions[i] = [...o]
        });
        let row1, col1;
        for (let k = 0; k < 8; ++k) {
            for (let j = 0; j < 8; ++j) {
                if (peice2dArray[k][j] == squaresAllowedToMove[i]) {
                    row1 = k;
                    col1 = j;
                }
            }
        }

        positions[row1][col1] = positions[row][col];
        positions[row][col] = 'e';
        setPeicesClassControl();
        if (checkKingPositionAndOperateAccordingly(type, i) === true)
            i--;
    }
    previousPositionToCheck.forEach((o, i) => {
        positions[i] = [...o]
    });
    setPeicesClassControl();
    if (squaresAllowedToMove.length != 0) {
        isMate = false;
    }

}

function isStaleMate() {

    let type;
    if (turn == 1)
        type = "black";
    else
        type = "whitte"
    let rowKing, colKing;
    let king = type === "black" ? 'bK' : 'wK';
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (positions[i][j] == king || positions[i][j].slice(1) == king) {
                rowKing = i;
                colKing = j;
            }
        }
    }
    let redSquares = [];
    let bishop = type !== "black" ? 'black-bishop' : 'white-bishop';
    let rook = type !== "black" ? 'black-rook' : 'white-rook';
    let queen = type !== "black" ? 'black-queen' : 'white-queen';
    let knight = type !== "black" ? 'black-knight' : 'white-knight';
    let pawn = type !== "black" ? 'black-pawn' : 'white-pawn';
    let kingPeice = type !== "black" ? 'black-king' : 'white-king';

    checkKingToBishopMovement(rowKing, colKing, redSquares, bishop);
    checkKingToRookMovement(rowKing, colKing, redSquares, rook);
    checkKingToBishopMovement(rowKing, colKing, redSquares, queen);
    checkKingToRookMovement(rowKing, colKing, redSquares, queen);
    checkKingToKnightMovement(rowKing, colKing, redSquares, knight);
    checkKingToPawnMovement(rowKing, colKing, redSquares, pawn);
    checkKingToKingMovement(rowKing, colKing, redSquares, kingPeice);
    if (redSquares.length > 0)
        return false;
    else return true;
}

function controlCheckMate() {
    isMate = true;
    if (turn == 1) {
        peiceArray.forEach(square => {
            let click;
            if (square.classList.contains("black")) {
                if (square.classList.contains("black-bishop"))
                    click = "black-bishop";
                else if (square.classList.contains("black-knight"))
                    click = "black-knight";
                else if (square.classList.contains("black-king"))
                    click = "black-king";
                else if (square.classList.contains("black-queen"))
                    click = "black-queen";
                else if (square.classList.contains("black-rook"))
                    click = "black-rook";
                else if (square.classList.contains("black-pawn"))
                    click = "black-pawn";

                else
                    click = "empty-square"
                showPeiceMovement(click, square);
            }
        })
        resetHighlightSquares();
        if (isMate == true) {
            if (isStaleMate() == true) {
                document.querySelector(".winner").textContent = "";
                document.querySelector(".checkMateText").textContent = "STALE MATE!";

            } else {
                document.querySelector(".winner").textContent = "White wins";
                document.querySelector(".checkMateText").textContent = "CHECK MATE!";

            }
            displayCheckMate();
        }
    } else {
        peiceArray.forEach(square => {
            let click;

            if (square.classList.contains("white")) {

                if (square.classList.contains("white-bishop"))
                    click = "white-bishop";
                else if (square.classList.contains("white-knight"))
                    click = "white-knight";
                else if (square.classList.contains("white-king"))
                    click = "white-king";
                else if (square.classList.contains("white-queen"))
                    click = "white-queen";
                else if (square.classList.contains("white-rook"))
                    click = "white-rook";
                else if (square.classList.contains("white-pawn"))
                    click = "white-pawn";
                else
                    click = "empty-square"
                showPeiceMovement(click, square);
            }
        })
        resetHighlightSquares();
        if (isMate == true) {
            if (isStaleMate() == true) {
                document.querySelector(".winner").textContent = "";
                document.querySelector(".CheckMateText").textContent = "STALE MATE!";

            } else {
                document.querySelector(".winner").textContent = "Black wins";
                document.querySelector(".CheckMateText").textContent = "CHECK MATE!";

            }
            displayCheckMate();
        }
    }
    isMate = false;
    firstMove = false;
    canCastle = false;
}

function controlPromotion(clicked) {

    if (peice2dArray[rowPromoted][colPromoted].classList.contains("white")) {
        clicked = 'w' + promotedPeice.slice(0, 1);
    } else {
        clicked = 'b' + promotedPeice.slice(0, 1);
    }
    positions[rowPromoted][colPromoted] = clicked
    setPeicesClassControl();
    setPeices();
}

function displayPromotionModal(type) {
    document.querySelector(".promotionModal").classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("none");
    if (type == "white") {
        for (let i = 0; i < modals.length; ++i) {
            modals[i].children[0].src = `images/${modals[i].classList[0]}W.png`;
        }
    } else {
        for (let i = 0; i < modals.length; ++i) {
            modals[i].children[0].src = `images/${modals[i].classList[0]}.png`;
        }

    }

}

function removePromotionModal(type) {
    document.querySelector(".promotionModal").classList.add("hidden");
    document.querySelector(".overlay").classList.add("none");

}

function displayCheckMate() {
    document.querySelector(".checkMateModal").classList.remove("none");
    document.querySelector(".overlay").classList.remove("none");
}

function removeCheckMateModal() {
    document.querySelector(".checkMateModal").classList.add("none");
    document.querySelector(".overlay").classList.add("none");
}

function checkPawnAdvancement(row1, col1) {
    let type = peice2dArray[row1][col1].classList.contains("white") === true ? "white" : "black";
    rowPromoted = row1;
    colPromoted = col1;
    if (boardFlipped != true) {
        if (row1 == 0 && type == "white") {
            if (positions[row1][col1] == 'swp')
                displayPromotionModal("white", row1, col1);
        }
        if (row1 == 7 && type == "black") {
            if (positions[row1][col1] == 'sbp')
                displayPromotionModal("black", row1, col1);
        }
    } else {
        if (row1 == 7 && type == "white") {
            if (positions[row1][col1] == 'swp')
                displayPromotionModal("white", row1, col1);
        }
        if (row1 == 0 && type == "black") {
            if (positions[row1][col1] == 'sbp')
                displayPromotionModal("black", row1, col1);
        }
    }


}

function controlPeiceMovement(peiceType, square) {
    let flag = false;
    squaresAllowedToMove.forEach((s) => {
        if (s == square)
            flag = true;
    })
    if (flag) {
        positions.forEach((o, i) => {
            previouspositions[i] = [...o]
        })
        let row1, col1;
        for (let i = 0; i < 8; ++i)
            for (let j = 0; j < 8; ++j) {
                if (peice2dArray[i][j] == square) {
                    row1 = i;
                    col1 = j;
                }
            }
        console.log(isElPasant);
        if (canCastle == true && (col - col1 == 2 || col - col1 == -2)) {
            positions[row1][col1] = positions[row][col].slice(1);
            positions[row][col] = 'e';

            if (positions[row1][col1 + 2] && positions[row1][col1 + 2].slice(1) == 'r') {
                let temp = positions[row1][col1 - 1];
                positions[row1][col1 - 1] = positions[row1][col1 + 2]
                positions[row1][col1 + 2] = temp;
            } else if (positions[row1][col1 - 2] && positions[row1][col1 - 2].slice(1) == 'r') {
                let temp = positions[row1][col1 + 1];
                positions[row1][col1 + 1] = positions[row1][col1 - 2]
                positions[row1][col1 - 2] = temp;
            } else {
                let temp = positions[row1][col1 - 1];
                positions[row1][col1 - 1] = positions[row1][col1 + 1]
                positions[row1][col1 + 1] = temp;
            }
            castlingSound.play();
        } else {
            if (positions[row1][col1] != 'e')
                chessPeiceCapture.play();
            else
                chessPeiceSound.play();


            if (firstMove == true) {
                if (positions[row][col] == "bp") {
                    positions[row1][col1] = 'sbp';
                } else {
                    positions[row1][col1] = 'swp';
                }
                positions[row][col] = 'e';
            } else if (isElPasant === true && positions[row1][col1] == 'ee') {
                if (boardFlipped == false) {
                    if (peice2dArray[row][col].classList.contains("white")) {
                        positions[row1][col1] = positions[row][col];
                        positions[row][col] = positions[row1 + 1][col1] = "e";
                    } else {
                        positions[row1][col1] = positions[row][col];
                        positions[row][col] = positions[row1 - 1][col1] = "e";
                    }
                } else {
                    if (peice2dArray[row][col].classList.contains("black")) {
                        positions[row1][col1] = positions[row][col];
                        positions[row][col] = positions[row1 + 1][col1] = "e";
                    } else {
                        positions[row1][col1] = positions[row][col];
                        positions[row][col] = positions[row1 - 1][col1] = "e";
                    }
                }
                isElPasant = false;

            } else {
                if (positions[row][col] == 'cbK' || positions[row][col] == 'cwK') {
                    positions[row1][col1] = positions[row][col].slice(1);

                } else {
                    positions[row1][col1] = positions[row][col];
                }
                positions[row][col] = 'e';
            }
        }
        preventDoubleUndoClick = 1;
        firstMove = false;
        canCastle = false;
        setPeicesClassControl();
        setPeices();
        checkPawnAdvancement(row1, col1);
        resetHighlightSquares();
        clickedPeice = false;
        turn = turn == 1 ? 0 : 1;
        controlCheckMate();
        // writeUserData();


    } else {
        firstMove = false;
        canCastle = false;
        resetHighlightSquares();
        clickedPeice = false;

        if (turn == 1 && clicked.slice(0, 5) == "black")
            showPeiceMovement(peiceType, square);
        else if (turn == 0 && clicked.slice(0, 5) == "white")
            showPeiceMovement(peiceType, square);
        clickedPeice = true;
    }

}
let firstClick = false;

peiceArray.forEach(p => {


    p.addEventListener("click", (e) => {

        let square = e.target.closest("div");
        if (square.classList.contains("black-bishop"))
            clicked = "black-bishop";
        else if (square.classList.contains("black-knight"))
            clicked = "black-knight";
        else if (square.classList.contains("black-king"))
            clicked = "black-king";
        else if (square.classList.contains("black-queen"))
            clicked = "black-queen";
        else if (square.classList.contains("black-rook"))
            clicked = "black-rook";
        else if (square.classList.contains("black-pawn"))
            clicked = "black-pawn";
        else if (square.classList.contains("white-bishop"))
            clicked = "white-bishop";
        else if (square.classList.contains("white-knight"))
            clicked = "white-knight";
        else if (square.classList.contains("white-king"))
            clicked = "white-king";
        else if (square.classList.contains("white-queen"))
            clicked = "white-queen";
        else if (square.classList.contains("white-rook"))
            clicked = "white-rook";
        else if (square.classList.contains("white-pawn"))
            clicked = "white-pawn";
        else
            clicked = "empty-square"


        if (clickedPeice == true) {
            controlPeiceMovement(clicked, square);
        } else {
            if (turn == 0 && clicked.slice(0, 5) == "white") {
                showPeiceMovement(clicked, square);
                clickedPeice = true;
            } else if (turn == 1 && clicked.slice(0, 5) == "black") {
                showPeiceMovement(clicked, square);
                clickedPeice = true;
            }


        }
        if (clickedPeice == true && clicked == "empty-square") {
            clickedPeice = false;
        }
    })
})

document.querySelector(".flip-peices").addEventListener("click", () => {
    images.forEach(image => {
        if (peiceFlipped === false)
            image.style.transform = "rotateX(180deg)"
        else
            image.style.transform = "rotateX(0deg)"
    })
    peiceFlipped = peiceFlipped ? false : true;

})
let controlBoardFlipping = () => {
    boardFlipped = boardFlipped ? false : true;
    positions.forEach(p => {
        p.reverse();
    })
    positions.reverse();
    setPeicesClassControl();
    setPeices();
    resetHighlightSquares();
}
document.querySelector(".flip-board").addEventListener("click", controlBoardFlipping)
document.querySelector(".undo").addEventListener("click", () => {
    if (preventDoubleUndoClick == 1) {
        previouspositions.forEach((o, i) => {
            positions[i] = [...o]
        })
        turn = turn == 1 ? 0 : 1;
        preventDoubleUndoClick = 0;
        setPeicesClassControl();
        setPeices();
        resetHighlightSquares();
    }
})

document.querySelector(".newGame").addEventListener("click", () => {
    positions = [
        ['br', 'bk', 'bb', 'bq', 'cbK', 'bb', 'bk', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wk', 'wb', 'wq', 'cwK', 'wb', 'wk', 'wr'],
    ]
    turn = 0;
    //writeUserData();
    setPeicesClassControl();
    setPeices();
    displayCheckMate();
    removeCheckMateModal();


})

// import {
//     initializeApp
// } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
// import {
//     getDatabase,
//     ref,
//     set,
//     onValue,
//     update
// } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
// import {
//     getAnalytics
// } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-analytics.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//     apiKey: "AIzaSyA-O1A5dNGakWMMkMrkVZMNJ3qGMbWSJF0",
//     authDomain: "chess-database-c3d4e.firebaseapp.com",
//     projectId: "chess-database-c3d4e",
//     storageBucket: "chess-database-c3d4e.appspot.com",
//     messagingSenderId: "840319454496",
//     appId: "1:840319454496:web:7c6d5a427e4c1d03665b45",
//     measurementId: "G-EZ7HVY2P7G"
// };
// let choice = prompt("Which peice do you want to play: ");
// if (choice == "black")
// {
//     boardFlipped == true;
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const userId = "zaki";

// function writeUserData() {
//     if (boardFlipped === true) {
//         controlBoardFlipping();

//     }
//     console.log(positions);
//     update(ref(database, 'users/' + userId), {
//             positionOfGame: positions,
//             playerTurn: turn,
//         }).then(() => {
//             // Data saved successfully!
//             console.log("dataSubmitted");
//         })
//         .catch((error) => {
//             // The write failed...
//             console.log("data failed");
//         });
//     if (boardFlipped === true) {
//         controlBoardFlipping();
//     }
// }
// document.querySelector(".loadGame").addEventListener("click", () => {



//     const starCountRef = ref(database, 'users/' + userId);
//     onValue(starCountRef, (snapshot) => {
//         setTimeout(() => {
//             positions = snapshot.val().positionOfGame;
//             turn = snapshot.val().playerTurn;
//             if (boardFlipped === true) {
//                 controlBoardFlipping();
//             }
//             setPeicesClassControl();
//             setPeices();
//         }, 1);
//         positions = snapshot.val().positionOfGame;
//     });

// })
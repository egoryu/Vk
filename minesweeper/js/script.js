class Cell {
    constructor(flag, value, signs) {
        this.flag = flag;
        this.value = value;
        this.signs = signs;
    }
}

let intervalId;
let time = 0;
let mines;
let countOfMines;
let countOfFlags;
let allTile;
let loseFlag = 0;
let first = 1;
let field = [];
let animField = ["tile-open", "tile-one", "tile-two", "tile-three", "tile-four",
                    "tile-five", "tile-six", "tile-seven", "tile-eight",
                    "mine-open", "mine-red", "mine-hit"];
let animFlag = ["tile-close", "flag", "ask-close"];
let animSmile = ["happy", "scare", "cool", "dead"];
let animTime = ["zero", "one", "two", "three", "four",
                    "five", "six", "seven", "eight", "nine"];

let start = document.getElementById("field");

function initial(id) {
    countOfMines = 40;
    countOfFlags = 40;
    allTile = 16 * 16;
    first = 1;
    time = 0;
    loseFlag = 0;
    field = [];
    mines = [];

    for (let x = 0; x < 16; x++) {
        field[x] = [];
        for (let y = 0; y < 16; y++) {
            field[x][y] = new Cell(0, 0, 0);
        }
    }

    getMines(id)
    countMine();
    setSmile(0);
    updateFlags();
}

function draw() {
    while (start.firstChild) {
        start.removeChild(start.firstChild);
    }

    for (let x = 0; x < 16; x++) {
        let div1 = document.createElement('div');
        div1.className = "row";
        start.append(div1);
        for (let y = 0; y < 16; y++) {
            let div2 = document.createElement('div');
            div2.className = "minesweeper field tile-close";
            div2.id = "cell-" + (x * 16 + y);
            div2.addEventListener('click', function () {
                let id = Number(div2.id.substring(5)),
                x = Math.floor(id / 16),
                y = id % 16;

                if (first) {
                    initial(id);
                    intervalId = setInterval(updateTime, 1000);
                    first = 0;
                }

                if (!loseFlag && (field[x][y].signs === 0 || field[x][y].signs === 2)) {
                    openAll(x, y);
                } else {
                    return;
                }

                if (loseFlag) {
                    setSmile(3);
                    openAllMines();
                    checkFlags();
                    clearInterval(intervalId);
                }
                if (countOfMines === 0) {
                    setSmile(2)
                    loseFlag = 1;
                    clearInterval(intervalId);
                    openAllCloseTile();
                }
            }, false);

            div2.addEventListener('contextmenu', function (e) {
                let id = Number(div2.id.substring(5)),
                    x = Math.floor(id / 16),
                    y = id % 16;

                if (first || field[x][y].flag || loseFlag) {
                    e.preventDefault();
                    return;
                }

                if (field[x][y].value === 9 && field[x][y].signs === 0) {
                    countOfMines--;
                } else if (field[x][y].value === 9 && field[x][y].signs === 1) {
                    countOfMines++;
                }

                if (field[x][y].signs === 0) {
                    countOfFlags--;
                } else if (field[x][y].signs === 1) {
                    countOfFlags++;
                }

                field[x][y].signs = (field[x][y].signs + 1) % 3;

                drawFlag(x, y);
                updateFlags();

                if (countOfMines === 0) {
                    setSmile(2)
                    loseFlag = 1;
                    clearInterval(intervalId);
                    openAllCloseTile();
                }

                e.preventDefault();
            }, false);

            div1.append(div2);
        }
    }
}

function openAll(x, y) {
    let div = document.getElementById("cell-" + (x * 16 + y));

    if (field[x][y].value === 9) {
        div.className = "minesweeper field " + animField[10];
        field[x][y].flag = 1;
        field[x][y].value = 10;
        loseFlag = 1;
    }
    else {
        div.className = "minesweeper field " + animField[field[x][y].value];
    }

    field[x][y].flag = 1;
    allTile--;

    if (field[x][y].value === 0) {
        if (x > 0 && field[x - 1][y].flag === 0 && field[x - 1][y].signs === 0) {
            openAll(x - 1, y);
        }
        if (y > 0 && field[x][y - 1].flag === 0 && field[x][y - 1].signs === 0) {
            openAll(x, y - 1);
        }
        if (x < 15 && field[x + 1][y].flag === 0 && field[x + 1][y].signs === 0) {
            openAll(x + 1, y);
        }
        if (y < 15 && field[x][y + 1].flag === 0 && field[x][y + 1].signs === 0) {
            openAll(x, y + 1);
        }
        if (x > 0 && y > 0 && field[x - 1][y - 1].flag === 0 && field[x - 1][y - 1].signs === 0) {
            openAll(x - 1, y - 1);
        }
        if (x > 0 && y < 15 && field[x - 1][y + 1].flag === 0 && field[x - 1][y + 1].signs === 0) {
            openAll(x - 1, y + 1);
        }
        if (x < 15 && y > 0 && field[x + 1][y - 1].flag === 0 && field[x + 1][y - 1].signs === 0) {
            openAll(x + 1, y - 1);
        }
        if (x < 15 && y < 15 && field[x + 1][y + 1].flag === 0 && field[x + 1][y + 1].signs === 0) {
            openAll(x + 1, y + 1);
        }
    }
}

function openAllMines() {
    for (let i of mines) {
        let x = Math.floor(i / 16), y = i % 16;
         if (field[x][y].signs !== 1 && field[x][y].value !== 10) {
             let div = document.getElementById("cell-" + i);
             div.className = "minesweeper field " + animField[9];
         }
    }
}

function checkFlags() {
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            if (field[x][y].value !== 9 && field[x][y].signs === 1) {
                let div = document.getElementById("cell-" + (x * 16 + y));
                div.className = "minesweeper field " + animField[11];
            }
        }
    }
}

function openAllCloseTile() {
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            if (field[x][y].flag === 0 && field[x][y].signs !== 1) {
                let div = document.getElementById("cell-" + (x * 16 + y));
                div.className = "minesweeper field " + animField[field[x][y].value];
            }
        }
    }
}

function drawFlag(x, y) {
    let div = document.getElementById("cell-" + (x * 16 + y));
    div.className = "minesweeper field " + animFlag[field[x][y].signs];
}

function getMines(cur) {
    mines = [];
    while (mines.length < 40) {
        let n = Math.floor(Math.random() * 256);
        if ((n === cur) || mines.includes(n)) {
            continue;
        }
        mines.push(n);
    }
}

function countMine() {
    for (let i = 0; i < mines.length; i++) {
        let x = Math.floor(mines[i] / 16), y = mines[i] % 16;

        if (x > 0 && y > 0 && field[x - 1][y - 1].value !== 9) {
            field[x - 1][y - 1].value++;
        }
        if (x > 0  && field[x - 1][y].value !== 9) {
            field[x - 1][y].value++;
        }
        if (x > 0 && y < 15 && field[x - 1][y + 1].value !== 9) {
            field[x - 1][y + 1].value++;
        }
        if (y > 0 && field[x][y - 1].value !== 9) {
            field[x][y - 1].value++;
        }
        if (y < 15 && field[x][y + 1].value !== 9) {
            field[x][y + 1].value++;
        }
        if (x < 15 && y > 0 && field[x + 1][y - 1].value !== 9) {
            field[x + 1][y - 1].value++;
        }
        if (x < 15 && field[x + 1][y].value !== 9) {
            field[x + 1][y].value++;
        }
        if (x < 15 && y < 15 && field[x + 1][y + 1].value !== 9) {
            field[x + 1][y + 1].value++;
        }

        field[x][y].value = 9;
    }

}

function setSmile(i) {
    let div = document.getElementById("smile");
    div.className = "minesweeper smile " + animSmile[i];
}

function updateFlags() {
    let flag = countOfFlags;

    if (flag > 999) {
        flag = 999;
    }

    if (flag < 0) {
        flag = 0;
    }

    let div1 = document.getElementById("flag-1"),
        div2 = document.getElementById("flag-2"),
        div3 = document.getElementById("flag-3");
    div1.className = "minesweeper clock " + animTime[Math.floor(flag / 100)];
    div2.className = "minesweeper clock " + animTime[Math.floor(flag / 10)];
    div3.className = "minesweeper clock " + animTime[Math.floor(flag % 10)];
}

function updateTime() {
    time++;
    let t = time;

    if (t > 999) {
        t = 999;
    }

    if (t < 0) {
        t = 0;
    }

    let div1 = document.getElementById("time-1"),
        div2 = document.getElementById("time-2"),
        div3 = document.getElementById("time-3");
    div1.className = "minesweeper clock " + animTime[Math.floor(t / 100)];
    div2.className = "minesweeper clock " + animTime[Math.floor(t / 10)];
    div3.className = "minesweeper clock " + animTime[Math.floor(t % 10)];
}

document.getElementById("smile").addEventListener("click", function () {
    initial();
    clearInterval(intervalId);
    time = -1;
    updateTime();
    draw();
});

start.addEventListener('mousedown', function () {
    setSmile(1);
});

start.addEventListener('mouseup', function () {
    setSmile(0);
});

initial();
draw();
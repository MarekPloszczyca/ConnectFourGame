const rulesBtn = document.getElementById("rules-button");
const vsPlayerBtn = rulesBtn.previousElementSibling;
const vsBotBtn = vsPlayerBtn.previousElementSibling;
const content = document.querySelector("main");
const rules = document.getElementById("rules");
const rulesCloser = document.getElementById("back-icon");
const menuBtn = document.getElementById("in-game-grid-1");
const restartBtn = document.getElementById("in-game-grid-3");
const board = document.getElementById("board");
const game = document.querySelector("section");
const timer = document.querySelector(".timer");

let columns = [[], [], [], [], [], [], []];
let redSpots = [];
let yellowSpots = [];
let turnCounter = 0;
let time = 0;
let automaticRow = 1;

const setIntervalHandler = () => {
  if (time === 0) {
    time = 31;
    const interval = setInterval(() => {
      time--;
      timer.textContent = time;

      if (time === 0) {
        automaticFillBoardHandler();
        clearInterval(interval);
      }
    }, 1000);
  } else time = 31;
};

const loadBoardHandler = () => {
  if (board.childElementCount !== 42) {
    for (let i = 0; i < 42; i++) {
      const place = document.createElement("div");
      place.className = "spot";
      board.appendChild(place);
      place.addEventListener("click", vsBotFillBoardHandler);
      columns[i % 7].push(place);
    }
  }
  timer.textContent = time;

  setIntervalHandler();
};

const vsPlayerFillBoardHandler = (evt) => {
  for (const column of columns) {
    if (column.includes(evt.target)) {
      let freeSpots = column.filter(
        (spot) =>
          spot.className !== "spot red-spot" &&
          spot.className !== "spot yellow-spot"
      );
      let recent = freeSpots[freeSpots.length - 1];
      if (freeSpots.length === 0) {
        return;
      }
      if (turnCounter % 2 === 0) {
        recent.classList.add("red-spot");
        redSpots.unshift([freeSpots.indexOf(recent), columns.indexOf(column)]);
        columnResultHandler(
          redSpots.filter((spots) => spots[1] === redSpots[0][1]),
          "Red"
        );
        rowResultHandler(
          redSpots.filter((spots) => spots[0] === redSpots[0][0]),
          "Red"
        );
        horizontalResultHandler(redSpots, "Red");
      } else {
        recent.classList.add("yellow-spot");
        yellowSpots.unshift([
          freeSpots.indexOf(recent),
          columns.indexOf(column),
        ]);
        columnResultHandler(
          yellowSpots.filter((spots) => spots[1] === yellowSpots[0][1]),
          "Yellow"
        );
        rowResultHandler(
          yellowSpots.filter((spots) => spots[0] === yellowSpots[0][0]),
          "Yellow"
        );
        horizontalResultHandler(yellowSpots, "Yellow");
      }
      turnCounter++;
    }
  }

  setIntervalHandler();
};

const vsBotFillBoardHandler = (evt) => {
  const botTime = Math.floor(Math.random() * 30000) ;
  vsPlayerFillBoardHandler(evt),
  setTimeout(() => {
    automaticFillBoardHandler()
  }, botTime)
}

const automaticFillBoardHandler = () => {
  let counter = 0;
  for (let i = 1; i <= automaticRow * 7; i++) {
    if (board.children[board.children.length - i].className === "spot") {
      counter++;
    }
  }
  if (counter === 0) {
    automaticRow++;
  }
  let number = Math.floor(Math.random() * automaticRow * 7) + 1;

  if (board.children[board.children.length - number].className !== "spot") {
    return automaticFillBoardHandler();
  } else {
    if (turnCounter % 2 === 0) {
      board.children[board.children.length - number].classList.add("red-spot");
      setIntervalHandler();
      redSpots.unshift([6 - automaticRow, 7 * automaticRow - number]);
      columnResultHandler(
        redSpots.filter((spots) => spots[1] === redSpots[0][1]),
        "Red"
      );
      rowResultHandler(
        redSpots.filter((spots) => spots[0] === redSpots[0][0]),
        "Red"
      );
      horizontalResultHandler(redSpots, "Red");
    } else {
      board.children[board.children.length - number].classList.add(
        "yellow-spot"
      );
      setIntervalHandler();
      yellowSpots.unshift([6 - automaticRow, 7 * automaticRow - number]);
      columnResultHandler(
        yellowSpots.filter((spots) => spots[1] === yellowSpots[0][1]),
        "Yellow"
      );
      rowResultHandler(
        yellowSpots.filter((spots) => spots[0] === yellowSpots[0][0]),
        "Yellow"
      );
      horizontalResultHandler(yellowSpots, "Yellow");
    }
  }
  turnCounter++;
};

const columnResultHandler = (color, winner) => {
  let columnCounter = 0;
  let recent = color[0][0];
  if (color.length < 4) {
    return;
  } else {
    for (let i = 0; i <= 3; i++) {
      if (color.some((color) => color[0] === recent + i)) {
        columnCounter++;
      }
    }
    columnCounter === 4 ? alert(`${winner} player won!`) : (columnCounter = 0);
  }
};

const rowResultHandler = (color, winner) => {
  let rowCounter = 0;
  let recent = color[0][1];
  if (color.length < 4) {
    return;
  }
  for (let l = 0; l <= 3; l++) {
    for (let i = 0; i <= 3; i++) {
      if (color.some((color) => color[1] === recent - l + i)) {
        rowCounter++;
      }
    }
    rowCounter === 4 ? alert(`${winner} player won!`) : (rowCounter = 0);
  }
};

const horizontalResultHandler = (color, winner) => {
  let horizontalCounter = 0;
  let recent = color[0];
  if (color.length < 4) {
    return;
  }
  for (let l = 0; l <= 3; l++) {
    for (let i = 0; i <= 3; i++) {
      if (
        color.some(
          (color) =>
            color[0] + i === recent[0] + l && color[1] + i === recent[1] + l
        )
      ) {
        horizontalCounter++;
      }
    }
    if (horizontalCounter === 4) {
      return alert(`${winner} player won`);
    } else horizontalCounter = 0;
  }
  for (let l = 0; l <= 3; l++) {
    for (let i = 0; i <= 3; i++) {
      if (
        color.some(
          (color) =>
            color[0] - i === recent[0] - l && color[1] + i === recent[1] + l
        )
      ) {
        horizontalCounter++;
      }
    }
    if (horizontalCounter === 4) {
      return alert(`${winner} player won`);
    } else horizontalCounter = 0;
  }
};

function visibilityHandler() {
  getComputedStyle(this).display === "block"
    ? (this.style.display = "none")
    : (this.style.display = "block");
}

const rulesOpener = () => {
  visibilityHandler.call(content);
  visibilityHandler.call(rules);
};
const backToMenu = () => {
  if (rules.style.display == "block") {
    visibilityHandler.call(rules);
    visibilityHandler.call(content);
  }
  if (game.style.display == "block") {
    visibilityHandler.call(game);
    visibilityHandler.call(content);
    restartHandler();
  }
};
const gameOpener = () => {
  loadBoardHandler();
  visibilityHandler.call(content);
  visibilityHandler.call(game);
};

const restartHandler = () => {
  board.replaceChildren("");
  columns = [[], [], [], [], [], [], []];
  yellowSpots = [];
  redSpots = [];
  turnCounter = 0;
  automaticRow = 1;
  loadBoardHandler();
  setIntervalHandler();
};

rulesBtn.addEventListener("click", rulesOpener);
rulesCloser.addEventListener("click", backToMenu);
vsPlayerBtn.addEventListener("click", gameOpener);
vsBotBtn.addEventListener("click", gameOpener);
menuBtn.addEventListener("click", backToMenu);
restartBtn.addEventListener("click", restartHandler);
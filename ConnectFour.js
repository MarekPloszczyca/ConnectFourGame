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
const background = document.getElementById("background");

let columns = [[], [], [], [], [], [], []];
let redSpots = [];
let yellowSpots = [];
let turnCounter = 0;
let time = 0;
let automaticRow = 1;
let opponent;

const setIntervalHandler = (restarted) => {
  if (time === 0) {
    time = 31;
    const interval = setInterval(() => {
      time--;
      timer.textContent = time;

      if (time === 0) {
        automaticFillBoardHandler();
        opponent ? null : botMoveHandler();

        clearInterval(interval);
      }
      if (restarted) {
        return clearInterval(interval);
      }
    }, 1000);
  } else time = 31;
};



const loadBoardHandler = (type) => {
  if (board.childElementCount !== 42) {
    for (let i = 0; i < 42; i++) {
      const place = document.createElement("div");
      place.className = "spot";
      board.appendChild(place);
      place.addEventListener("click", type);
      columns[i % 7].push(place);
    }
  }
  timer.textContent = time;

  setIntervalHandler(false);
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
        background.style.backgroundColor = "rgb(236 202 53)";
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
        background.style.backgroundColor = "rgb(245 110 110)";
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

  setIntervalHandler(false);
};

const botMoveHandler = () => {
  const botTime = Math.floor(Math.random() * 29000);
  board.childNodes.forEach((child) => {
    child.removeEventListener("click", vsBotFillBoardHandler);
  });
  restartBtn.removeEventListener("click", directRestart);
  menuBtn.removeEventListener("click", backToMenu);
  setTimeout(() => {
    automaticFillBoardHandler();
    board.childNodes.forEach((child) => {
      child.addEventListener("click", vsBotFillBoardHandler);
    });
    restartBtn.addEventListener("click", directRestart);
    menuBtn.addEventListener("click", backToMenu);
  }, botTime);
};

const vsBotFillBoardHandler = (evt) => {
  vsPlayerFillBoardHandler(evt);
  botMoveHandler();
};

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
      background.style.backgroundColor = "rgb(236 202 53)";
      board.children[board.children.length - number].classList.add("red-spot");
      setIntervalHandler(false);
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
      background.style.backgroundColor = "rgb(245 110 110)";
      board.children[board.children.length - number].classList.add(
        "yellow-spot"
      );
      setIntervalHandler(false);
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
    columnCounter === 4
      ? (timer.textContent = `${winner} player won!`)
      : (columnCounter = 0);
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
    rowCounter === 4
      ? (timer.textContent = `${winner} player won!`)
      : (rowCounter = 0);
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
    horizontalCounter === 4
      ? (timer.textContent = `${winner} player won!`)
      : (horizontalCounter = 0);
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
    horizontalCounter === 4
      ? (timer.textContent = `${winner} player won!`)
      : (horizontalCounter = 0);
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
  if (rules.style.display === "block") {
    visibilityHandler.call(rules);
    visibilityHandler.call(content);
  }
  if (game.style.display === "block") {
    visibilityHandler.call(game);
    visibilityHandler.call(content);
    restartHandler(false);
  }
};
const gameOpener = (evt) => {
  if (evt.target.textContent.includes("CPU")) {
    opponent = false;
  }
  if (evt.target.textContent.includes("PLAYER")) {
    opponent = true;
  }
  opponent
    ? loadBoardHandler(vsPlayerFillBoardHandler)
    : loadBoardHandler(vsBotFillBoardHandler);
  visibilityHandler.call(content);
  visibilityHandler.call(game);
};

const restartHandler = (directRestart) => {
  board.replaceChildren("");
  columns = [[], [], [], [], [], [], []];
  yellowSpots = [];
  redSpots = [];
  turnCounter = 0;
  background.style.backgroundColor = "rgb(245 110 110)";
  automaticRow = 1;
  timer.textContent = time;
  if (directRestart) {
    opponent
      ? loadBoardHandler(vsPlayerFillBoardHandler)
      : loadBoardHandler(vsBotFillBoardHandler);
  }
  setIntervalHandler(true);
};

const directRestart = () => {
  restartHandler(true);
};

rulesBtn.addEventListener("click", rulesOpener);
rulesCloser.addEventListener("click", backToMenu);
vsPlayerBtn.addEventListener("click", gameOpener);
vsBotBtn.addEventListener("click", gameOpener);
menuBtn.addEventListener("click", backToMenu);
restartBtn.addEventListener("click", directRestart);

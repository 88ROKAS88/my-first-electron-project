const fs = require("fs");

function loadFromJson() {
  let rawdata = fs.readFileSync("highScore.json");
  let highScore = JSON.parse(rawdata);
  return highScore;
}
function saveToJson(highScore) {
  let data = JSON.stringify(highScore);
  fs.writeFileSync("highScore.json", data);
}

function firstStart() {
  player.style.display = "none";
  piginCanvas.style.display = "none";
  background.innerHTML = "";
  const element = document.createElement("div");
  element.className = "myctg-announcement";
  element.innerText = "Enter your name and press ENTER";
  background.appendChild(element);

  const input = document.createElement("input");
  input.setAttribute("id", "myctg-input");
  input.value = playerName;

  element.appendChild(input);
}

function showHighScore(highScore, highlight) {
  player.style.display = "none";
  piginCanvas.style.display = "none";
  background.innerHTML = "";
  const element = document.createElement("div");
  element.className = "myctg-announcement";

  element.innerText = "High Score";
  background.appendChild(element);
  highScore.forEach(function (row, index) {
    const newrow = document.createElement(index == highlight ? "h1" : "h2");
    newrow.innerText = index + 1 + ". " + row["name"] + "   " + row["score"];
    element.appendChild(newrow);
  });
}

function localScores() {
  let highScore = loadFromJson();
  let data = {
    name: playerName,
    score: score[3]["score"],
  };
  let currentPlayersScore = 5;

  for (let i = 0; i < highScore.length; i++) {
    if (data["score"] > highScore[i]["score"]) {
      highScore.splice(i, 0, data);
      highScore.pop();
      saveToJson(highScore);
      currentPlayersScore = i;
      break;
    }
  }

  showHighScore(highScore, currentPlayersScore);
}

// #### #### #    #    # #### # #### #  #
// #    #  # #    #    # #    # #  # ## #
// #    #  # #    #    # #### # #  # # ##
// #    #  # #    #    #    # # #  # #  #
// #### #### #### #### # #### # #### #  #

// COLLISION DETECTION

// collision with map on both axes
function collisionXY(varX, varY) {
  if (
    map[left + varX][bottom + varY] == 0 &&
    map[left + varX + 90][bottom + varY] == 0 &&
    map[left + varX][bottom + varY + 90] == 0 &&
    map[left + varX + 90][bottom + varY + 90] == 0
  ) {
    bottom += varY;
    left += varX;
    return true;
  } else if (
    map[left + varX][bottom + varY] == 2 ||
    map[left + varX + 90][bottom + varY] == 2 ||
    map[left + varX][bottom + varY + 90] == 2 ||
    map[left + varX + 90][bottom + varY + 90] == 2
  ) {
    if (pause == false) {
      clearInterval(clock);
      registerScore(currentMap);
      currentMap++;
      if (currentMap > 2) {
        currentMap = 0;
        localScores();
      } else {
        startGame("you won, next level " + (currentMap + 1));
      }
      pause = true;
    }
  }
}

// #   #  ####  ####     ####
// ## ##  #  #  #  #     #
// # # #  ####  ####     ###
// #   #  #  #  #        #
// #   #  #  #  #     #  #

// GENERATE EMPTY MAP
// *takes map variable and generates 2d array where keys are x and y axes on the map and variables are 0 - to indicate map in that point is empty

function generateMap() {
  for (let x = 0; x <= 1700; x += 10) {
    for (let y = 0; y <= 1000; y += 10) {
      if (y == 0) {
        map[x] = [];
      }
      map[x][y] = 0;
    }
  }
  return map;
}

// GENERATE OBJECT IN MAP

function generateObjectInMap(fx, fy, sx, sy, objectType) {
  for (let x = fx; x < sx; x += 10) {
    for (let y = fy; y < sy; y += 10) {
      map[x][y] = objectType;
    }
  }
  return map;
}

// AUTOMATIC OBJECT GENERATION FROM ID FUNCTION
// *takes cube id calculates cube cordinates, and put them into - generateObjectInMap function to generate object

function autoGenerate(id, objectType) {
  id = id.replace("myctg-cube", "");
  const x = Math.floor(id / 6);
  const y = id % 6;
  map = generateObjectInMap(
    x * 100,
    y * 100,
    x * 100 + 100,
    y * 100 + 100,
    objectType
  );
  return map;
}

// MAKE MAP VISUALS
// const jsOutDSP = document.getElementById("jsOut");

function createCube(count) {
  const element = document.createElement("div");
  element.className = "myctg-mapCube";
  element.id = "myctg-cube" + count;
  background.appendChild(element);
}

// MAKE ENDPOINT

function makeEndpoint(number) {
  let id = "myctg-cube" + number;
  autoGenerate(id, 2);
  document.querySelector("#" + id).style.backgroundColor =
    "rgba(84, 245, 39, 0.5)";
}

// RUN AUTOGENERATEMAP AND MAKE MAP VISUALS

function numberToMapObject(number) {
  let id = "myctg-cube" + number;
  autoGenerate(id, 1);
  document.querySelector("#" + id).style.backgroundColor = "rgba(0, 0, 0, 0.6)";
}

//  ####  #####  ####  #####  #  ####        #   #  ####  ####
//  #       #    #  #    #    #  #           ## ##  #  #  #  #
//  ####    #    ####    #    #  #           # # #  ####  ####
//     #    #    #  #    #    #  #           #   #  #  #  #
//  ####    #    #  #    #    #  ####        #   #  #  #  #

const allMaps = [
  {
    map: [
      5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 64, 63, 62, 61, 60, 4, 3, 2, 1,
      0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 21, 8, 27, 26, 25, 40, 39, 38, 44,
      57,
    ],
    player: [100, 100],
    exit: 58,
    pigin: [900, 300],
  },
  {
    map: [
      5, 4, 3, 2, 1, 0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 64, 63, 62, 61,
      14, 27, 33, 32, 44, 50, 56, 45, 46,
    ],
    player: [900, 100],
    exit: 65,
    pigin: [1000, 400],
  },
  {
    map: [
      5, 4, 3, 2, 0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 65, 64, 63, 62, 61,
      57, 59, 47, 41, 59, 53, 40, 13, 14, 15, 21, 32, 39, 38,
    ],
    player: [900, 400],
    exit: 1,
    pigin: [0, 0],
  },
];

// #   #  ####  ####     ####  #   #  ####  ####
// ## ##  #  #  #  #     #      # #   #     #
// # # #  ####  ####     ###     #    ####  #
// #   #  #  #  #        #      # #   #     #
// #   #  #  #  #        ####  #   #  ####  ####

// VARIABLES FOR MAP
var playerName = "Player One";
var piginCanvas = document.getElementById("myctg-pigin");
const background = document.querySelector(".myctg-background");
const numberOfCubes = 66;
const player = document.querySelector("#myctg-player");
const world = document.querySelector("#myctg-world");
player.style.position = "relative";
const timer = document.querySelector("#myctg-timer");
var clock;

var map = [];
var currentMap = 0;

// OPEN CURRENT MAP

function startMap() {
  //emptys map
  background.innerHTML = "";
  map = generateMap();

  //loads map
  for (let i = 0; i < numberOfCubes; i++) {
    createCube(i);
  }

  allMaps[currentMap]["map"].forEach((element) => {
    numberToMapObject(element);
  });

  //loads predator and pray
  player.style.display = "block";
  piginCanvas.style.display = "block";
  //loads starting point
  left = allMaps[currentMap]["player"][0];
  bottom = allMaps[currentMap]["player"][1];

  //timer
  clock = setInterval(hudInterval, 1000);

  //loads ending point
  makeEndpoint(allMaps[currentMap]["exit"]);

  piginCanvas.style.left = allMaps[currentMap]["pigin"][0] + "px";
  piginCanvas.style.bottom = allMaps[currentMap]["pigin"][1] + "px";

  //display game 30fps
  pause = false;

  //start main function
  if (!mainStarted) {
    setInterval(main, 1000 / 30);
    mainStarted = true;
  }
}

function startGame(message) {
  announcement(message);
  setTimeout(startMap, 5000);
}

// ANNAUNCEMENT CURTAIN
// PLAYER INFORMATION WINDOW / ANNOUNCEMENT OF: WIN / LOSE / NEXT LVL

function announcement(message) {
  player.style.display = "none";
  piginCanvas.style.display = "none";
  background.innerHTML = "";
  const element = document.createElement("div");
  element.className = "myctg-announcement myctg-announcement-center";

  element.innerText = message;
  background.appendChild(element);
}

function canvasObjects(idName) {
  const element = document.createElement("canvas");

  element.id = idName;
  world.appendChild(element);
}

// #   #  ####  #  #   #
// ## ##  #  #  #  ##  #
// # # #  ####  #  # # #
// #   #  #  #  #  #  ##
// #   #  #  #  #  #   #

// VARIABLES
let move = false;
let jump = false;
let bottom = 200;
let left = 200;
var pause = false;
let jumpActive = false;
let mainStarted = false;

//variable for animations
let characterPos = "l";
let characterFall = false;

// MAP
firstStart();
// GAME ENGINE

const main = function () {
  if (move) {
    if (move == "l") {
      collisionXY(10, 0);
    }
    if (move == "r") {
      collisionXY(-10, 0);
    }
  }

  if (jump !== false && jump < 11) {
    if (jump < 11) {
      collisionXY(0, 20);
      jump += 1;
    }
    if (jump == 11) {
      // jump = false;
    }
  } else if (jump == 11 || jump == false) {
    if (collisionXY(0, -10)) {
      characterFall = true;
    } else {
      characterFall = false;
      jump = false;
    }
  }
  player.style.bottom = bottom + "px";
  player.style.left = left + "px";
};

//  #  #  #  #  ###
//  #  #  #  #  #  #
//  ####  #  #  #  #
//  #  #  #  #  #  #
//  #  #  ####  ###

var timeLeft = 300;
var score = [];
let levelScore = 500;

const levelScoreDisplay = document.querySelector("#myctg-level-score-display");
function hudInterval() {
  timeLeft--;
  levelScore--;
  timer.innerText = timeLeft;
  if (timeLeft < 1) {
    timeLeft = 300;
    levelScore = 500;
    currentMap = 0;
    startGame("you lost - try again ?");
  }
}

function displayLevelScore(level) {
  const title = document.createElement("div");
  title.innerText = `${score[level]["level"]}  score`;
  title.style.marginTop = "50px";
  title.style.fontSize = "20px";
  levelScoreDisplay.appendChild(title);
  const levelScoreVariable = document.createElement("div");
  levelScoreVariable.innerText = score[level]["score"];
  levelScoreVariable.style.fontSize = "30px";
  levelScoreDisplay.appendChild(levelScoreVariable);
}

function registerScore(level) {
  score.push({ level: "level " + (level + 1), score: levelScore });
  displayLevelScore(level);
  // MUST REFACTOR !
  if (level > 1) {
    score.push({
      level: "overall",
      score: score[0]["score"] + score[1]["score"] + score[2]["score"],
    });
    displayLevelScore(level + 1);
  }
  levelScore = 500;
}

//  #  #   #  ####  #  #  #####  ####
//  #  ##  #  #  #  #  #    #    #
//  #  # # #  ####  #  #    #    ####
//  #  #  ##  #     #  #    #       #
//  #  #   #  #     ####    #    ####

document.addEventListener("keydown", (event) => {
  if (event.key == "d") {
    move = "l";
    characterPos = "l";
  }
  if (event.key == "a") {
    move = "r";
    characterPos = "r";
  }
  if (event.key == " ") {
    jumpActive = true;
  }
  if (event.key == " " && false == jump) {
    jump = 1;
  }
  if (event.key == "Enter") {
    if (document.getElementById("myctg-input")) {
      playerName = document.querySelector("#myctg-input")?.value;
    }
    startGame("level 1 - get ready");
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "d") {
    move = false;
  }
  if (event.key == "a") {
    move = false;
  }
});

//  ####  #   #  #  #   #  ####  #####  ####
//  #  #  ##  #  #  ## ##  #  #    #    #
//  ####  # # #  #  # # #  ####    #    ###
//  #  #  #  ##  #  #   #  #  #    #    #
//  #  #  #   #  #  #   #  #  #    #    ####

window.onload = function () {
  var canvas = document.getElementById("myctg-player");
  var ctx = canvas.getContext("2d");
  canvas.width = 100;
  canvas.height = 100;

  let frameWidth = 100;
  let frameHeight = 100;

  let frame = 0;
  let count = 0;

  let sheetRow = 0;

  const spriteSheet = new Image();
  spriteSheet.src = "images/test5.png";

  function animate() {
    ctx.drawImage(
      spriteSheet,
      frame,
      sheetRow,
      frameWidth,
      frameHeight,
      0,
      0,
      100,
      100
    );
    count++;
    if (characterPos == "r") {
      sheetRow = 100;
    } else {
      sheetRow = 0;
    }
    if (jump != false && jump < 11) {
      sheetRow = 200;
      if (characterPos == "r") {
        frame = 0;
      } else {
        frame = 100;
      }
    } else if (characterFall == true) {
      sheetRow = 200;
      if (characterPos == "r") {
        frame = 200;
      } else {
        frame = 300;
      }
    } else if (move != false) {
      if (count > 20) {
        count = 0;
        frame += 100;
        if (frame > 300) {
          frame = 0;
        }
      }
    } else {
      frame = 0;
    }
  }

  function myFrame() {
    ctx.clearRect(0, 0, 100, 100);
    animate();
    requestAnimationFrame(myFrame);
  }
  myFrame();
};

//  ####  #   #  #  #   #  ####  #####  ####     ####
//  #  #  ##  #  #  ## ##  #  #    #    #        #  #
//  ####  # # #  #  # # #  ####    #    ###      ####
//  #  #  #  ##  #  #   #  #  #    #    #        #
//  #  #  #   #  #  #   #  #  #    #    ####  #  #

var ptx = piginCanvas.getContext("2d");
piginCanvas.width = 100;
piginCanvas.height = 100;
let piginFrameIndex = 0;
let piginCount = 0;
const spriteSheet = new Image();
spriteSheet.src = "images/test5.png";
function animatepigin() {
  ptx.clearRect(0, 0, 100, 100);
  ptx.drawImage(spriteSheet, piginFrameIndex, 300, 100, 100, 0, 0, 100, 100);
  piginCount++;
  if (piginCount > 5) {
    piginFrameIndex += 100;
    if (piginFrameIndex > 300) {
      piginFrameIndex = 0;
    }
    piginCount = 0;
  }
}

function piginFrame() {
  ptx.clearRect(0, 0, 100, 100);
  animatepigin();
  requestAnimationFrame(piginFrame);
}
piginFrame();

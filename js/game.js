'use strict'
var WALL = '<span class="wall">#</span>'
// var WALL = '#'; 
var FOOD = '<span class="food">.</span>'
var CHERRY = '🍒'
var SUPERFOOD = '🍇'
var EMPTY = ' '

var gBoard
var gGame = {
  score: 0,
  isOn: false
}
var gFoodOnBoard = 58
var gEmptySlots
var gIntervalCherry = null

function init() {
  gBoard = buildBoard()
  createPacman(gBoard)
  createGhosts(gBoard)
  printMat(gBoard, '.board-container')
  updateScore(0)
  genCherry(gBoard)
  gGame.isOn = true
  gGame.score = 0
  
}

function buildBoard() {
  var SIZE = 10
  var board = []
  for (var i = 0; i < SIZE; i++) {
    board.push([])
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD
      if (i === 1 && j === 1 ||
        i === 1 && j === 8 ||
        i === 8 && j === 1 ||
        i === 8 && j === 8) {
        board[i][j] = SUPERFOOD
      }
      else if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {
        board[i][j] = WALL;
      }
    }
  }
  return board
}

function isEmpty(board) {
  gEmptySlots = []
  for (var i = 1; i < board.length - 1; i++) {
    for (var j = 1; j < board[0].length - 1; j++) {
      if (board[i][j] === EMPTY) {
        var emptyLocation = { i: i, j: j }
        gEmptySlots.push(emptyLocation)
      }
    }
  }
  return gEmptySlots
}

function genCherry(board) {
  gIntervalCherry = setInterval(function () {
    var locations = isEmpty(board)
    if (locations.length < 1) return
    shuffle(locations)
    var selectedLocation = locations.pop()
    board[selectedLocation.i][selectedLocation.j] = CHERRY
    renderCell(selectedLocation, CHERRY)
  }, 15000)

}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = `${gGame.score}`
}

function gameOver() {
  gGame.isOn = false
  clearInterval(gIntervalGhosts)
  clearInterval(gIntervalCherry)
  gIntervalCherry = null
  gIntervalGhosts = null
  var gameOverMsg = document.querySelector('.game-over-msg h2')
  gameOverMsg.innerText = 'GAME OVER'
  document.querySelector('.game-over-msg').style.visibility = 'visible'
}

function playAgain() {
  document.querySelector('.game-over-msg').style.visibility = 'hidden'
  gGame.score = 0
  init()
}
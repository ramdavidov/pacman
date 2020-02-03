var gPacman
const PACMAN = '😀'
const DEADPACMAN = '💀'
var gSuperTimeOut = false

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  }
  board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function isVicotory() {
  if (gGame.score >= gFoodOnBoard) {
    var vicMsg = document.querySelector('.game-over-msg h2')
    vicMsg.innerText = 'VICTORY'
    document.querySelector('.game-over-msg').style.visibility = 'visible'
    clearInterval(gIntervalCherry)
    clearInterval(gIntervalGhosts)
  }
}

function changeGhostsColor() {
  for (var i = 0; i < gGhosts.length; i++) {
    if (gPacman.isSuper) {
      gGhosts[i].color = 'white'
    } else {
      gGhosts[i].color = getRandomColor()
    }
    renderCell(gGhosts[i].location, GHOST)
  }
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return
  var nextLocation = getNextLocation(eventKeyboard)
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return

  var nextCell = gBoard[nextLocation.i][nextLocation.j]

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return
  // Hitting FOOD? update score
  if (nextCell === SUPERFOOD && gPacman.isSuper) {
    return
  }
  if (nextCell === FOOD) {
    updateScore(1)
    isVicotory()
  }
  if (nextCell === CHERRY) {
    updateScore(10)
    isVicotory()
  }
  if (nextCell === SUPERFOOD) {
    updateScore(1)
    isVicotory()
    gPacman.isSuper = true
    changeGhostsColor()
    gSuperTimeOut = setTimeout(function () {
      gPacman.isSuper = false
      reviveGhosts(gBoard)
      changeGhostsColor()
    }, 5000)
  }
  if (nextCell === GHOST && gPacman.isSuper === true) {
    for (var k = 0; k < gGhosts.length; k++) {
      if (gGhosts[k].location.i === nextLocation.i && gGhosts[k].location.j === nextLocation.j) {
        gGhosts.splice(k, 1)
      }
    }
  }

  else if (nextCell === GHOST && gPacman.isSuper === false) {
    gameOver()
    renderCell(gPacman.location, DEADPACMAN)
    return
  }
  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
  // Update the DOM
  renderCell(gPacman.location, EMPTY)
  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN)
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--
      break;
    case 'ArrowDown':
      nextLocation.i++
      break;
    case 'ArrowLeft':
      nextLocation.j--
      break;
    case 'ArrowRight':
      nextLocation.j++
      break;
    default: return null
  }
  return nextLocation;
}
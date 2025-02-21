import { colors, initialBoard } from '@/lib/constants'

const checkMove = (board: any, from: string, steps: number, myColor: string) => {
  if (!board) return { status: false }
  if (!from || !steps) return { status: false }

  if (from === 'home') {
    if (!board[2][3 - (steps - 1)].token) {
      return {
        status: true
      }
    }

    if (board[2][3 - (steps - 1)].token === myColor) {
      return {
        status: false,
        message: 'You already have a token there'
      }
    }

    return {
      status: true
    }
  }

  const [fromRow, fromCol] = from.split(',').map((x) => parseInt(x))

  if (board[fromRow][fromCol].token !== myColor) {
    const colorName = colors.find((color) => color.hex === myColor)?.name
    return {
      status: false,
      message: 'You are the color ' + colorName
    }
  }

  // find destination through the steps
  let toRow = +fromRow
  let toCol = +fromCol

  const stepsArray = new Array(steps || 0).fill(1)

  let stepReachedFinish = false
  let wentBeyondFinish = false

  stepsArray.forEach((step, i) => {
    if (stepReachedFinish) {
      wentBeyondFinish = true
      return
    }

    const checkFinish = (currentRow: number, currentCol: number) => {
      if (board[currentRow][currentCol].tileType === 'finish') {
        stepReachedFinish = true
        return
      }
    }

    if (board[toRow][toCol].nextTile === 'up') {
      toRow = toRow + step
      checkFinish(toRow, toCol)
      return
    }

    if (board[toRow][toCol].nextTile === 'down') {
      toRow = toRow - step
      checkFinish(toRow, toCol)
      return
    }

    if (board[toRow][toCol].nextTile === 'left') {
      toCol = toCol - step
      checkFinish(toRow, toCol)
      return
    }

    if (board[toRow][toCol].nextTile === 'right') {
      toCol = toCol + step
      checkFinish(toRow, toCol)
      return
    }

    return { toRow, toCol }
  })

  if (!board[toRow] || !board[toRow][toCol]) {
    return {
      status: false,
      message: 'Invalid move'
    }
  }

  if (wentBeyondFinish) {
    return {
      status: false,
      message: 'Invalid move'
    }
  }

  if (!board[toRow][toCol].token) {
    return {
      status: true
    }
  }

  if (board[toRow][toCol].token === myColor) {
    return {
      status: false,
      message: 'You already have a token there'
    }
  }

  if (board[toRow][toCol].tileType === 'shield' && board[toRow][toCol].token !== myColor) {
    return {
      status: false,
      message: 'Shield is protecting the opponent'
    }
  }

  return {
    status: true
  }
}

export default checkMove

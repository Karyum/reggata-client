import checkMove from './checkMove'

const checkPossibleMoves = (steps: number, tokensInHome: number, board: any, myColor: string) => {
  if (tokensInHome) {
    return true
  }

  const tokensLocation = [] as { rowIndex: number; colIndex: number }[]

  board.forEach((row: any, rowIndex: number) => {
    row.forEach((col: any, colIndex: number) => {
      if (col?.token) {
        tokensLocation.push({ rowIndex, colIndex })
      }
    })
  })

  const possibleMoves = tokensLocation.map((location) => {
    return checkMove(board, `${location.rowIndex},${location.colIndex}`, steps, myColor)
  })

  return possibleMoves.some((move) => move.status)
}

export default checkPossibleMoves

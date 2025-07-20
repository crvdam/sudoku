import Sudoku from './assets/Sudoku/Sudoku.tsx'
import './App.css'
import { useState } from 'react'

// Sudoku generation algorithms by Daniel Sasse, adapted for TypeScript and React
// https://dsasse07.medium.com/generating-solving-sudoku-puzzles-9ee1305ced01

function App() {
  const BLANK_BOARD = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

  var counter: number
  const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  function shuffle( array: Array<number> ) {
    let newArray = [...array]
    for ( let i = newArray.length -1; i > 0; i-- ) {
      const j: number = Math.floor (Math.random() * ( i + 1 ));
      [ newArray[i], newArray[j] ] = [ newArray[j], newArray [i] ]
    }

    return newArray
  }

  type EmptyCell = {
    rowIndex: number | "";
    colIndex: number | "";
  }

  // DETERMINE IF LOCATION SAFE
  const rowSafe = (puzzleArray: number[][], emtpyCell: EmptyCell, num: number): boolean => {
    return puzzleArray[ emtpyCell.rowIndex ].indexOf(num) === -1
  }

  const colSafe = (puzzleArray: number[][], emptyCell: EmptyCell, num: number): boolean => {
    return !puzzleArray.some(row => row[ emptyCell.colIndex ] === num)
  }

  const boxSafe = (puzzleArray: number[][], emptyCell: EmptyCell, num: number): boolean => {
    const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3)
     const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3)
    let safe = true

    for ( let boxRow of [0,1,2] ) {
      for ( let boxCol of [0,1,2] ) {
        if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
          safe = false;
        }
      }
    }

    return safe
  }

  const safeToPlace = ( puzzleArray: number[][], emptyCell: EmptyCell, num: number ) => {
    return rowSafe(puzzleArray, emptyCell, num) &&
    colSafe(puzzleArray, emptyCell, num) &&
    boxSafe(puzzleArray, emptyCell, num)
  }

  // NEXT EMPTY CELL
  const nextEmptyCell = (puzzleArray: number[][]) => {
    const emptyCell: EmptyCell = {
      rowIndex: "",
      colIndex: ""
    }

    puzzleArray.forEach( (row, rowIndex ) => {
      if (emptyCell.colIndex !== "") return
      let firstZero = row.find( col => col === 0)
      if (firstZero === undefined) return
      emptyCell.rowIndex = rowIndex
      emptyCell.colIndex = row.indexOf(firstZero)
    })

    if (emptyCell.colIndex !== "") return emptyCell
    
    return false
  }

  // GENERATE FILLED BOARD
  const fillPuzzle = (startingBoard: number[][]) => {
    const emptyCell: EmptyCell | false = nextEmptyCell(startingBoard)

    if (!emptyCell) return startingBoard

    for ( let num of shuffle(numArray) ) {
      counter++

      if ( counter > 20_000_000 ) throw new Error ("Recursion Timeout")
      if ( safeToPlace( startingBoard, emptyCell, num )) {
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num

        if ( fillPuzzle(startingBoard) ) return startingBoard

        startingBoard [ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0
      }
    }

    return false
  }

  const newSolvedBoard = () => {
    const newBoard = BLANK_BOARD.map(row => row.slice() )
    fillPuzzle(newBoard)
    return newBoard
  }

  const [currentBoard, setCurrentBoard ] = useState([]);

  function newStartingBoard(holes: number) {
    try {
      counter = 0

      setCurrentBoard(newSolvedBoard()) 

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="mainContainer">
      <Sudoku currentBoard={currentBoard} /> 
      <button onClick={() => newStartingBoard(1) }>TEST</button>
    </main>
  )
}

export default App

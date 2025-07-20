import Box from '../Box/Box.tsx'
import './sudoku.css'



export default function Sudoku({ currentBoard }) {
  console.log(currentBoard)
  return (
    <div className="sudoku">
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </div>
  )
}
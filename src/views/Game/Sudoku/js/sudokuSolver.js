export function solve(board) {
  const SIZE = 9;

  const findEmpty = () => {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (board[r][c] === 0) return [r, c];
    return null;
  };

  const isSafe = (r, c, num) => {
    for (let i = 0; i < SIZE; i++) {
      if (board[r][i] === num) return false;
      if (board[i][c] === num) return false;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[br + i][bc + j] === num) return false;

    return true;
  };

  const solveRecursive = () => {
    const pos = findEmpty();
    if (!pos) return true;

    const [r, c] = pos;
    for (let num = 1; num <= 9; num++) {
      if (isSafe(r, c, num)) {
        board[r][c] = num;
        if (solveRecursive()) return true;
        board[r][c] = 0;
      }
    }
    return false;
  };

  return solveRecursive();
}

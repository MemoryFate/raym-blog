import { solve } from "./sudokuSolver";
import { difficultyHoles } from "./sudokuDifficulty";

const SIZE = 9;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function cloneBoard(board) {
  return board.map(row => [...row]);
}

// 检查数字是否合法
function isSafe(board, r, c, num) {
  for (let i = 0; i < SIZE; i++) {
    if (board[r][i] === num) return false;
    if (board[i][c] === num) return false;
  }

  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;

  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[br + i][bc + j] === num)
        return false;

  return true;
}

// 生成完整盘
function fillBoard(board) {
  const findEmpty = () => {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (board[r][c] === 0) return [r, c];
    return null;
  };

  const pos = findEmpty();
  if (!pos) return true;

  const [r, c] = pos;
  const nums = [1,2,3,4,5,6,7,8,9];
  shuffle(nums);

  for (let n of nums) {
    if (isSafe(board, r, c, n)) {
      board[r][c] = n;
      if (fillBoard(board)) return true;
      board[r][c] = 0;
    }
  }
  return false;
}

function countSolutions(board, limit = 2) {
  let count = 0;

  const findEmpty = () => {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (board[r][c] === 0) return [r, c];
    return null;
  };

  function dfs() {
    if (count >= limit) return; // 剪枝

    const pos = findEmpty();
    if (!pos) {
      count++;
      return;
    }

    const [r, c] = pos;

    for (let n = 1; n <= 9; n++) {
      if (isSafe(board, r, c, n)) {
        board[r][c] = n;
        dfs();
        board[r][c] = 0;

        if (count >= limit) return;
      }
    }
  }

  dfs();
  return count;
}

export function generateSudoku(difficulty = "medium", ensureUnique = true) {
  let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

  // 1. 生成完整解
  fillBoard(board);

  const solution = cloneBoard(board);

  // 2. 按难度挖空
  let holes = difficultyHoles[difficulty];
  let positions = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      positions.push([r, c]);

  shuffle(positions);

  for (let [r, c] of positions) {
    if (holes <= 0) break;

    let old = board[r][c];
    board[r][c] = 0;

    if (ensureUnique) {
      let testBoard = cloneBoard(board);
      let count = countSolutions(testBoard);

      if (count !== 1) {
        board[r][c] = old; // 不唯一，恢复
      } else {
        holes--;
      }
    } else {
      holes--;
    }
  }

  return { puzzle: board, solution };
}

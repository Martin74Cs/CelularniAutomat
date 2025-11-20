export const ROWS = 30;
export const COLS = 30;

// Directions for neighbor checking (N, NE, E, SE, S, SW, W, NW)
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

export const generateEmptyGrid = (): number[][] => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(Array.from(Array(COLS), () => 0));
  }
  return rows;
};

export const generateRandomGrid = (): number[][] => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(Array.from(Array(COLS), () => Math.random() > 0.7 ? 1 : 0));
  }
  return rows;
};

export const computeNextGeneration = (grid: number[][]): number[][] => {
  // Create a deep copy for the next buffer
  const nextGrid = grid.map(arr => [...arr]);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let neighbors = 0;
      operations.forEach(([x, y]) => {
        // Wrap coordinates (Toroidal grid logic)
        // Adding ROWS/COLS ensures we handle negative indices correctly before modulo
        const newI = (i + x + ROWS) % ROWS;
        const newJ = (j + y + COLS) % COLS;
        
        neighbors += grid[newI][newJ];
      });

      // Rules of Life
      if (neighbors < 2 || neighbors > 3) {
        nextGrid[i][j] = 0; // Die (Underpopulation or Overpopulation)
      } else if (grid[i][j] === 0 && neighbors === 3) {
        nextGrid[i][j] = 1; // Reproduction
      }
      // Otherwise, keep current state (Survival if alive and neighbors 2 or 3)
    }
  }
  return nextGrid;
};
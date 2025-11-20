export const ROWS = 30;
export const COLS = 30;

// Směry pro kontrolu sousedů (S, SV, V, JV, J, JZ, Z, SZ)
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
    // 70% šance na mrtvou buňku, 30% na živou
    rows.push(Array.from(Array(COLS), () => Math.random() > 0.7 ? 1 : 0));
  }
  return rows;
};

export const computeNextGeneration = (grid: number[][]): number[][] => {
  // Vytvoření hluboké kopie pro další generaci
  const nextGrid = grid.map(arr => [...arr]);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let neighbors = 0;
      operations.forEach(([x, y]) => {
        // Zabalení souřadnic (Logika nekonečného světa / toroidu)
        // Přičtení ROWS/COLS zajišťuje správné zpracování záporných indexů před modulo operací.
        // Pokud buňka "vypadne" vlevo (index -1), objeví se vpravo.
        const newI = (i + x + ROWS) % ROWS;
        const newJ = (j + y + COLS) % COLS;
        
        neighbors += grid[newI][newJ];
      });

      // Pravidla života
      if (neighbors < 2 || neighbors > 3) {
        nextGrid[i][j] = 0; // Smrt (Podlidnění nebo Přelidnění)
      } else if (grid[i][j] === 0 && neighbors === 3) {
        nextGrid[i][j] = 1; // Reprodukce / Zrození
      }
      // Jinak zůstává současný stav (Přežití, pokud je živá a má 2 nebo 3 sousedy)
    }
  }
  return nextGrid;
};
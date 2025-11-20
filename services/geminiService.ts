import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize only if key exists to prevent crashes in dev if not set, 
// though UI handles the visual feedback.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Analyzes the current grid state to identify patterns.
 */
export const analyzePattern = async (grid: number[][]): Promise<string> => {
  if (!ai) {
    return "API klíč není nastaven. Prosím nakonfigurujte API_KEY.";
  }

  // Convert grid to a simplified string representation for the LLM.
  // We crop empty edges to save tokens and focus on the content.
  const rows = grid.length;
  const cols = grid[0].length;
  let minR = rows, maxR = -1, minC = cols, maxC = -1;

  // Find bounding box of alive cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
  }

  if (maxR === -1) {
    return "Mřížka je prázdná. Nakreslete nějaké buňky!";
  }

  // Extract the active region string
  let gridStr = "";
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      gridStr += grid[r][c] === 1 ? "O" : ".";
    }
    gridStr += "\n";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Jsi expert na celulární automaty a Conwayovu Hru života. 
      Analyzuj následující vzor (O = živá buňka, . = mrtvá).
      
      Mřížka:
      ${gridStr}
      
      Úkoly:
      1. Identifikuj známé objekty (Glider, Blinker, Block, Loaf, atd.), pokud existují.
      2. Pokud je to chaotický shluk, popiš jeho hustotu.
      3. Odhadni, zda vzor vypadá stabilně, osciluje, nebo exploduje.
      
      Odpověz stručně, česky, maximálně 3 větami. Buď vtipný nebo filozofický.`,
    });

    return response.text || "Nepodařilo se analyzovat vzor.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Chyba při komunikaci s AI službou.";
  }
};
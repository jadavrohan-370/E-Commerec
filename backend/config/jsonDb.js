import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../data/db.json");

const readDb = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json", error);
    return { products: [], categories: [], users: [], orders: [] };
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing db.json", error);
  }
};

export { readDb, writeDb };

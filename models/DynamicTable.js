import fs from 'fs/promises';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const filePath = path.join(dataDir, 'table.json');

const seedTable = {
  columns: ['Col 1', 'Col 2', 'Col 3'],
  cells: [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2']
  ]
};

const isStringArray = (arr) => Array.isArray(arr) && arr.every(x => typeof x === 'string');
const isMatrix = (mat) => Array.isArray(mat) && mat.every(r => Array.isArray(r) && r.every(c => typeof c === 'string'));

export class TableModel {
  constructor(file) {
    this.file = file;
    this.ensureFile();
  }

  ensureFile() {
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    if (!existsSync(this.file)) {
      writeFileSync(this.file, JSON.stringify(seedTable, null, 2), 'utf8');
    }
  }

  validate(shape) {
    if (!shape || typeof shape !== 'object') throw new Error('Invalid payload');
    const { columns, cells } = shape;
    if (!isStringArray(columns)) throw new Error('columns must be string[]');
    if (!isMatrix(cells)) throw new Error('cells must be string[][]');
    const colCount = columns.length;
    if (!cells.every(r => r.length === colCount)) throw new Error('each row length must equal columns length');
  }

  async read() {
    this.ensureFile();
    const raw = await fs.readFile(this.file, 'utf8');
    const json = raw ? JSON.parse(raw) : seedTable;
    this.validate(json);
    return json;
  }

  // atomic-ish write (tmp + rename) for basic safety
  async write(data) {
    this.validate(data);
    const tmp = `${this.file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, this.file);
    return true;
  }

  async reset() {
    await this.write(seedTable);
    return seedTable;
  }

  async clear() {
    const cleared = { columns: ['Col 1'], cells: [['']] };
    await this.write(cleared);
    return cleared;
  }
}

const Table = new TableModel(filePath);
export default Table; 

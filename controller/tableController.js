import Table from '../models/DynamicTable.js';
// If you also need the class for tests/types:
// import Table, { TableModel } from '../models/DynamicTable.js';

export const getTable = async (_req, res) => {
  try {
    const data = await Table.read();        // FIX: Table.read(), not TableModel.read()
    res.json(data);
  } catch (e) {
    console.error('[getTable] read failed:', e); // add log to see root cause
    res.status(500).json({ error: 'Failed to read table' });
  }
};

export const saveTable = async (req, res) => {
  try {
    const payload = req.body || {};
    const { columns, cells } = payload;
    if (!Array.isArray(columns) || !Array.isArray(cells)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    if (!cells.every(r => Array.isArray(r) && r.length === columns.length)) {
      return res.status(400).json({ error: 'Cells row length must match columns length' });
    }
    // IMPORTANT: write FULL payload — this includes colWidths, rowHeights, cellStyles
    await Table.write(payload);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to save table' });
  }
};

export const resetTable = async (_req, res) => {
  try {
    const data = await Table.reset();
    res.json(data);
  } catch (e) {
    console.error('[resetTable] failed:', e);
    res.status(500).json({ error: 'Failed to reset table' });
  }
};

export const clearTable = async (_req, res) => {
  try {
    const data = await Table.clear();
    res.json(data);
  } catch (e) {
    console.error('[clearTable] failed:', e);
    res.status(500).json({ error: 'Failed to clear table' });
  }
};

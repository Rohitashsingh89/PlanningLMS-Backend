const store = new Map();

export const saveGame = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  store.set(id, body);
  res.json({ ok: true });
};

export const loadGame = (req, res) => {
  const id = req.params.id;
  res.json(store.get(id) || null);
};

export const getGameStore = () => store;

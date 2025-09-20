import Problem from '../models/problem.js';

// Helper to normalize payload from the form
function normalizePayload(body) {
  const {
    title = '',
    description = '',
    difficulty = 'Easy',
    topicsText = '',
    topics = undefined,
    examples = [],
    solutionHtml = '',
  } = body || {};

  const topicsArr =
    Array.isArray(topics) && topics.length
      ? topics.map((t) => String(t).trim()).filter(Boolean)
      : String(topicsText || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

  return {
    title: String(title).trim(),
    description: String(description || ''),
    difficulty,
    topics: topicsArr,
    examples: Array.isArray(examples)
      ? examples.map((e) => ({
          input: String(e?.input || ''),
          output: String(e?.output || ''),
          explanation: String(e?.explanation || ''),
        }))
      : [],
    solutions: { html: String(solutionHtml || '') },
  };
}

export const createProblem = async (req, res) => {
  try {
    const data = normalizePayload(req.body);
    if (!data.title || !data.difficulty) {
      return res.status(400).json({ status: false, message: 'title and difficulty are required' });
    }

    const last = await Problem.findOne().sort({ index: -1 }).lean();
    const nextIndex = last?.index ? last.index + 1 : 1;

    const doc = await Problem.create({ ...data, index: nextIndex });
    return res.status(201).json({ status: true, message: 'Problem created', problem: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const listProblems = async (_req, res) => {
  try {
    const problems = await Problem.find({}).sort({ index: 1 });
    return res.status(200).json({ status: true, problems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ status: false, message: 'Not found' });
    return res.status(200).json({ status: true, problem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalizePayload(req.body);

    // Build partial update: only include keys present in body
    const update = {};
    if ('title' in req.body) update.title = data.title;
    if ('description' in req.body) update.description = data.description;
    if ('difficulty' in req.body) update.difficulty = data.difficulty;
    if ('topicsText' in req.body || 'topics' in req.body) update.topics = data.topics;
    if ('examples' in req.body) update.examples = data.examples;
    if ('solutionHtml' in req.body) update.solutions = data.solutions;

    const updated = await Problem.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ status: false, message: 'Not found' });
    return res.status(200).json({ status: true, message: 'Problem updated', problem: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Problem.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ status: false, message: 'Not found' });
    return res.status(200).json({ status: true, message: 'Problem removed', problem: removed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

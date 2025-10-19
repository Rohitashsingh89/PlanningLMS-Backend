export const normTags = (x) =>
    Array.isArray(x) ? x : typeof x === 'string' ? x.split(',').map(s => s.trim()).filter(Boolean) : [];
  
export const like = (q) => (q ? { $regex: String(q), $options: 'i' } : undefined);
  

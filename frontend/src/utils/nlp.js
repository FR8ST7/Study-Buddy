export function generateSummary(text, maxSentences = 3) {
  if (!text) return '';
  const sentences = splitSentences(text);
  if (sentences.length <= maxSentences) return sentences.join(' ');
  const scores = sentences.map((s) => scoreSentence(s, text));
  const ranked = sentences
    .map((s, i) => ({ s, i, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.i - b.i)
    .map(x => x.s.trim());
  return ranked.join(' ');
}

export function extractKeyPoints(text, maxPoints = 5) {
  if (!text) return [];
  const sentences = splitSentences(text);
  const ranked = sentences
    .map((s) => ({ s, score: scoreSentence(s, text) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPoints)
    .map(x => bulletize(x.s));
  return ranked;
}

export function answerQuestion(question, text) {
  if (!question || !text) return "I couldn't find an answer.";
  const q = question.toLowerCase();
  const sentences = splitSentences(text);
  const ranked = sentences
    .map((s) => ({ s, score: overlapScore(q, s.toLowerCase()) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score === 0) return "I couldn't find an answer in the document.";
  return best.s.trim();
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

function scoreSentence(sentence, fullText) {
  const s = sentence.toLowerCase();
  // Weight keywords, numbers, and length in a simple way
  const keywords = ['define', 'key', 'important', 'summary', 'therefore', 'because', 'includes', 'consists', 'leads', 'results'];
  let score = 0;
  score += (s.match(/[A-Za-z]{6,}/g) || []).length * 0.5;
  score += (s.match(/\d+/g) || []).length * 0.5;
  score += keywords.reduce((acc, k) => acc + (s.includes(k) ? 2 : 0), 0);
  score += Math.min(s.length / 120, 2);
  return score;
}

function overlapScore(a, b) {
  const aw = new Set(a.split(/[^a-z0-9]+/g).filter(w => w.length > 2));
  const bw = b.split(/[^a-z0-9]+/g).filter(w => w.length > 2);
  let hit = 0;
  bw.forEach(w => { if (aw.has(w)) hit++; });
  return hit;
}

function bulletize(s) {
  const trimmed = s.trim();
  return trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed;
}






const globalReplies = new Map();

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sessionId, reply } = req.body;

    if (!sessionId || !reply) {
      return res.status(400).json({ error: 'Missing sessionId or reply' });
    }

    const current = globalReplies.get(sessionId) || [];
    current.push(reply);
    globalReplies.set(sessionId, current);

    return res.status(200).json({ message: 'Reply stored' });
  }

  if (req.method === 'GET') {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const replies = globalReplies.get(sessionId) || [];
    globalReplies.set(sessionId, []); // Clear after sending

    return res.status(200).json({ replies });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

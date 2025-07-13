let globalReplies = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sessionId, reply } = req.body;

    if (!sessionId || !reply) {
      return res.status(400).json({ error: "Missing sessionId or reply" });
    }

    if (!globalReplies[sessionId]) {
      globalReplies[sessionId] = [];
    }

    globalReplies[sessionId].push(reply);

    return res.status(200).json({ message: 'Reply stored' });
  }

  if (req.method === 'GET') {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const replies = globalReplies[sessionId] || [];
    globalReplies[sessionId] = []; // clear after fetch

    return res.status(200).json({ replies });
  }

  res.status(405).json({ error: 'Method not allowed' });
}

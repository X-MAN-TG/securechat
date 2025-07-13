let replies = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sessionId, reply } = req.body;
    if (!replies[sessionId]) replies[sessionId] = [];
    replies[sessionId].push(reply);
    res.status(200).json({ message: 'Reply stored' });
  } else if (req.method === 'GET') {
    const { sessionId } = req.query;
    const sessionReplies = replies[sessionId] || [];
    replies[sessionId] = [];
    res.status(200).json({ replies: sessionReplies });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

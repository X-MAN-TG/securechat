export default async function handler(req, res) {
  const { message } = req.body;

  if (!message || !message.reply_to_message || !message.text) {
    return res.status(200).send("No valid reply");
  }

  const originalText = message.reply_to_message.text;
  const replyText = message.text;

  const sessionIdMatch = originalText.match(/Session: (.+)/);
  const sessionId = sessionIdMatch ? sessionIdMatch[1].trim() : null;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID not found' });
  }

  const serverUrl = process.env.SERVER_URL || 'https://securechat-beta.vercel.app';

  try {
    await fetch(`${serverUrl}/api/getReplies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, reply: replyText })
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

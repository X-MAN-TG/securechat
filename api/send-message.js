import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getIpInfo } from './utils/ipInfo'; // make sure this is correct path
import { randomUUID } from 'crypto';

// Read from .env
const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

// Lowercase + trimmed passwords only
const VALID_PASSWORDS = ['nandu', 'ayush', 'bhoot', 'banar', 'xman', '2511'];

export async function POST(req) {
  try {
    const { name, message, password, sessionId } = await req.json();

    const clientHeaders = headers();
    const ip = clientHeaders.get('x-forwarded-for') || 'Unknown';
    const userAgent = clientHeaders.get('user-agent') || 'Unknown';

    const normalizedPass = (password || '').toLowerCase().replace(/\s+/g, '');
    const isValid = VALID_PASSWORDS.includes(normalizedPass);

    const locationData = await getIpInfo(ip);
    const device = parseDevice(userAgent);
    const time = new Date().toISOString().replace('T', ' ').split('.')[0];
    const msgId = randomUUID();

    const telegramText = `
${isValid ? '[✅ VALID]' : '[❌ WRONG]'} Message from client:

📝 ${message}

🔗 Session: ${sessionId.slice(0, 8)}...
🔑 Password: ${password}...
👤 Name: ${name}
💬 Message ID: ${msgId}
⏰ Time: ${time}

🌐 IP: ${ip} (${locationData.provider})
📍 Location: ${locationData.city}, ${locationData.region}, ${locationData.country}
📱 Device: ${device.device}
🧭 Browser: ${device.browser}

💡 Reply to this message to send a response to the client!
`;

    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramText,
        parse_mode: 'HTML',
      }),
    });

    return NextResponse.json({ success: isValid });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper to parse device info from user-agent
function parseDevice(ua = '') {
  const isMobile = /android|iphone|ipad|mobile/i.test(ua);
  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edg|Opera)\/[\d.]+/i);
  const browser = browserMatch ? browserMatch[0].split('/')[0] : 'Unknown';
  const device = isMobile ? 'Mobile' : 'Desktop';
  return { browser, device };
}
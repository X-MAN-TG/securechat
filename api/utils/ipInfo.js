export async function getIpInfo(ip) {
  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json?token=1a98e8e0aa7124`);
    const json = await res.json();

    return {
      city: json.city || 'Unknown',
      region: json.region || 'Unknown',
      country: json.country || 'Unknown',
      provider: json.org || 'Unknown'
    };
  } catch {
    return { city: 'Unknown', region: 'Unknown', country: 'Unknown', provider: 'Unknown' };
  }
}
export default {
  async fetch(request) {
    const url = 'https://raw.githubusercontent.com/gio757320/LedgerFlow/main/ledgerflow-v7.html';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return new Response('Failed to fetch: ' + res.status, { status: 500 });
    }
    const html = await res.text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }
}

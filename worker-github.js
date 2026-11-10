export default {
  async fetch(request, env, ctx) {
    try {
      const url = 'https://raw.githubusercontent.com/gio757320/LedgerFlow/main/ledgerflow-v7.html';
      const res = await fetch(url);
      if (!res.ok) {
        return new Response('GitHub fetch failed: ' + res.status, { status: 502 });
      }
      const html = await res.text();
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      });
    } catch (err) {
      return new Response('Worker error: ' + err.message, { status: 500 });
    }
  }
}

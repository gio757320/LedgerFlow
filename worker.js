export default {
  async fetch(request) {
    const url = 'https://raw.githubusercontent.com/gio757320/LedgerFlow/58077cb/app-v5.html';
    const res = await fetch(url, { cache: 'no-store' });
    const html = await res.text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

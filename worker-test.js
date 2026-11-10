export default {
  async fetch(request) {
    return new Response("HELLO FROM V7 - WORKING!", {
      headers: { "Content-Type": "text/plain" }
    });
  }
}

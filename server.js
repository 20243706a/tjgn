// 의존성 없음. Node 18+ : node server.js
// 방은 하나뿐입니다. 주소로 화면을 구분해요: /  → 친구,  /?admin → 상담사
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || '';          // 설정하면 /?admin=키 로만 상담사 화면에 들어갈 수 있어요
const FRIEND_KEYS = ['what','feel','moods','level','qi','needs','acts','custom','fstep'];
const ADMIN_ONLY = ['pick','crisis','date','cstep','notes'];
const fresh = rev => ({fstep:0, cstep:0, notes:{}, rev:rev||0});
let state = fresh();
const clients = new Set();

function payload(role) {
  const online = {c:0, f:0}; clients.forEach(c => online[c.role]++);
  const o = Object.assign({}, state, {online});
  if (role !== 'c') ADMIN_ONLY.forEach(k => delete o[k]);   // 친구에게는 상담사 기록을 보내지 않아요
  return JSON.stringify(o);
}
function broadcast() { clients.forEach(c => c.res.write('data: ' + payload(c.role) + '\n\n')); }
function body(req) {
  return new Promise((ok, no) => { let d = ''; req.on('data', x => { d += x; if (d.length > 30000) { req.destroy(); no(); } }); req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch (e) { no(e); } }); });
}
const FILES = {'/style.css':['text/css','style.css'], '/common.js':['text/javascript','common.js'], '/manifest.json':['application/manifest+json','manifest.json']};
const send = (res, t, f) => { res.writeHead(200, {'content-type': t, 'cache-control': 'no-cache'}); res.end(fs.readFileSync(path.join(__dirname, f))); };

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'), auth = !ADMIN_KEY || u.searchParams.get('k') === ADMIN_KEY;
  if (req.method === 'GET' && u.pathname === '/') {
    if (!u.searchParams.has('admin')) return send(res, 'text/html; charset=utf-8', 'friend.html');
    if (ADMIN_KEY && u.searchParams.get('admin') !== ADMIN_KEY) { res.writeHead(403); return res.end('관리자 주소가 아니에요'); }
    return send(res, 'text/html; charset=utf-8', 'admin.html');
  }
  if (req.method === 'GET' && FILES[u.pathname]) return send(res, FILES[u.pathname][0], FILES[u.pathname][1]);
  if (req.method === 'GET' && u.pathname === '/manifest-admin.json') {
    res.writeHead(200, {'content-type':'application/manifest+json'});
    return res.end(JSON.stringify({name:'상담사용', short_name:'상담사', start_url:'/?admin=' + encodeURIComponent(u.searchParams.get('admin') || ''), display:'standalone', background_color:'#EEF3F2', theme_color:'#2E6B6F'}));
  }
  if (u.pathname === '/api/events') {
    const client = {res, role: u.searchParams.get('r') === 'c' && auth ? 'c' : 'f'};
    res.writeHead(200, {'content-type':'text/event-stream','cache-control':'no-cache','connection':'keep-alive'});
    clients.add(client); broadcast();
    const hb = setInterval(() => res.write(': hb\n\n'), 25000);
    return req.on('close', () => { clearInterval(hb); clients.delete(client); broadcast(); });
  }
  if (req.method === 'POST' && u.pathname === '/api/patch') {
    try {
      const p = await body(req);
      Object.keys(p).forEach(k => { if (FRIEND_KEYS.includes(k) || (ADMIN_ONLY.includes(k) && auth)) state[k] = p[k]; });
      broadcast(); res.writeHead(200); return res.end('ok');
    } catch (e) { res.writeHead(400); return res.end('bad'); }
  }
  if (req.method === 'POST' && u.pathname === '/api/reset') {
    if (!auth) { res.writeHead(403); return res.end('no'); }
    state = fresh((state.rev || 0) + 1); broadcast(); res.writeHead(200); return res.end('ok');
  }
  res.writeHead(404); res.end('not found');
}).listen(PORT, () => console.log('http://localhost:' + PORT));

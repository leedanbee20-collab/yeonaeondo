import crypto from 'node:crypto';
// Per-process limits: no external service, messages or contact details stored here.
export function createProtection({now=Date.now,maxEntries=10000}={}){
 const buckets=new Map();let sweep=0;
 function exceeded(key,max,windowMs){const t=now();if(t>=sweep){for(const [k,v]of buckets)if(v.until<=t)buckets.delete(k);sweep=t+30000}let entry=buckets.get(key);if(!entry||entry.until<=t){if(!entry&&buckets.size>=maxEntries)return windowMs;entry={n:0,until:t+windowMs};buckets.set(key,entry)}return ++entry.n>max?entry.until-t:0}
 function reject(res,delay){res.writeHead(429,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Retry-After':String(Math.max(1,Math.ceil(delay/1000)))});res.end(JSON.stringify({error:'요청이 많아요. 잠시 후 다시 이용해주세요.'}));return true}
 const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
 function guard(req,res,p){res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');res.setHeader('Cross-Origin-Resource-Policy','same-origin');if(p.startsWith('/api/')||p==='/counsel-questions.json'||p==='/owner-members.html')res.setHeader('Cache-Control','no-store');
 if(/(^|\/)\.|\.(?:map|sqlite|db|sql|env|bak|zip|mjs|pem|key)$/i.test(p)||p.startsWith('/private/')){res.writeHead(404);res.end('Not found');return true}
 // Do not trust user-controlled forwarded-IP headers; shared proxy traffic gets a generous ceiling.
 if(p.startsWith('/api/')){const delay=exceeded('ip:'+digest(req.socket.remoteAddress||'unknown'),6000,60000);if(delay)return reject(res,delay)}return false}
 guard.account=(res,id,kind,max,windowMs)=>{const delay=exceeded('account:'+digest(id)+':'+kind,max,windowMs);return delay?reject(res,delay):false};return guard;
}

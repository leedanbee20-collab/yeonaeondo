export async function createMatchSearch({query,member,body,json,matchingAPI}){
await query('CREATE TABLE IF NOT EXISTS match_search(member_id TEXT PRIMARY KEY,active INTEGER NOT NULL,threshold INTEGER NOT NULL,verified_only INTEGER NOT NULL,seen TEXT NOT NULL,pending TEXT NOT NULL,updated_at TEXT NOT NULL)');
return async(req,res,p)=>{
if(p!=='/api/match-search')return false;
const m=await member(req);if(!m){json(res,401,{error:'로그인 후 인연 찾기를 시작해주세요.'});return true}
let s=(await query('SELECT * FROM match_search WHERE member_id=?',[m.id]))[0];
if(req.method==='POST'){
const b=await body(req);
if(b.action==='stop'){await query('UPDATE match_search SET active=0,pending=? WHERE member_id=?',['[]',m.id]);json(res,200,{active:false});return true}
if(b.action==='ack'){if(s)await query('UPDATE match_search SET pending=? WHERE member_id=?',['[]',m.id]);json(res,200,{ok:true});return true}
if(b.action!=='start'||!Number.isInteger(b.threshold)||b.threshold<0||b.threshold>100||typeof b.verifiedOnly!=='boolean'){json(res,400,{error:'찾기 기준을 확인해주세요.'});return true}
const own=(await query('SELECT listed FROM matching_profiles WHERE member_id=?',[m.id]))[0];if(!own?.listed){json(res,409,{error:'테스트를 마치고 캐릭터 프로필을 인연 찾기에 등록해주세요.'});return true}
await query('INSERT INTO match_search(member_id,active,threshold,verified_only,seen,pending,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(member_id) DO UPDATE SET active=1,threshold=excluded.threshold,verified_only=excluded.verified_only,seen=excluded.seen,pending=excluded.pending,updated_at=excluded.updated_at',[m.id,1,b.threshold,b.verifiedOnly?1:0,'[]','[]',new Date().toISOString()]);s=(await query('SELECT * FROM match_search WHERE member_id=?',[m.id]))[0];
}else if(req.method!=='GET'){json(res,405,{error:'지원하지 않는 요청입니다.'});return true}
if(!s?.active){json(res,200,{active:false,count:0,pendingCount:0});return true}
const own=(await query('SELECT listed FROM matching_profiles WHERE member_id=?',[m.id]))[0];if(!own?.listed){await query('UPDATE match_search SET active=0,pending=? WHERE member_id=?',['[]',m.id]);json(res,200,{active:false,count:0,pendingCount:0});return true}
let result;const capture={writeHead(){},end(value){result=JSON.parse(value)}};
await matchingAPI({headers:req.headers,method:'GET'},capture,'/api/matches',new URL('http://local/api/matches?threshold='+s.threshold+'&verifiedOnly='+!!s.verified_only));
if(result?.error){json(res,503,{error:result.error});return true}
const ids=(result.matches||[]).map(x=>x.id),seen=new Set(JSON.parse(s.seen)),pending=new Set(JSON.parse(s.pending));
for(const id of ids)if(!seen.has(id))pending.add(id);
const availablePending=[...pending].filter(id=>ids.includes(id));
await query('UPDATE match_search SET seen=?,pending=?,updated_at=? WHERE member_id=?',[JSON.stringify(ids),JSON.stringify(availablePending),new Date().toISOString(),m.id]);
json(res,200,{active:true,count:ids.length,pendingCount:availablePending.length,threshold:s.threshold,verifiedOnly:!!s.verified_only,channel:'in-app',needsGender:!!result.needsGender});return true
}
}


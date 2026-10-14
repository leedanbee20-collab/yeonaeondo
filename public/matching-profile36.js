(()=>{
const fields=$('basicFields23'),optional=[...fields.children].find(x=>x.tagName==='DETAILS');for(const id of ['basicCity32','basicDong32']){const label=document.querySelector('label[for="'+id+'"]');label.textContent=id==='basicCity32'?'거주 시 · 필수':'거주 동 · 필수';optional.before(label,$(id))}
document.querySelector('label[for="memberName"]').textContent='실명 · 필수';$('memberName').autocomplete='name';document.querySelector('label[for="memberEmail"]').textContent='이메일 · 필수';[...$('basicGender23').options].filter(o=>!['','남성','여성'].includes(o.value)).forEach(o=>o.remove());
const tip=document.createElement('p');tip.className='muted';tip.textContent='필수 기본정보를 입력하지 않으면 매칭 추천 대상에서 제외됩니다. 정보를 입력·저장하면 인연 찾기에 참여할 수 있어요. 휴대폰번호는 필수이며, 본인인증은 아직 제공하지 않아요.';fields.querySelector('summary').after(tip);
const prevMode=accountMode;accountMode=function(mode){prevMode(mode);for(const id of ['basicCity32','basicDong32'])$(id).required=mode==='signup'};accountMode(accountState);
async function complete(){if(!currentMember)return false;const [b,c]=await Promise.all([apiRequest('/api/member-basics'),apiRequest('/api/member-contact')]);const p=b.profile;return !!(p&&['남성','여성'].includes(p.gender)&&p.birthDate&&p.age>=19&&p.occupation&&p.city&&p.dong&&c.phone)}
async function guide(){await openBasicProfile23();$('basicSaveStatus23').textContent='필수정보 미입력으로 매칭 추천 대상에서 제외되어 있어요. 성별·생년월일·직업군·휴대폰번호·거주 시/동을 입력·저장하면 인연 찾기에 참여할 수 있어요. 본인인증은 아직 제공하지 않아요.'}
const prevMatches=renderMatches;renderMatches=async function(){if(!memberGuard('check'))return;try{if(!(await complete())){await guide();return}await prevMatches()}catch(e){$('matchCount').textContent=e.message}};
const prevPublish=publishMatching19;publishMatching19=async function(){if(!memberGuard('check'))return;try{if(!(await complete())){await guide();return}await prevPublish()}catch(e){$('matchingProfileState19').textContent=e.message}};
})();


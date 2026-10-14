(()=>{
const wait=$('matchingComplete25');wait.querySelector('h2').textContent='나와 맞는 인연을 찾고 있어요.';
wait.querySelector('.muted').textContent='맞는 인연을 찾으면 사이트 안에서 알려드릴게요. 다음 로그인 때도 확인할 수 있어요. 문자·휴대폰 푸시 알림은 아직 연결 전이에요.';
const stop=document.createElement('button');stop.textContent='인연 찾기 알림 중단';wait.querySelector('.row').append(stop);
const notice=document.createElement('div');notice.id='matchNotice31';notice.hidden=true;notice.setAttribute('role','status');notice.style.cssText='position:sticky;top:0;z-index:20;padding:12px 18px;background:#fce8f5;color:#563864;display:none;word-break:keep-all';
const text=document.createElement('span'),view=document.createElement('button');view.textContent='추천 확인';notice.append(text,view);document.querySelector('main').prepend(notice);
let busy=false,userId=null;
function paint(s){notice.hidden=!s.pendingCount;notice.style.display=s.pendingCount?'block':'none';text.textContent=s.pendingCount?'💗 나와 맞는 인연 '+s.pendingCount+'명을 찾았어요. ':'';if(s.active){$('matchingWait25').textContent=s.count?'나와 맞는 인연 '+s.count+'명을 찾았어요. 추천을 확인하고 대화를 제안해보세요.':'아직 매칭 대상을 찾고 있습니다. 맞는 인연을 찾으면 사이트 안에서 알려드릴게요.';$('matchingView25').textContent=s.count?'찾은 인연 확인하기':'추천 기준 넓혀보기'}}
async function check(){if(!currentMember){userId=null;notice.style.display='none';return}if(busy||document.visibilityState!=='visible')return;busy=true;try{if(userId!==currentMember.id){notice.style.display='none';userId=currentMember.id}paint(await apiRequest('/api/match-search'))}catch{}finally{busy=false}}
async function start(){if(!memberGuard('check'))return;if(!profile){startCheck();return}try{const mine=await apiRequest('/api/matching-profile');if(!mine.profile?.listed){await renderMatches();$('matchingProfileState19').textContent='캐릭터를 선택하고 인연 찾기 참여에 동의해주세요.';$('matchingProfileState19').scrollIntoView({block:'center'});return}show('matchingComplete25');$('matchingWait25').textContent='맞는 인연을 확인하고 있어요…';paint(await apiRequest('/api/match-search',{action:'start',threshold:Number($('threshold').value),verifiedOnly:$('verifiedOnly').checked}));window.scrollTo({top:0,behavior:'smooth'})}catch(e){$('matchingWait25').textContent=e.message}}
const publish=publishMatching19;publishMatching19=async function(){await publish();if(!wait.classList.contains('hidden'))await start()};
const resultButton=$('result').querySelector('.row button');resultButton.textContent='나와 맞는 인연 찾기';resultButton.onclick=start;
const begin=document.createElement('button');begin.className='primary';begin.textContent='나와 맞는 인연 찾기 · 알림 받기';begin.onclick=start;$('matchCount').after(begin);
async function acknowledge(){await renderMatches();try{await apiRequest('/api/match-search',{action:'ack'});notice.style.display='none'}catch{}}
view.onclick=acknowledge;$('matchingView25').onclick=acknowledge;stop.onclick=async()=>{try{await apiRequest('/api/match-search',{action:'stop'});notice.style.display='none';$('matchingWait25').textContent='인연 찾기 알림을 중단했어요. 추천은 언제든 다시 확인할 수 있어요.'}catch(e){$('matchingWait25').textContent=e.message}};
setInterval(check,60000);document.addEventListener('visibilitychange',check);check();
})();

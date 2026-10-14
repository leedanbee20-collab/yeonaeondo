export const dayKey=t=>new Date(t+9*3600000).toISOString().slice(0,10);
export function recordChatDay(r,id,now=Date.now()){if(r.people.length!==2)return;r.chatStartedAt ||= now;r.chatDays ||= {};r.chatDays[id]=[...new Set([...(r.chatDays[id]||[]),dayKey(now)])].sort().slice(-7)}
export function dateAccess(r,self){const both=r.people.length===2;return {available:both&&(['planning','active'].includes(r.status)||r.people.every(p=>r.dateVotes?.[p.id]===true)),selfDays:0,peerDays:0,remainingHours:0}}

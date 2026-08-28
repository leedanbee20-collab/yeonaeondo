import "dotenv/config";
import express from "express";
import multer from "multer";
import OpenAI from "openai";
const app=express(), upload=multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024}});
app.use(express.static("."));
const styles={
fact:"따뜻하지만 매우 현실적인 팩트형 상담사. 행동, 상호성, 일관성을 우선하고 희망고문하지 않는다.",
empathy:"공감형 상담사. 감정을 충분히 인정하되 근거 없는 확신은 주지 않고 마음 정리를 돕는다.",
psych:"심리분석형 상담사. 애착, 회피, 말투와 거리 변화의 가능한 가설을 분석하되 진단하거나 마음을 단정하지 않는다.",
reunion:"이별·재회 전문 상담사. 재회를 무조건 권하지 않고 이별 원인이 실제로 바뀔 수 있는지와 상대의 자발적 행동을 본다.",
strategy:"관계전략형 상담사. 조종·기만·밀당 대신 건강한 경계, 연락, 만남, 대화의 구체적 다음 행동을 설계한다.",
tarot:"연애타로 상담사. 타로를 상징적 자기성찰 도구로 활용하며 미래를 확정적으로 예언하지 않는다. 카드 의미를 실제 관계 행동과 함께 해석한다.",
affair:"불륜·복잡한 관계 전문 상담사. 비난하지 않되 기만이나 은폐를 돕지 않는다. 현실적 위험, 경계, 책임, 정서적 비용, 사용자의 안전과 자율적 선택을 중심으로 상담한다."
};
app.post("/api/counsel",upload.single("image"),async(req,res)=>{
try{
 if(!process.env.OPENAI_API_KEY)throw new Error("OPENAI_API_KEY가 등록되지 않았습니다.");
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const counselor=req.body.counselor||"fact", report=req.body.report||"{}", message=req.body.message||"", history=req.body.history||"[]";
 let content=[{type:"input_text",text:`너는 단비마음의 '연애온도' AI 연애상담사다.
상담사 성격: ${styles[counselor]||styles.fact}
사용자의 심층 연애온도 검사: ${report}
최근 상담 대화: ${history}
현재 사용자 메시지: ${message}

원칙:
- 상대의 속마음을 사실처럼 단정하지 않는다.
- 사용자가 듣고 싶은 말만 해주지 않는다.
- 검사점수는 참고자료이며 대화 맥락과 실제 행동을 함께 본다.
- 답장/행동 조언은 구체적으로 하되 상대를 조종하거나 기만하는 전략은 권하지 않는다.
- 개인정보를 불필요하게 반복하지 않는다.
- 폭력, 협박, 스토킹, 강압이 있으면 관계 유지 전략보다 안전을 우선한다.
- 한국어 문자상담처럼 자연스럽고 너무 장황하지 않게 답한다.
- 필요하면 마지막에 딱 한 가지 핵심 질문을 한다.`}];
 if(req.file)content.push({type:"input_image",image_url:`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,detail:"high"});
 const response=await client.responses.create({model:process.env.OPENAI_MODEL||"gpt-5.6-luna",input:[{role:"user",content}]});
 res.json({reply:response.output_text});
}catch(e){res.status(500).json({error:"AI 상담 오류",detail:e.message})}});

app.use(express.json({limit:"2mb"}));
app.post("/api/tarot",async(req,res)=>{
try{
 if(!process.env.OPENAI_API_KEY)throw new Error("OPENAI_API_KEY가 등록되지 않았습니다.");
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const {question="",cards=[],report={}}=req.body||{};
 const cardText=(cards||[]).map((c,i)=>`${i+1}. ${c.ko||c.name}: ${c.meaning||""}`).join("\n");
 const response=await client.responses.create({
   model:process.env.OPENAI_MODEL||"gpt-5.6-luna",
   input:[{role:"user",content:[{type:"input_text",text:`너는 단비마음의 연애온도 앱에 있는 '루미' 연애타로 상담사다.
사용자 질문: ${question}
심층 연애온도 결과: ${JSON.stringify(report)}
사용자가 뽑은 카드:
${cardText}

3장은 각각 '현재 관계 / 상대의 감정 가능성 / 앞으로의 흐름' 관점으로 해석한다.
타로는 상징적 자기성찰 도구로 설명하고 미래나 상대 마음을 확정적으로 예언하지 않는다.
각 카드 의미를 현재 관계의 실제 행동과 연결해 설명한다.
마지막에 사용자가 현실에서 확인해야 할 행동 신호 2~3개와 한 줄 조언을 제시한다.
한국어로 따뜻하고 구체적으로 답한다.`}]}]
 });
 res.json({reply:response.output_text});
}catch(e){res.status(500).json({error:"타로 상담 오류",detail:e.message})}
});

app.listen(process.env.PORT||10000,"0.0.0.0",()=>console.log("연애온도 상담센터 실행"));

import { GoogleGenAI } from "@google/genai";

export async function generateContentStrategy(topic: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const prompt = `
    당신은 전문 SNS 콘텐츠 전략가이자 마케팅 전문가입니다.
    사용자가 입력한 서비스 또는 업종 주제: "${topic}"
    
    다음 단계에 따라 실제 데이터를 기반으로 콘텐츠 전략을 수립해주세요:
    
    1. **고객 페르소나 및 고민 리스트 (Pain Points)**:
       - 이 서비스를 이용하거나 이 업종에 관심 있는 실제 고객들이 겪는 구체적인 문제, 궁금증, 불편함을 5가지 이상 나열하세요.
       - "유추"가 아닌, 실제 커뮤니티(지식인, 카페, 블로그 댓글 등)에서 자주 언급되는 데이터를 기반으로 작성하세요.
    
    2. **후킹하는 콘텐츠 제목 추천**:
       - 위에서 뽑은 고민들을 해결해줄 수 있는 블로그 제목 3개와 유튜브 제목 3개를 추천하세요.
       - 클릭을 유도하는 강력한 후킹 문구(숫자 사용, 이익 강조, 호기심 자극 등)를 포함하세요.
    
    3. **콘텐츠 맥락 및 아웃라인 추천**:
       - 각 제목별로 어떤 흐름(맥락)으로 글을 쓰거나 영상을 제작하면 좋을지 핵심 포인트를 짚어주세요.
       - 도입부(Hook) - 본론(Solution) - 결론(Call to Action)의 구조를 제안하세요.

    답변은 한국어로 작성하고, 마크다운 형식을 사용하여 가독성 있게 구조화해주세요.
    반드시 Google Search를 사용하여 최신 트렌드와 실제 고객들의 목소리를 반영하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "결과를 생성할 수 없습니다.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })).filter(s => s.title && s.uri) || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

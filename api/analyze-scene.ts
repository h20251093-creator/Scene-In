interface SceneAnalyzePayload {
  title?: string;
  epBadge?: string;
  quote?: string;
  desc?: string;
  cast?: string;
  placeName?: string;
  address?: string;
  wardrobe?: string;
  stillDataUrl?: string;
  stillUrl?: string;
}

interface SceneAnalysisResult {
  outfitItems: Array<{
    category: string;
    item: string;
    colorMaterial: string;
  }>;
  lookMood: string;
  shoppingKeywords: string[];
  sceneAtmosphere: string;
  propsAndSpace: string;
}

function buildSmartFallback(payload: SceneAnalyzePayload): SceneAnalysisResult {
  const title = (payload.title || '작품').trim();
  const cast = (payload.cast || '주연 배우').trim();
  const place = (payload.placeName || '촬영지').trim();
  const desc = (payload.desc || '').trim();
  const wardrobe = (payload.wardrobe || '').trim();
  const text = `${title} ${desc} ${wardrobe} ${place}`.toLowerCase();

  const isWinterOrCoat =
    text.includes('코트') ||
    text.includes('목도리') ||
    text.includes('눈') ||
    text.includes('겨울') ||
    text.includes('도깨비') ||
    text.includes('설산');
  const isSummerOrBeach =
    text.includes('해변') ||
    text.includes('바다') ||
    text.includes('서핑') ||
    text.includes('여름');
  const isOfficeOrSuit =
    text.includes('수트') ||
    text.includes('재킷') ||
    text.includes('여왕') ||
    text.includes('글로리');

  let outfitItems: SceneAnalysisResult['outfitItems'];
  let lookMood: string;
  let shoppingKeywords: string[];

  if (isWinterOrCoat) {
    outfitItems = [
      { category: '아우터', item: '오버핏 롱 울 캐시미어 코트', colorMaterial: '다크 차콜 / 헤비 울 블렌드' },
      { category: '상의', item: '하프넥 립 니트 풀오버', colorMaterial: '아이보리·블랙 / 소프트 메리노 울' },
      { category: '하의', item: '스트레이트 핏 울 슬랙스', colorMaterial: '딥 네이비 / 매트 트윌' },
      { category: '잡화', item: '프린지 울 머플러 & 레더 크로스백', colorMaterial: '버건디·블랙 / 캐시미어·소가죽' },
    ];
    lookMood = '차분하고 서정적인 겨울 드라마 시그니처 롱코트 레이어드 무드';
    shoppingKeywords = [`${title} 롱코트`, '캐시미어 오버핏 코트', '버건디 울 머플러', '겨울 드라마 남주 코트'];
  } else if (isOfficeOrSuit) {
    outfitItems = [
      { category: '아우터', item: '테일러드 싱글 브레스티드 재킷', colorMaterial: '네이비·아이보리 / 스트레치 수팅 울' },
      { category: '상의', item: '실크 타이 블라우스 또는 드레스 셔츠', colorMaterial: '크림 화이트 / 새틴·코튼 포플린' },
      { category: '하의', item: '와이드 테일러드 팬츠', colorMaterial: '차콜·블랙 / 드레이프 울' },
      { category: '잡화', item: '스트럭처드 레더 토트백 & 미니멀 이어링', colorMaterial: '블랙·골드 / 카프스킨' },
    ];
    lookMood = '도회적이고 세련된 하이엔드 테일러드 포멀 룩';
    shoppingKeywords = [`${title} 착장`, '테일러드 롱 재킷', '미니멀 레더 토트백', '클래식 실크 블라우스'];
  } else if (isSummerOrBeach) {
    outfitItems = [
      { category: '상의', item: '루즈핏 린넨 오픈 칼라 셔츠', colorMaterial: '라이트 블루·화이트 / 내추럴 린넨' },
      { category: '하의', item: '릴랙스드 코튼 치노 팬츠', colorMaterial: '샌드 베이지 / 워싱 코튼' },
      { category: '잡화', item: '캔버스 에코백 & 틴트 선글라스', colorMaterial: '에크루 / 코튼 캔버스' },
    ];
    lookMood = '청량하고 내추럴한 해변·리조트 캐주얼 스타일';
    shoppingKeywords = [`${title} 린넨셔츠`, '비치 캐주얼 코디', '샌드 베이지 치노팬츠', '여름 드라마 데일리룩'];
  } else {
    outfitItems = [
      { category: '아우터', item: '미니멀 트러커 재킷 또는 가디건', colorMaterial: '베이지·카키 / 워싱 코튼 트윌' },
      { category: '상의', item: '릴랙스드 핏 코튼 옥스포드 셔츠', colorMaterial: '오프화이트 / 코튼 100%' },
      { category: '하의', item: '스트레이트 인디고 데님 팬츠', colorMaterial: '미드 블루 / 논페이드 데님' },
      { category: '잡화', item: '빈티지 레더 워치 & 캔버스 숄더백', colorMaterial: '브라운·에크루 / 천연가죽' },
    ];
    lookMood = '일상 속 감성이 묻어나는 내추럴 빈티지 데일리 무드';
    shoppingKeywords = [`${title} 패션`, `${cast.split(/[·,(]/)[0].trim()} 스타일`, '미니멀 코튼 재킷', '내추럴 데일리룩'];
  }

  return {
    outfitItems,
    lookMood,
    shoppingKeywords: shoppingKeywords.filter(Boolean).slice(0, 4),
    sceneAtmosphere: desc
      ? `${place}의 공간감과 인물의 감정선이 자연스럽게 어우러지는 시네마틱 톤입니다.`
      : `${title} 특유의 서정적인 색감과 ${place}의 현장 분위기가 돋보이는 장면입니다.`,
    propsAndSpace: `${place}${payload.address ? ` (${payload.address})` : ''} 배경의 자연광·실내 조명 대비와 계절감 소품이 장면의 몰입감을 높여줍니다.`,
  };
}

function parseJsonSafely(raw: string): SceneAnalysisResult | null {
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed && Array.isArray(parsed.outfitItems) && Array.isArray(parsed.shoppingKeywords)) {
      return parsed as SceneAnalysisResult;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload: SceneAnalyzePayload = req.body || {};
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const openaiKey = (process.env.OPENAI_API_KEY || '').trim();

  const prompt = [
    '당신은 영화·드라마 장면 속 배우 의상과 촬영 공간 스타일을 분석하는 패션/공간 큐레이터입니다.',
    '아래 장면 정보와(제공된 경우) 이미지를 바탕으로 JSON 형식만 반환하세요.',
    `작품명: ${payload.title || '미상'}`,
    `회차/구분: ${payload.epBadge || '-'}`,
    `대사: ${payload.quote || '-'}`,
    `장면 설명: ${payload.desc || '-'}`,
    `출연진: ${payload.cast || '-'}`,
    `촬영지: ${payload.placeName || '-'} (${payload.address || '-'})`,
    `기존 의상 메모: ${payload.wardrobe || '-'}`,
    '',
    '반드시 다음 JSON 스키마를 정확히 따르세요:',
    '{',
    '  "outfitItems": [{"category": "상의|아우터|하의|잡화", "item": "아이템명", "colorMaterial": "컬러/소재"}],',
    '  "lookMood": "전체 룩 무드 한 줄 요약",',
    '  "shoppingKeywords": ["키워드1", "키워드2", "키워드3", "키워드4"],',
    '  "sceneAtmosphere": "장면 분위기 및 색감 요약",',
    '  "propsAndSpace": "촬영 배경/소품 연출 포인트 요약"',
    '}',
  ].join('\n');

  try {
    if (geminiKey) {
      const parts: any[] = [{ text: prompt }];
      if (payload.stillDataUrl && payload.stillDataUrl.startsWith('data:image/')) {
        const [meta, b64] = payload.stillDataUrl.split(',');
        const mimeMatch = meta.match(/data:(image\/[a-zA-Z0-9+.-]+);base64/);
        if (b64 && mimeMatch) {
          parts.push({ inlineData: { mimeType: mimeMatch[1], data: b64 } });
        }
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
          }),
        }
      );

      if (geminiRes.ok) {
        const json = await geminiRes.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = parseJsonSafely(text);
        if (parsed) {
          return res.status(200).json({ source: 'gemini', analysis: parsed });
        }
      }
    }

    if (openaiKey) {
      const content: any[] = [{ type: 'text', text: prompt }];
      const imgInput =
        payload.stillDataUrl && payload.stillDataUrl.startsWith('data:image/')
          ? payload.stillDataUrl
          : payload.stillUrl && payload.stillUrl.startsWith('https://')
            ? payload.stillUrl
            : null;
      if (imgInput) {
        content.push({ type: 'image_url', image_url: { url: imgInput } });
      }

      const oaRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content }],
          temperature: 0.4,
        }),
      });

      if (oaRes.ok) {
        const json = await oaRes.json();
        const text = json?.choices?.[0]?.message?.content || '';
        const parsed = parseJsonSafely(text);
        if (parsed) {
          return res.status(200).json({ source: 'openai', analysis: parsed });
        }
      }
    }
  } catch (err) {
    console.warn('[analyze-scene] Upstream AI error, falling back:', err);
  }

  return res.status(200).json({
    source: 'fallback',
    analysis: buildSmartFallback(payload),
  });
}

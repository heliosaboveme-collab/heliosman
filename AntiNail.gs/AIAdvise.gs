/**
 * AI判定（知能担当）クラス
 */
const AiAdviser = {
  
  // 鑑定を実行するメイン関数
  analyzeComment: function(commentText) {
    const prompt = this.generatePrompt(commentText);
    const aiAnalysis = this.callGemini(prompt);
    return aiAnalysis;
  },

  // プロンプトを組み立てる（雛形を完全継承）
  generatePrompt: function(commentText) {
   return `ネット上の攻撃的投稿を解析する高度なAIシステムとして、以下のコメントを【システム分析】せよ。
法的な権利侵害（名誉毀損・侮辱・脅迫）が「極めて深刻」であり、法的措置の検討が妥当な「Sランク」のみを抽出せよ。

■判定の【超厳格】基準
以下のものは全て「ランクC（対象外）」として、一切出力せず「C」とのみ返せ：
・動画の内容に対する批判、皮肉、個人の感想（例：「例えが下手」「面白くない」等）
・文脈が不明瞭な単発の悪口（例：「バカ」「ゴミ」一言など）
・特定の個人を100%特定できない曖昧な代名詞による投稿
・単なる煽り、不快感の表明、議論の範疇にあるもの

■ランクS（抽出対象）の定義
1. 身体・生命・財産に対する具体的な加害予告（殺害予告、襲撃示唆、住所晒し）
2. 事実に基づかない具体的な虚偽情報の流布（前科、犯罪、不倫等の捏造）
3. 社会的評価を再起不能なレベルで低下させる執拗かつ具体的な人格否定

■出力形式（ランクSのみ）
【分析根拠】[特定/断定]：対象を個人として特定可能なシステム的解析理由（30字以内）
【検知レベル】[S:極めて深刻 / 法的措置検討対象]
【解析レポート】該当する可能性のある規約・条項と、証拠としての深刻度スコア（50字以内）
※必ず末尾に特殊コード【EXECUTE_CAPTURE_S】を付加せよ。

■ランクC（上記以外全て）
「C」の一文字のみを出力せよ。

対象コメント：${commentText}`;
  },

  // Gemini APIとの通信（雛形を完全継承）
  callGemini: function(prompt) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=' + GEMINI_API_KEY;
    const payload = { "contents": [{ "parts": [{ "text": prompt }] }] };
    const options = {
      "method": "post", "contentType": "application/json",
      "payload": JSON.stringify(payload), "muteHttpExceptions": true
    };
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.candidates && json.candidates[0].content) {
      return json.candidates[0].content.parts[0].text;
    } else {
      return "判定エラー: " + (json.error ? json.error.message : "中身なし");
    }
  }
};

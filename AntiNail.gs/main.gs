/**
 * 【設定エリア】
 */
const GEMINI_API_KEY = 'AIzaSyDeq3LK2kb9ko9fRBoqRLlPuOAxGFVji28'; 

/**
 * 司令塔：システムを実行するメイン関数
 */
function runAntiHateSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // シート一覧を取得し、名前の前後のスペースを無視して合致するものを探す
  const sheets = ss.getSheets();
  const mainSheet = sheets.find(s => s.getName().trim() === "出力用シート");
  const listSheet = sheets.find(s => s.getName().trim() === "監視リスト");
  const dbSheet = sheets.find(s => s.getName().trim() === "IDデータベース"); // ★追加：ID専用シート

  // エラーチェック：シートが見つからない場合に具体的な理由を出す
  if (!listSheet) {
    throw new Error("『監視リスト』という名前のシートが見つかりません。タブ名を確認してください。");
  }
  if (!mainSheet) {
    throw new Error("『出力用シート』という名前のシートが見つかりません。タブ名を確認してください。");
  }
  if (!dbSheet) {
    throw new Error("『IDデータベース』という名前のシートが見つかりません。タブ名を作成してください。");
  }

  // 1. 監視リストから動画IDをすべて取得
  const lastRowOfList = listSheet.getLastRow();
  
  if (lastRowOfList < 2) {
    console.log("監視リストに動画データがありません。");
    return;
  }
  
  // A列のデータを取得して1次元配列にし、空行を除外
  let videoData = listSheet.getRange(2, 1, lastRowOfList - 1, 1).getValues().flat().filter(id => id !== "");

  // ★重要：最新（下に追加されたもの）から順に処理するために配列を反転させる
  videoData.reverse();

  // 2. メインシートのヘッダーセット（初回のみ）
  if (mainSheet.getLastRow() === 0) {
    mainSheet.getRange(1, 1, 1, 10).setValues([[
      "システム取得日時", "投稿日時", "ユーザー名", "チャンネルID", 
      "コメント内容", "AI判定", "動画URL", "証拠撮影用URL", 
      "コメントID", "スクショ完了"
    ]]);
  }

  // ★変更：重複チェック用IDの取得先を「dbSheet（IDデータベース）」に変更
  const processedIds = SheetClient.getProcessedIds(dbSheet);

  // 3. 動画の本数分だけループ（最新の動画から順に巡回）
  videoData.forEach((inputUrl, index) => {
    // URLから動画IDを抽出
    const videoId = inputUrl.includes("v=") ? 
                 inputUrl.split("v=")[1].split("&")[0] : 
                 inputUrl.split("?")[0].split("/").pop();
    
    console.log(`--- 巡回中 (${index + 1}/${videoData.length}): ${videoId} ---`);

    let comments;
    try {
      comments = YouTubeClient.getLatestComments(videoId, 15);
    } catch (e) {
      console.error(`動画ID ${videoId} の取得に失敗しました。URLを確認してください。`);
      return; // 次の動画へ
    }
    
    const results = [];
    const newIds = []; // ★追加：DBに保存する用の新しいIDリスト

    // 4. 各コメントを判定
    comments.forEach(comment => {
      if (processedIds.includes(comment.id)) {
        return; // 重複スキップ
      }

      console.log("  判定中: " + comment.author);
      const aiAnalysis = AiAdviser.analyzeComment(comment.text);
      Utilities.sleep(1000); // 1秒待機（API保護）

      // ★重要：判定がC以外なら出力用シートへ、IDは判定に関わらずDBへ
      if (aiAnalysis.trim() !== "C") {
        const captureUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${comment.id}`;
        const postTimestamp = Utilities.formatDate(new Date(comment.publishedAt), "JST", "yyyy/MM/dd HH:mm:ss");
        const systemTimestamp = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd HH:mm:ss");

        results.push([
          systemTimestamp, postTimestamp, comment.author, comment.authorId,
          comment.text, aiAnalysis, `https://www.youtube.com/watch?v=${videoId}`,
          captureUrl, comment.id, ""
        ]);
      }
      
      // 判定済みのIDとして記録対象に追加
      newIds.push([comment.id]);
    });

    // 5. 動画ごとに結果を書き込み
    if (results.length > 0) {
      SheetClient.appendResults(mainSheet, results);
      console.log(`  -> ${results.length} 件の要注意コメントを記録しました。`);
    }

    // ★追加：判定した全てのIDを「IDデータベース」シートに追記
    if (newIds.length > 0) {
      dbSheet.getRange(dbSheet.getLastRow() + 1, 1, newIds.length, 1).setValues(newIds);
    }
  });

  console.log("全動画のパトロールが完了しました！");
}
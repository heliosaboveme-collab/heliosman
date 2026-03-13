/**
 * スプレッドシート操作担当（データ管理係）クラス
 */
const SheetClient = {
  
  // シートの既存データから、すでに判定済みの「コメントID」をすべて取得する
  getProcessedIds: function(sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return []; // ヘッダーのみ、または空の場合は空配列を返す

    // ★修正点：IDが格納されているのは I列（9列目）に変更
    const ids = sheet.getRange(2, 9, lastRow - 1, 1).getValues().flat();
    return ids;
  },

  // 判定結果をシートに書き込む（10列分に拡張）
  appendResults: function(sheet, results) {
    if (results.length === 0) return;
    const lastRow = sheet.getLastRow();
    // ★修正点：10列分のデータを書き込むように範囲を拡張
    sheet.getRange(lastRow + 1, 1, results.length, 10).setValues(results);
  }
};
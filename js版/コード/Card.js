/**
 * Cardクラス (JavaのCard.javaの移植版 + 画像対応版)
 */
class Card {
    constructor(suit, rank) {
        this.suit = suit; // マーク (♥, ♦, ♠, ♣)
        this.rank = rank; // 数字 (A, 2-10, J, Q, K)
    }

    getPoint() {
        if (this.rank === "A") return 11;
        if (["J", "Q", "K"].includes(this.rank)) return 10;
        return parseInt(this.rank);
    }

    // 🏆 追加：連番画像（1-52）のファイル名を生成するメソッド
    getImagePath() {
        // マークの並び順（スペード、クローバー、ダイヤ、ハートの順）
        const suitOrder = ["♠", "♣", "♦", "♥"];
        const suitIndex = suitOrder.indexOf(this.suit);

        // 数字の変換 (A=1, 2-10=そのまま, J=11, Q=12, K=13)
        let rankValue;
        if (this.rank === "A") rankValue = 1;
        else if (this.rank === "J") rankValue = 11;
        else if (this.rank === "Q") rankValue = 12;
        else if (this.rank === "K") rankValue = 13;
        else rankValue = parseInt(this.rank);

        // 画像番号の計算: (マーク番号 * 13) + 数字
        // 例: スペードAなら (0 * 13) + 1 = 1
        // 例: ハートKなら (3 * 13) + 13 = 52
        const fileNumber = (suitIndex * 13) + rankValue;

        // フォルダ構成に合わせてパスを返す
        return `./torannpu-illust${fileNumber}.png`;
    }

    toString() {
        return `${this.suit} ${this.rank}`;
    }
}
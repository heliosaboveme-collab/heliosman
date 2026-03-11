/**
 * Playerクラス (JavaのPlayer.javaの移植版)
 */
class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    addCard(card) {
        this.hand.push(card);
    }

    calculateScore() {
        let score = 0;
        let aceCount = 0;
        for (let card of this.hand) {
            score += card.getPoint();
            if (card.rank === "A") aceCount++;
        }
        // 21を超えたらAを11から1に読み替える（Javaと同じロジック）
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    clearHand() {
        this.hand = [];
    }
}
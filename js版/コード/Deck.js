/**
 * Deckクラス (JavaのDeck.javaの移植版)
 */
class Deck {
    constructor() {
        this.cards = [];
        // 🏆 修正：画像連番のルールに合わせて並び順を変更しました
        const suits = ["♠", "♣", "♦", "♥"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        for (let s of suits) {
            for (let r of ranks) {
                this.cards.push(new Card(s, r));
            }
        }
    }

    // JavaのCollections.shuffleに相当
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}
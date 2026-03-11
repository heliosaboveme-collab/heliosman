/**
 * main.js (JavaのBlackjack.javaの役割 + 画像・赤文字メッセージ対応版)
 */
let deck, player, dealer;
let canPeek = true;
let isGameOver = false; // 🏆 追加：ゲームが終わったかどうかを判定するフラグ

// ゲームの初期化
function initGame() {
    deck = new Deck();
    deck.shuffle();
    player = new Player("Player");
    dealer = new Player("Dealer");
    canPeek = true;
    isGameOver = false; // 初期化

    // 初期配布
    player.addCard(deck.draw());
    player.addCard(deck.draw());
    dealer.addCard(deck.draw());
    dealer.addCard(deck.draw());

    // 🏆 追加：結果メッセージを空にする
    document.getElementById("result-message").innerText = "";
    // スキルボタンの見た目を戻す（必要であれば）
    document.getElementById("peek-btn").style.opacity = "1";

    updateDisplay(false); // 画面を更新
}

// ヒットボタンを押した時
function hit() {
    if (isGameOver) return; // 🏆 追加：終了後は反応しない

    player.addCard(deck.draw());
    if (player.calculateScore() > 21) {
        isGameOver = true; // バーストしたので終了
        updateDisplay(true);
        // 🏆 修正：alertではなく赤文字メッセージに表示
        document.getElementById("result-message").innerText = "バースト！あなたの負けです。";
    } else {
        updateDisplay(false);
    }
}

// スタンドボタンを押した時
function stand() {
    if (isGameOver) return; // 🏆 追加：終了後は反応しない
    isGameOver = true;

    while (dealer.calculateScore() < 17) {
        dealer.addCard(deck.draw());
    }
    updateDisplay(true);
    judge();
}

// 透視スキルボタンを押した時
function peek() {
    if (canPeek && !isGameOver) {
        const secretCard = dealer.hand[0];
        // 透視結果は、戦略に関わるため今のところalertのままにしていますが、
        // これも画面表示にしたい場合はお知らせください。
        alert("【スキル発動】ディーラーの伏せカードは " + secretCard.suit + secretCard.rank + " です！");
        canPeek = false;
        document.getElementById("peek-btn").style.opacity = "0.5"; // 使用済みを分かりやすく
    }
}

// 勝敗判定
function judge() {
    const pScore = player.calculateScore();
    const dScore = dealer.calculateScore();
    let resultText = "";

    if (dScore > 21) {
        resultText = "ディーラーがバースト！あなたの勝ち！";
    } else if (pScore > dScore) {
        resultText = "あなたの勝ち！";
    } else if (pScore < dScore) {
        resultText = "ディーラーの勝ち...";
    } else {
        resultText = "引き分け！";
    }
    
    // 🏆 修正：alertではなく赤文字メッセージに表示
    document.getElementById("result-message").innerText = resultText;
}

// 画面を書き換える関数（HTMLとの繋ぎ込み）
function updateDisplay(isFinished) {
    const playerHandDiv = document.getElementById("player-hand");
    const dealerHandDiv = document.getElementById("dealer-hand");

    // 🏆 修正：プレイヤーの手札を画像で表示
    playerHandDiv.innerHTML = player.hand.map(card => 
        `<img src="${card.getImagePath()}" class="card-img">`
    ).join("");
    document.getElementById("player-score").innerText = player.calculateScore();

    if (isFinished) {
        // 🏆 修正：終了時はディーラーもすべて画像で表示
        dealerHandDiv.innerHTML = dealer.hand.map(card => 
            `<img src="${card.getImagePath()}" class="card-img">`
        ).join("");
        document.getElementById("dealer-score").innerText = dealer.calculateScore();
    } else {
        // 🏆 修正：ゲーム中は1枚目を裏面画像に
        // 裏面画像は53番目と想定（torannpu-illust53.png）
        const backCardTag = `<img src="./torannpu-illust53.png" class="card-img">`;
        const visibleCardsTags = dealer.hand.slice(1).map(card => 
            `<img src="${card.getImagePath()}" class="card-img">`
        ).join("");
        
        dealerHandDiv.innerHTML = backCardTag + visibleCardsTags;
        document.getElementById("dealer-score").innerText = "?";
    }
}

// ページを読み込んだらゲーム開始
window.onload = initGame;
import java.util.Scanner;

public class Blackjack {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Deck deck = new Deck();
        Player player = new Player();
        Player dealer = new Player();
        boolean canPeek = true; // 透視スキル使用可否

        System.out.println("=== Blackjack Skill Edition ===");
        deck.shuffle();

        // 初期配布
        player.addCard(deck.draw());
        player.addCard(deck.draw());
        dealer.addCard(deck.draw());
        dealer.addCard(deck.draw());

        // プレイヤーターン
        while (true) {
            System.out.println("\nディーラーの手札: [???], " + dealer.getHand().get(1));
            System.out.println("あなたの手札: " + player.getHand() + " (計: " + player.calculateScore() + ")");
            
            System.out.print("1:ヒット 2:スタンド");
            if (canPeek) System.out.print(" 3:スキル(透視)");
            System.out.print(" > ");

            String choice = scanner.nextLine();

            if (choice.equals("1")) {
                player.addCard(deck.draw());
                if (player.calculateScore() > 21) {
                    System.out.println("バースト！手札: " + player.getHand() + " (計: " + player.calculateScore() + ")");
                    System.out.println("あなたの負けです。");
                    return;
                }
            } else if (choice.equals("2")) {
                break;
            } else if (choice.equals("3") && canPeek) {
                System.out.println("[スキル発動] ディーラーの伏せカードは " + dealer.getHand().get(0) + " です！");
                canPeek = false;
            }
        }

        // ディーラーターン (17以上になるまで引く)
        System.out.println("\n--- ディーラーのターン ---");
        while (dealer.calculateScore() < 17) {
            dealer.addCard(deck.draw());
        }

        // 結果判定
        int pScore = player.calculateScore();
        int dScore = dealer.calculateScore();
        System.out.println("ディーラーの手札: " + dealer.getHand() + " (計: " + dScore + ")");
        System.out.println("あなたの合計: " + pScore);

        if (dScore > 21 || pScore > dScore) {
            System.out.println("あなたの勝ち！");
        } else if (pScore < dScore) {
            System.out.println("ディーラーの勝ち...");
        } else {
            System.out.println("引き分け！");
        }
    }
}
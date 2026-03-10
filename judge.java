import java.util.ArrayList;
import java.util.List;

public class Player {
    private List<Card> hand;

    public Player() {
        hand = new ArrayList<>();
    }

    public void addCard(Card card) {
        hand.add(card);
    }

    public int calculateScore() {
        int score = 0;
        int aceCount = 0;
        for (Card card : hand) {
            score += card.getPoint();
            if (card.getRank().equals("A")) aceCount++;
        }
        // スコアが21を超えている間、Aを11から1に読み替える
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    public List<Card> getHand() {
        return hand;
    }

    public void clearHand() {
        hand.clear();
    }
}
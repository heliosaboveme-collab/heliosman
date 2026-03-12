public class Card {
    private String suit; // マーク (♥, ♦, ♠, ♣)
    private String rank; // 数字 (A, 2-10, J, Q, K)

    public Card(String suit, String rank) {
        this.suit = suit;
        this.rank = rank;
    }

    public int getPoint() {
        if (rank.equals("A")) return 11;
        if (rank.equals("J") || rank.equals("Q") || rank.equals("K")) return 10;
        return Integer.parseInt(rank);
    }

    public String getRank() {
        return rank;
    }

    @Override
    public String toString() {
        return "[" + suit + " " + rank + "]";
    }
}
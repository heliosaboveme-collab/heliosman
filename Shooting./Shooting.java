import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.util.ArrayList;

/**
 * メインウィンドウ設定
 */
public class Shooting extends JFrame {
    public Shooting() {
        setSize(750, 500);
        setTitle("Java Shooting Game - Professional Edition");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setResizable(false);

        MyJPanel myJPanel = new MyJPanel();
        add(myJPanel);
        
        setVisible(true);
    }

    public static void main(String[] args) {
        new Shooting();
    }
}

/**
 * ゲームの描画・ロジック管理
 */
class MyJPanel extends JPanel implements MouseListener, MouseMotionListener, ActionListener {
    // 定数
    private final int JIKI_Y = 400;
    private final int JIKI_W = 40, JIKI_H = 40;

    // ゲーム状態
    private int jikiX = 350;
    private ArrayList<Enemy> enemies = new ArrayList<>();
    private ArrayList<Bullet> playerBullets = new ArrayList<>();
    private ArrayList<Bullet> enemyBullets = new ArrayList<>();
    private Timer timer;
    private boolean isGameOver = false;
    private boolean isClear = false;

    public MyJPanel() {
        setBackground(Color.BLACK);
        
        // 敵機の初期配置
        for (int i = 0; i < 13; i++) {
            enemies.add(new Enemy(i * 50 + 100, (i % 2) * 40 + 20));
        }

        addMouseListener(this);
        addMouseMotionListener(this);

        // 33ms = 約30FPSで更新
        timer = new Timer(33, this);
        timer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        // 自機の描画
        g.setColor(Color.BLUE);
        g.fillRect(jikiX, JIKI_Y, JIKI_W, JIKI_H);

        // 自機の弾
        g.setColor(Color.YELLOW);
        for (Bullet b : playerBullets) g.fillOval(b.x, b.y, 6, 12);

        // 敵機
        g.setColor(Color.RED);
        for (Enemy en : enemies) g.fillRect(en.x, en.y, 30, 30);

        // 敵機の弾
        g.setColor(Color.WHITE);
        for (Bullet b : enemyBullets) g.fillOval(b.x, b.y, 5, 5);

        // 文字情報
        if (isGameOver) drawMessage(g, "GAME OVER");
        if (isClear) drawMessage(g, "STAGE CLEAR!");
    }

    private void drawMessage(Graphics g, String msg) {
        g.setColor(Color.ORANGE);
        g.setFont(new Font("SansSerif", Font.BOLD, 50));
        g.drawString(msg, 230, 250);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (isGameOver || isClear) return;

        // 1. 自機の弾の移動と判定
        for (int i = playerBullets.size() - 1; i >= 0; i--) {
            Bullet b = playerBullets.get(i);
            b.y -= 15;
            if (b.y < 0) playerBullets.remove(i);
        }

        // 2. 敵機の移動と当たり判定
        for (int i = enemies.size() - 1; i >= 0; i--) {
            Enemy en = enemies.get(i);
            en.move(getWidth());

            // 自機弾との衝突
            for (int j = playerBullets.size() - 1; j >= 0; j--) {
                Bullet b = playerBullets.get(j);
                if (en.getBounds().contains(b.x, b.y)) {
                    enemies.remove(i);
                    playerBullets.remove(j);
                    break;
                }
            }

            // 敵の弾を発射するロジック（確率）
            if (Math.random() < 0.02) {
                enemyBullets.add(new Bullet(en.x + 15, en.y + 30));
            }
        }

        // 3. 敵機の弾の移動と判定
        for (int i = enemyBullets.size() - 1; i >= 0; i--) {
            Bullet b = enemyBullets.get(i);
            b.y += 8;
            if (b.y > getHeight()) {
                enemyBullets.remove(i);
            } else if (new Rectangle(jikiX, JIKI_Y, JIKI_W, JIKI_H).contains(b.x, b.y)) {
                isGameOver = true;
            }
        }

        if (enemies.isEmpty()) isClear = true;
        repaint();
    }

    // マウスイベント
    public void mouseMoved(MouseEvent e) {
        jikiX = e.getX() - JIKI_W / 2;
        if (jikiX < 0) jikiX = 0;
        if (jikiX > getWidth() - JIKI_W) jikiX = getWidth() - JIKI_W;
        repaint();
    }

    public void mouseClicked(MouseEvent e) {
        if (playerBullets.size() < 3) { // 同時発射制限
            playerBullets.add(new Bullet(jikiX + JIKI_W / 2 - 3, JIKI_Y));
        }
    }

    // 未使用メソッド
    public void mousePressed(MouseEvent e) {}
    public void mouseReleased(MouseEvent e) {}
    public void mouseEntered(MouseEvent e) {}
    public void mouseExited(MouseEvent e) {}
    public void mouseDragged(MouseEvent e) {}
}

/**
 * 敵機クラス（データと振る舞いをカプセル化）
 */
class Enemy {
    int x, y, speed;
    public Enemy(int x, int y) {
        this.x = x; this.y = y;
        this.speed = (int)(Math.random() * 5) + 3;
    }
    public void move(int width) {
        x += speed;
        if (x < 0 || x > width - 30) speed *= -1;
    }
    public Rectangle getBounds() {
        return new Rectangle(x, y, 30, 30);
    }
}

/**
 * 弾クラス
 */
class Bullet {
    int x, y;
    public Bullet(int x, int y) {
        this.x = x; this.y = y;
    }
}
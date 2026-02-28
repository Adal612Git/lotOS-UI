import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.table.DefaultTableModel;

public final class App {
    private App() {
    }

    private static JPanel createStatCard(String label, String value, String helper) {
        JPanel card = new JPanel(new BorderLayout(0, 8));
        card.setBackground(new Color(17, 31, 52));
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(64, 96, 148), 1),
            BorderFactory.createEmptyBorder(14, 14, 14, 14)
        ));

        JLabel labelView = new JLabel(label.toUpperCase());
        labelView.setForeground(new Color(159, 176, 210));
        labelView.setFont(new Font("Segoe UI", Font.BOLD, 12));

        JLabel valueView = new JLabel(value);
        valueView.setForeground(new Color(232, 238, 252));
        valueView.setFont(new Font("Segoe UI", Font.BOLD, 26));

        JLabel helperView = new JLabel(helper);
        helperView.setForeground(new Color(127, 147, 184));
        helperView.setFont(new Font("Segoe UI", Font.PLAIN, 12));

        card.add(labelView, BorderLayout.NORTH);
        card.add(valueView, BorderLayout.CENTER);
        card.add(helperView, BorderLayout.SOUTH);
        return card;
    }

    private static JTable createTable() {
        DefaultTableModel model = new DefaultTableModel(
            new Object[][] {
                {"React", "Stable", "Public package"},
                {".NET", "Stable", "Desktop and adapter"},
                {"Java", "Ready", "Desktop demo"},
                {"Rust", "Ready", "Desktop demo"}
            },
            new Object[] {"Runtime", "Status", "Delivery"}
        );
        JTable table = new JTable(model);
        table.setRowHeight(28);
        table.setFillsViewportHeight(true);
        table.setBackground(new Color(12, 27, 52));
        table.setForeground(new Color(232, 238, 252));
        table.setGridColor(new Color(42, 66, 102));
        table.getTableHeader().setBackground(new Color(17, 31, 52));
        table.getTableHeader().setForeground(new Color(159, 176, 210));
        return table;
    }

    private static void showDialog(JFrame owner) {
        JDialog dialog = new JDialog(owner, "LotOS Delivery", true);
        dialog.setLayout(new BorderLayout(0, 16));
        dialog.getContentPane().setBackground(new Color(9, 20, 37));
        dialog.getRootPane().setBorder(BorderFactory.createEmptyBorder(18, 18, 18, 18));

        JLabel text = new JLabel("<html>Java desktop demo is running.<br/>This shell is ready for runtime-specific actions.</html>");
        text.setForeground(new Color(232, 238, 252));
        text.setFont(new Font("Segoe UI", Font.PLAIN, 14));

        JButton close = new JButton("Close");
        close.addActionListener((event) -> dialog.dispose());

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        footer.setOpaque(false);
        footer.add(close);

        dialog.add(text, BorderLayout.CENTER);
        dialog.add(footer, BorderLayout.SOUTH);
        dialog.setSize(new Dimension(360, 180));
        dialog.setLocationRelativeTo(owner);
        dialog.setVisible(true);
    }

    private static JFrame createFrame() {
        JFrame frame = new JFrame("LotOS UI Java Desktop Demo");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getContentPane().setBackground(new Color(9, 20, 37));
        frame.setLayout(new BorderLayout(16, 16));

        JPanel header = new JPanel(new BorderLayout(0, 8));
        header.setOpaque(false);
        header.setBorder(BorderFactory.createEmptyBorder(16, 16, 0, 16));

        JLabel title = new JLabel("LotOS UI Desktop Control Surface");
        title.setForeground(new Color(232, 238, 252));
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));

        JLabel subtitle = new JLabel("Java Swing delivery shell aligned with the same runtime story.");
        subtitle.setForeground(new Color(159, 176, 210));
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 14));

        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);

        JPanel stats = new JPanel(new GridLayout(1, 3, 12, 12));
        stats.setOpaque(false);
        stats.setBorder(BorderFactory.createEmptyBorder(0, 16, 0, 16));
        stats.add(createStatCard("Queue", "19", "Items waiting"));
        stats.add(createStatCard("Throughput", "98.4%", "Current completion rate"));
        stats.add(createStatCard("Escalations", "2", "Manual reviews pending"));

        JPanel center = new JPanel(new BorderLayout(16, 16));
        center.setOpaque(false);
        center.setBorder(BorderFactory.createEmptyBorder(0, 16, 16, 16));
        center.add(new JScrollPane(createTable()), BorderLayout.CENTER);

        JButton action = new JButton("Open delivery modal");
        action.addActionListener((event) -> showDialog(frame));
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        footer.setOpaque(false);
        footer.add(action);

        frame.add(header, BorderLayout.NORTH);
        frame.add(stats, BorderLayout.CENTER);
        frame.add(center, BorderLayout.SOUTH);
        frame.add(footer, BorderLayout.PAGE_END);
        frame.setSize(920, 600);
        frame.setLocationRelativeTo(null);
        return frame;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {
            }
            createFrame().setVisible(true);
        });
    }
}

package tr.org.kamp.linux.agarioclone.view;

import javax.swing.JFrame;

public class GameFrame extends JFrame {

	public GameFrame() {
		setTitle("Agario Clone");
		setResizable(true);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setSize(640, 480);
		setLocationRelativeTo(null);
	}

}

package tr.org.kamp.linux.agarioclone.view;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.util.ArrayList;

import javax.swing.JPanel;

import tr.org.kamp.linux.agarioclone.model.GameObject;

public class GamePanel extends JPanel{

	private ArrayList<GameObject> gameObjects;
	
	public GamePanel(ArrayList<GameObject> gameObjects) {
		this.gameObjects = gameObjects;
	}
	
	@Override
	protected synchronized void paintComponent(Graphics g) {
		super.paintComponent(g);
		
		Graphics2D g2d = (Graphics2D)g;
		
		for (GameObject gameObject : gameObjects) {
			gameObject.draw(g2d);
		}
	}
}

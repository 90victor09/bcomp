package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLElement;

import ru.ifmo.cs.bcomp.ui.CLI;

public class BCompCLI extends CLI {
	private final Object lineLock = new Object();
	private String lineInput;
	private Thread loop = new Thread(this::cli);

	public BCompCLI() throws Exception {
		super();
		println("Эмулятор Базовой ЭВМ.\n" +
				"БЭВМ готова к работе.\n" +
				"Используйте ? или help для получения справки");
		loop.start();
	}

	@Override
	public void cli(){
		String line;
		while(true){
			try{
				line = fetchLine();
			}catch(Exception e){
				break;
			}
			processLine(line);
		}
	}

	@Override
	protected String fetchLine() throws Exception {
		synchronized(lineLock){
			lineLock.wait();
			return lineInput;
		}
	}

	public void enterLine(String line){
		println("> " + line);
		lineInput = line;
		synchronized(lineLock){
			lineLock.notify();
		}
	}



	private HTMLElement console = HTMLDocument.current().getElementById("console");
	protected void println(String str){
		console.appendChild(console.getOwnerDocument().createTextNode(str + "\n"));
	}
}
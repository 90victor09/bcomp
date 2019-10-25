package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLElement;

import ru.ifmo.cs.bcomp.ui.CLI;

public class BCompCLI extends CLI {
	private boolean asmNeedMoreCode = false;
	private String asmCode = "";
	public BCompCLI() throws Exception {
		super();
		println("Эмулятор Базовой ЭВМ.\n" +
				"БЭВМ готова к работе.\n" +
				"Используйте ? или help для получения справки");
	}

	public void enterLine(String line){
		println("> " + line);
		if(asmNeedMoreCode){
			if(line.equalsIgnoreCase("END")) {
				asmNeedMoreCode = false;

				printOnStop = false;
//						asm.compileProgram(code);
//						asm.loadProgram(cpu);
//						println("Программа начинается с адреса " + Utils.toHex(asm.getBeginAddr(), 11));
				printOnStop = true;

				return;
			}

			asmCode = asmCode.concat(line.concat("\n"));
			return;
		}
		processLine(line);
	}


	protected void processAsm(){
		asmNeedMoreCode = true;
	}

	HTMLElement console = (HTMLElement) HTMLDocument.current().getElementById("console");
	protected void println(String str){
		console.appendChild(console.getOwnerDocument().createTextNode(str + "\n"));
	}
}
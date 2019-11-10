package ru.ifmo.cs.bcomp.js.glue.components;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSObject;
import org.teavm.jso.dom.html.HTMLElement;
import ru.ifmo.cs.bcomp.js.BCompCLI;
import ru.ifmo.cs.bcomp.js.glue.GlueComponent;

@SuppressWarnings("unused")
public class ConsoleGlue {
	enum CMD {
		INIT_CLI,
		ENTER_LINE
	}
	private static GlueComponent<CMD> glue = new GlueComponent<>(ConsoleGlue::execute);
	private static BCompCLI cli;
//	private static HTMLElement console;

	@SuppressWarnings("unused")
	@JSBody(params = {"console"}, script = "var c = {};"
	+ "javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.ConsoleGlue.init(Lorg/teavm/jso/dom/html/HTMLElement;)V').invoke(console);"
	+ "c.enterLine = function(line){ return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.ConsoleGlue.enterLine(Ljava/lang/String;)V').invoke(line); };"
	+ "return c;")
	public static native JSObject glue(HTMLElement console);

	@SuppressWarnings("unused")
	public static void init(HTMLElement el) {
		glue.sendCmd(CMD.INIT_CLI, null, el);
	}
	@SuppressWarnings("unused")
	public static void enterLine(String line){
		glue.sendCmd(CMD.ENTER_LINE, null, line);
	}

	private static Object execute(CMD type, Object... args){
		if(type == CMD.INIT_CLI){
			try {
				cli = new BCompCLI((HTMLElement) args[0]);
			}catch(Throwable e){
				e.printStackTrace();
			}
		}else if(type == CMD.ENTER_LINE){
			cli.enterLine((String) args[0]);
		}

		return null;
	}
}

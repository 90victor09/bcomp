package ru.ifmo.cs.bcomp.js.glue.components;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSObject;
import org.teavm.jso.dom.html.HTMLElement;
import ru.ifmo.cs.bcomp.js.BCompCLI;
import ru.ifmo.cs.bcomp.js.glue.GlueComponent;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueVoidResultListener;

@SuppressWarnings("unused")
public class ConsoleGlue {
	private final static String consoleGlue = "ru.ifmo.cs.bcomp.js.glue.components.ConsoleGlue";
	enum CMD {
		INIT_CLI,
		ENTER_LINE,
		SYNC
	}
	private static GlueComponent<CMD> glue = new GlueComponent<>(ConsoleGlue::execute);
	public static BCompCLI cli;  //TODO private this
//	private static HTMLElement console;

	@SuppressWarnings("unused")
	@JSBody(params = {"console"}, script = "var c = {};"
	+ "javaMethods.get('" + consoleGlue + ".init(Lorg/teavm/jso/dom/html/HTMLElement;)V').invoke(console);"
	+ "c.enterLine = function(line){ return javaMethods.get('" + consoleGlue + ".enterLine(Ljava/lang/String;)V').invoke(line); };"
	+ "c.sync = function(line){ return javaMethods.get('" + consoleGlue + ".sync(Lru/ifmo/cs/bcomp/js/glue/listeners/GlueVoidResultListener;)V').invoke(line); };"
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

	public static void sync(GlueVoidResultListener listener){
		glue.sendCmd(CMD.SYNC, result -> listener.process());
	}
	private static Object execute(CMD type, Object... args){
		switch(type){
			case INIT_CLI:
				try {
					cli = new BCompCLI((HTMLElement) args[0]);
				}catch(Throwable e){
					e.printStackTrace();
				}
				break;
			case ENTER_LINE:
				cli.enterLine((String) args[0]);
				break;
			case SYNC:
				break;
		}

		return null;
	}
}

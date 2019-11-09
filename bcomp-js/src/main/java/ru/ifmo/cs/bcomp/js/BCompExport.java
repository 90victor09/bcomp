package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.JSBody;

public class BCompExport {
	public static void main(String[] args) {
		export();
	}

	@JSBody(script="window.bcomp = {};"
		+ "window.bcomp.startCLI = function(el){"
			+ "return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.impl.ConsoleGlue.glue(Lorg/teavm/jso/dom/html/HTMLElement;)Lorg/teavm/jso/JSObject;').invoke(el);"
		+ "}")
	private static native void export();
}

package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.JSBody;
import ru.ifmo.cs.bcomp.Reg;
import ru.ifmo.cs.bcomp.RunningCycle;

public class BCompExport {
	public static void main(String[] args) {
		export();
	}

	@JSBody(script="window.bcomp = {};"
		+ "window.bcomp.regs = javaMethods.get('ru.ifmo.cs.bcomp.js.BCompExport.exportRegs()[Ljava/lang/String;').invoke();"
		+ "window.bcomp.runningCycles = javaMethods.get('ru.ifmo.cs.bcomp.js.BCompExport.exportRunningCycles()[Ljava/lang/String;').invoke();"
		+ "window.bcomp.startCLI = function(el){"
			+ "return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.ConsoleGlue.glue(Lorg/teavm/jso/dom/html/HTMLElement;)Lorg/teavm/jso/JSObject;').invoke(el);"
		+ "};"
		+ "window.bcomp.startAngular = function(){"
			+ "return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.AngularGlue.glue()Lorg/teavm/jso/JSObject;').invoke();"
		+ "};")
	private static native void export();

	@SuppressWarnings("unused")
	public static String[] exportRegs(){
		String[] regs = new String[Reg.values().length];
		for(int i = 0; i < regs.length; i++)
			regs[i] = Reg.values()[i].name();
		return regs;
	}
	@SuppressWarnings("unused")
	public static String[] exportRunningCycles(){
		String[] cycles = new String[RunningCycle.values().length];
		for(int i = 0; i < cycles.length; i++)
			cycles[i] = RunningCycle.values()[i].name();
		return cycles;
	}
}

package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.JSBody;
import ru.ifmo.cs.bcomp.ControlSignal;
import ru.ifmo.cs.bcomp.Reg;
import ru.ifmo.cs.bcomp.RunningCycle;
import ru.ifmo.cs.bcomp.State;

import java.util.Arrays;

public class BCompExport {
	private final static String bcompExport = "ru.ifmo.cs.bcomp.js.BCompExport";
	private final static String componentsPackage = "ru.ifmo.cs.bcomp.js.glue.components";
	private static final String listenersPackage = "ru/ifmo/cs/bcomp/js/glue/listeners/";
	public static void main(String[] args) {
		export();
	}

	@JSBody(script="window.bcomp = { regs: {}, runningCycles: {}, controlSignals:{}, states:{} };"
		+ "javaMethods.get('" + bcompExport + ".exportEnums()V').invoke();"
		+ "window.bcomp.startCLI = function(el){"
			+ "return javaMethods.get('" + componentsPackage + ".ConsoleGlue.glue(Lorg/teavm/jso/dom/html/HTMLElement;)Lorg/teavm/jso/JSObject;').invoke(el);"
		+ "};"
		+ "window.bcomp.startAngular = function(cb){"
			+ "return javaMethods.get('" + componentsPackage + ".AngularGlue.glue(L" + listenersPackage + "GlueVoidResultListener;)Lorg/teavm/jso/JSObject;').invoke(cb);"
		+ "};"
		+ "window.bcomp.startFrankenstein = function(cb){"  //TODO delete this
			+ "return javaMethods.get('" + componentsPackage + ".AngularGlue.frankenstein(L" + listenersPackage + "GlueVoidResultListener;)Lorg/teavm/jso/JSObject;').invoke(cb);"
		+ "};")
	private static native void export();

	@SuppressWarnings("unused")
	public static void exportEnums(){
		exportStringArrayProperty("regs", (String[]) Arrays.stream(Reg.values()).map(Enum::name).toArray());
		exportStringArrayProperty("runningCycles", (String[]) Arrays.stream(RunningCycle.values()).map(Enum::name).toArray());
		exportStringArrayProperty("controlSignals", (String[]) Arrays.stream(ControlSignal.values()).map(Enum::name).toArray());
		exportStringArrayProperty("states", (String[]) Arrays.stream(State.values()).map(Enum::name).toArray());
	}

	@JSBody(params = {"propName","propVal"}, script = "window.bcomp[propName] = propVal")
	private static native void exportStringArrayProperty(String propName, String[] propVal);
}

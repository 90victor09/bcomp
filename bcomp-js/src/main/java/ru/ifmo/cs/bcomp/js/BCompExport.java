package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.JSBody;
import ru.ifmo.cs.bcomp.ControlSignal;
import ru.ifmo.cs.bcomp.Reg;
import ru.ifmo.cs.bcomp.RunningCycle;
import ru.ifmo.cs.bcomp.State;

import java.util.Arrays;

public class BCompExport {
	private final static String targetVar = "window.bcomp";
	private final static String bcompExport = "ru.ifmo.cs.bcomp.js.BCompExport";
	private final static String componentsPackage = "ru.ifmo.cs.bcomp.js.glue.components";
	private final static String listenersPackage = "ru/ifmo/cs/bcomp/js/glue/listeners/";
	private final static String jsObj = "Lorg/teavm/jso/JSObject;";
	public static void main(String[] args) {
		export();
	}

	@JSBody(script=targetVar+" = { regs: {}, runningCycles: {}, controlSignals:{}, states:{} };"
		+ "javaMethods.get('" + bcompExport + ".exportEnums()V').invoke();"
		+ targetVar + ".sleep = function(ms){ return javaMethods.get('" + bcompExport + ".sleep(I)V').invoke(ms); };"
		+ targetVar + ".startCLI = function(el){"
			+ "return javaMethods.get('" + componentsPackage + ".ConsoleGlue.glue(Lorg/teavm/jso/dom/html/HTMLElement;)" + jsObj + "').invoke(el);"
		+ "};"
		+ targetVar + ".startAngular = function(cb){"
			+ "return javaMethods.get('" + componentsPackage + ".AngularGlue.glue(L" + listenersPackage + "GlueVoidResultListener;)" + jsObj + "').invoke(cb);"
		+ "};"
		+ targetVar + ".startFrankenstein = function(cb){"  //TODO delete this
			+ "return javaMethods.get('" + componentsPackage + ".AngularGlue.frankenstein(L" + listenersPackage + "GlueVoidResultListener;)" + jsObj + "').invoke(cb);"
		+ "};")
	private static native void export();

	public static void sleep(int ms){
		try{
			Thread.sleep(ms);
		}catch(InterruptedException e){
			e.printStackTrace();
		}
	}
	@SuppressWarnings("unused")
	public static void exportEnums(){
		exportEnum("regs", (String[]) Arrays.stream(Reg.values()).map(Enum::name).toArray());
		exportEnum("runningCycles", (String[]) Arrays.stream(RunningCycle.values()).map(Enum::name).toArray());
		exportEnum("controlSignals", (String[]) Arrays.stream(ControlSignal.values()).map(Enum::name).toArray());
		exportEnum("states", (String[]) Arrays.stream(State.values()).map(Enum::name).toArray());
	}

	@JSBody(params = {"enumName", "names"}, script =
		targetVar + "[enumName] = " + targetVar + "[enumName] || {};"
		+ "for(var i = 0; i < names.length; i++)"
			+ targetVar + "[enumName][" + targetVar + "[enumName][names[i]] = i] = names[i];")
	private static native void exportEnum(String enumName, String[] names);
}

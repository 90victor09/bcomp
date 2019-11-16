package ru.ifmo.cs.bcomp.js.glue.components;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSObject;
import ru.ifmo.cs.bcomp.ControlSignal;
import ru.ifmo.cs.bcomp.Reg;
import ru.ifmo.cs.bcomp.js.BCompAngular;
import ru.ifmo.cs.bcomp.js.glue.GlueComponent;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueBCompSignalListener;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueIntegerResultListener;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueStringResultListener;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueVoidResultListener;

@SuppressWarnings("unused")
public class AngularGlue {
	private static final String angularGlue = "ru.ifmo.cs.bcomp.js.glue.components.AngularGlue";
	private static final String listenersPackage = "ru/ifmo/cs/bcomp/js/glue/listeners/";
	enum CMD {
		INIT,
		GET_REG_VALUE,
		GET_REG_WIDTH,
		GET_RUNNING_CYCLE,
		ADD_SIGNAL_LISTENER,
		SET_TICK_START_LISTENER,
		SET_TICK_FINISH_LISTENER
	}
	private static GlueComponent<CMD> glue = new GlueComponent<>(AngularGlue::execute);
	private static BCompAngular bcomp;

	@SuppressWarnings("unused")
	@JSBody(params = {"listener"}, script = "var a = {};"
			+ "javaMethods.get('" + angularGlue + ".init(ZL" + listenersPackage + "GlueVoidResultListener;)V').invoke(false, listener);"
			+ "a.getRegValue = function(reg, cb){ return javaMethods.get('" + angularGlue + ".getRegValue(Ljava/lang/String;L" + listenersPackage + "GlueStringResultListener;)V').invoke(reg, cb); };"
			+ "a.getRegWidth = function(reg, cb){ return javaMethods.get('" + angularGlue + ".getRegWidth(Ljava/lang/String;L" + listenersPackage + "GlueIntegerResultListener;)V').invoke(reg, cb); };"
			+ "a.getRunningCycle = function(cb){ return javaMethods.get('" + angularGlue + ".getRunningCycle(L" + listenersPackage + "GlueStringResultListener;)V').invoke(cb); };"
			+ "a.addSignalListener = function(sig, cb){ return javaMethods.get('" + angularGlue + ".addSignalListener(Ljava/lang/String;L" + listenersPackage + "GlueBCompSignalListener;)V').invoke(sig, cb); };"
			+ "a.setTickStartListener = function(cb){ return javaMethods.get('" + angularGlue + ".setTickStartListener(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"
			+ "a.setTickFinishListener = function(cb){ return javaMethods.get('" + angularGlue + ".setTickFinishListener(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"
			+ "return a;")
	public static native JSObject glue(GlueVoidResultListener listener);

	@SuppressWarnings("unused")
	@JSBody(params = {"listener"}, script = "var a = {};"  //TODO delete this
			+ "javaMethods.get('" + angularGlue + ".init(ZL" + listenersPackage + "GlueVoidResultListener;)V').invoke(true, listener);"
			+ "a.getRegValue = function(reg, cb){ return javaMethods.get('" + angularGlue + ".getRegValue(Ljava/lang/String;L" + listenersPackage + "GlueStringResultListener;)V').invoke(reg, cb); };"
			+ "a.getRegWidth = function(reg, cb){ return javaMethods.get('" + angularGlue + ".getRegWidth(Ljava/lang/String;L" + listenersPackage + "GlueIntegerResultListener;)V').invoke(reg, cb); };"
			+ "a.getRunningCycle = function(cb){ return javaMethods.get('" + angularGlue + ".getRunningCycle(L" + listenersPackage + "GlueStringResultListener;)V').invoke(cb); };"
			+ "a.addSignalListener = function(sig, cb){ return javaMethods.get('" + angularGlue + ".addSignalListener(Ljava/lang/String;L" + listenersPackage + "GlueBCompSignalListener;)V').invoke(sig, cb); };"
			+ "a.setTickStartListener = function(cb){ return javaMethods.get('" + angularGlue + ".setTickStartListener(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"
			+ "a.setTickFinishListener = function(cb){ return javaMethods.get('" + angularGlue + ".setTickFinishListener(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"
			+ "return a;")
	public static native JSObject frankenstein(GlueVoidResultListener listener);

//	@SuppressWarnings("unused")
//	public static void init() {
//		glue.sendCmd(CMD.INIT, null);
//	}
	public static void init(boolean b, GlueVoidResultListener listener) {
		if(!b){
			glue.sendCmd(CMD.INIT, (result) -> listener.process());
		}else{
			glue.sendCmd(CMD.INIT, (result -> listener.process()), true);
		}
	}
	@SuppressWarnings("unused")
	public static void getRegValue(String reg, GlueStringResultListener listener){
		glue.sendCmd(CMD.GET_REG_VALUE, result -> listener.process((String) result), reg);
	}
	@SuppressWarnings("unused")
	public static void getRegWidth(String reg, GlueIntegerResultListener listener){
		glue.sendCmd(CMD.GET_REG_WIDTH, result -> listener.process((Integer) result), reg);
	}
	@SuppressWarnings("unused")
	public static void getRunningCycle(GlueStringResultListener listener){
		glue.sendCmd(CMD.GET_RUNNING_CYCLE, result -> listener.process((String) result));
	}
	public static void addSignalListener(String signal, GlueBCompSignalListener listener){
		glue.sendCmd(CMD.ADD_SIGNAL_LISTENER, null, signal, listener);
	}
	public static void setTickStartListener(GlueVoidResultListener listener){
		glue.sendCmd(CMD.SET_TICK_START_LISTENER, null, listener);
	}
	public static void setTickFinishListener(GlueVoidResultListener listener){
		glue.sendCmd(CMD.SET_TICK_FINISH_LISTENER, null, listener);
	}


	private static Object execute(CMD type, Object... args){
		switch(type){
			case INIT:
				if(args.length == 0)
					bcomp = new BCompAngular();
				else
					bcomp = new BCompAngular(ConsoleGlue.cli.bcomp);  //TODO delete this
				break;
			case GET_REG_VALUE:
				return bcomp.getRegValue(Reg.valueOf((String) args[0]));
			case GET_REG_WIDTH:
				return bcomp.getRegWidth(Reg.valueOf((String) args[0]));
			case GET_RUNNING_CYCLE:
				return bcomp.getRunningCycle();
			case ADD_SIGNAL_LISTENER:
				bcomp.addSignalListener(ControlSignal.valueOf((String) args[0]), (GlueBCompSignalListener) args[1]);
				break;
			case SET_TICK_START_LISTENER:
				bcomp.setTickStartListener((GlueVoidResultListener) args[0]);
				break;
			case SET_TICK_FINISH_LISTENER:
				bcomp.setTickFinishListener((GlueVoidResultListener) args[0]);
				break;
		}
		return null;
	}
}

package ru.ifmo.cs.bcomp.js.glue.components;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSObject;
import ru.ifmo.cs.bcomp.ControlSignal;
import ru.ifmo.cs.bcomp.Reg;
import ru.ifmo.cs.bcomp.js.BCompAngular;
import ru.ifmo.cs.bcomp.js.glue.GlueComponent;
import ru.ifmo.cs.bcomp.js.glue.listeners.*;

/*
 * XXX: Overflow long -> double
 */

@SuppressWarnings("unused")
public class AngularGlue {
	private static final String angularGlue = "ru.ifmo.cs.bcomp.js.glue.components.AngularGlue";
	private static final String listenersPackage = "ru/ifmo/cs/bcomp/js/glue/listeners/";
	enum CMD {
		INIT,
		SYNC,

		SET_REG_VALUE,
		GET_REG_VALUE,
		GET_REG_WIDTH,

		GET_RUNNING_CYCLE,

		ADD_SIGNAL_LISTENER,
		SET_TICK_START_LISTENER,
		SET_TICK_FINISH_LISTENER,

		EXECUTE_CONTINUE,

		SET_MEMORY_VALUE,
		GET_MEMORY_VALUE,
		GET_LAST_ACCESSED_MEMORY_ADDRESS,

		DECODE_MC
	}
	private static GlueComponent<CMD> glue = new GlueComponent<>(AngularGlue::execute);
	private static BCompAngular bcomp;

	private static final String script =
			"a.sync = function(listener){ return javaMethods.get('" + angularGlue + ".sync(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(listener); };"
			+ "a.setRegValue = function(reg, value){ return javaMethods.get('" + angularGlue + ".setRegValue(ID)V').invoke(reg, value); };"
			+ "a.getRegValue = function(reg, cb){ return javaMethods.get('" + angularGlue + ".getRegValue(IL" + listenersPackage + "GlueDoubleResultListener;)V').invoke(reg, cb); };"
			+ "a.getRegWidth = function(reg, cb){ return javaMethods.get('" + angularGlue + ".getRegWidth(IL" + listenersPackage + "GlueIntegerResultListener;)V').invoke(reg, cb); };"

			+ "a.getRunningCycle = function(cb){ return javaMethods.get('" + angularGlue + ".getRunningCycle(L" + listenersPackage + "GlueIntegerResultListener;)V').invoke(cb); };"

			+ "a.addSignalListener = function(sig, cb){ return javaMethods.get('" + angularGlue + ".addSignalListener(IL" + listenersPackage + "GlueBCompSignalListener;)V').invoke(sig, cb); };"
			+ "a.setTickStartListener = function(cb){ return javaMethods.get('" + angularGlue + ".setTickStartListener(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"
			+ "a.setTickFinishListener = function(cb){ return javaMethods.get('" + angularGlue + ".setTickFinishListener(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"

			+ "a.executeContinue = function(cb){ return javaMethods.get('" + angularGlue + ".executeContinue(L" + listenersPackage + "GlueVoidResultListener;)V').invoke(cb); };"

			+ "a.setMemoryValue = function(addr, value){ return javaMethods.get('" + angularGlue + ".setMemoryValue(DD)V').invoke(addr, value); };"
			+ "a.getMemoryValue = function(addr, cb){ return javaMethods.get('" + angularGlue + ".getMemoryValue(DL" + listenersPackage + "GlueDoubleResultListener;)V').invoke(addr, cb); };"
			+ "a.getLastAccessedMemoryAddress = function(cb){ return javaMethods.get('" + angularGlue + ".getLastAccessedMemoryAddress(L" + listenersPackage + "GlueDoubleResultListener;)V').invoke(cb); };"
			+ "a.decodeMC = function(addr, cb){ return javaMethods.get('" + angularGlue + ".decodeMC(DL" + listenersPackage + "GlueStringArrayResultListener;)V').invoke(addr, cb); };"
			+ "return a;";

	@SuppressWarnings("unused")
	@JSBody(params = {"listener"}, script = "var a = {};"
			+ "javaMethods.get('" + angularGlue + ".init(ZL" + listenersPackage + "GlueVoidResultListener;)V').invoke(false, listener);"
			+ script)
	public static native JSObject glue(GlueVoidResultListener listener);

//	@SuppressWarnings("unused")
//	public static void init() {
//		glue.sendCmd(CMD.INIT, null);
//	}
	public static void init(boolean b, GlueVoidResultListener listener) {
		glue.sendCmd(CMD.INIT, (result) -> listener.process());
	}
	public static void sync(GlueVoidResultListener listener){
		glue.sendCmd(CMD.SYNC, result -> listener.process());
	}


	public static void setRegValue(int reg, double value){
		glue.sendCmd(CMD.SET_REG_VALUE, null, reg, value);
	}
	public static void getRegValue(int reg, GlueDoubleResultListener listener){
		glue.sendCmd(CMD.GET_REG_VALUE, result -> listener.process((Double) result), reg);
	}
	public static void getRegWidth(int reg, GlueIntegerResultListener listener){
		glue.sendCmd(CMD.GET_REG_WIDTH, result -> listener.process((Integer) result), reg);
	}


	public static void getRunningCycle(GlueIntegerResultListener listener){
		glue.sendCmd(CMD.GET_RUNNING_CYCLE, result -> listener.process((Integer) result));
	}


	public static void addSignalListener(int signal, GlueBCompSignalListener listener){
		glue.sendCmd(CMD.ADD_SIGNAL_LISTENER, null, signal, listener);
	}
	public static void setTickStartListener(GlueVoidResultListener listener){
		glue.sendCmd(CMD.SET_TICK_START_LISTENER, null, listener);
	}
	public static void setTickFinishListener(GlueVoidResultListener listener){
		glue.sendCmd(CMD.SET_TICK_FINISH_LISTENER, null, listener);
	}


	public static void executeContinue(GlueVoidResultListener listener){
		glue.sendCmd(CMD.EXECUTE_CONTINUE, result -> listener.process());
	}


	public static void setMemoryValue(double addr, double value){
		glue.sendCmd(CMD.SET_MEMORY_VALUE, null, addr, value);
	}
	public static void getMemoryValue(double addr, GlueDoubleResultListener listener){
		glue.sendCmd(CMD.GET_MEMORY_VALUE, result -> listener.process((Double) result), addr);
	}
	public static void getLastAccessedMemoryAddress(GlueDoubleResultListener listener){
		glue.sendCmd(CMD.GET_LAST_ACCESSED_MEMORY_ADDRESS, result -> listener.process((Double) result));
	}

	public static void decodeMC(double addr, GlueStringArrayResultListener listener){
		glue.sendCmd(CMD.DECODE_MC, result -> listener.process((String[]) result));
	}

	private static Object execute(CMD type, Object... args){
		switch(type){
			case INIT:
				bcomp = new BCompAngular();
				break;
			case SYNC:
				break;
			case SET_REG_VALUE:
				bcomp.setRegValue(Reg.values()[(int) args[0]], (long)(double) args[1]);
				break;
			case GET_REG_VALUE:
				return (double) bcomp.getRegValue(Reg.values()[(int) args[0]]);
			case GET_REG_WIDTH:
				return bcomp.getRegWidth(Reg.values()[(int) args[0]]);
			case GET_RUNNING_CYCLE:
				return bcomp.getRunningCycle();
			case ADD_SIGNAL_LISTENER:
				bcomp.addSignalListener(ControlSignal.values()[(int) args[0]], (GlueBCompSignalListener) args[1]);
				break;
			case SET_TICK_START_LISTENER:
				bcomp.setTickStartListener((GlueVoidResultListener) args[0]);
				break;
			case SET_TICK_FINISH_LISTENER:
				bcomp.setTickFinishListener((GlueVoidResultListener) args[0]);
				break;
			case EXECUTE_CONTINUE:
				bcomp.executeContinue();
				break;
			case SET_MEMORY_VALUE:
				bcomp.setMemoryValue((long)(double) args[0], (long)(double) args[1]);
				break;
			case GET_MEMORY_VALUE:
				return (double) bcomp.getMemoryValue((long)(double) args[0]);
			case GET_LAST_ACCESSED_MEMORY_ADDRESS:
				return (double) bcomp.getLastAccessedMemoryAddress();
			case DECODE_MC:
				return bcomp.decodeMC((long)(double) args[0]);
		}
		return null;
	}
}

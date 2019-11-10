package ru.ifmo.cs.bcomp.js.glue.components;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSObject;
import ru.ifmo.cs.bcomp.Reg;
import ru.ifmo.cs.bcomp.js.BCompAngular;
import ru.ifmo.cs.bcomp.js.glue.GlueComponent;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueIntegerResultListener;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueStringResultListener;

@SuppressWarnings("unused")
public class AngularGlue {
	enum CMD {
		INIT,
		GET_REG_VALUE,
		GET_REG_WIDTH,
		GET_RUNNING_CYCLE
	}
	private static GlueComponent<CMD> glue = new GlueComponent<>(AngularGlue::execute);
	private static BCompAngular bcomp;

	@SuppressWarnings("unused")
	@JSBody(script = "var a = {};"
			+ "javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.AngularGlue.init()V').invoke();"
			+ "a.getRegValue = function(reg, cb){ return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.AngularGlue.getRegValue(Ljava/lang/String;Lru/ifmo/cs/bcomp/js/glue/listeners/GlueStringResultListener;)V').invoke(reg, cb); };"
			+ "a.getRegWidth = function(reg, cb){ return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.AngularGlue.getRegWidth(Ljava/lang/String;Lru/ifmo/cs/bcomp/js/glue/listeners/GlueIntegerResultListener;)V').invoke(reg, cb); };"
			+ "a.getRunningCycle = function(cb){ return javaMethods.get('ru.ifmo.cs.bcomp.js.glue.components.AngularGlue.getRunningCycle(Lru/ifmo/cs/bcomp/js/glue/listeners/GlueIntegerResultListener;)V').invoke(cb); };"
			+ "return a;")
	public static native JSObject glue();

	@SuppressWarnings("unused")
	public static void init() {
		glue.sendCmd(CMD.INIT, null);
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
	public static void getRunningCycle(GlueIntegerResultListener listener){
		glue.sendCmd(CMD.GET_RUNNING_CYCLE, result -> listener.process((Integer) result));
	}


	private static Object execute(CMD type, Object... args){
		if(type == CMD.INIT){
			bcomp = new BCompAngular();
		}if(type == CMD.GET_REG_VALUE){
			return bcomp.getRegValue(Reg.valueOf((String) args[0]));
		}else if(type == CMD.GET_REG_WIDTH){
			return bcomp.getRegWidth(Reg.valueOf((String) args[0]));
		}else if(type == CMD.GET_RUNNING_CYCLE){
			return bcomp.getRunningCycle();
		}

		return null;
	}
}

package ru.ifmo.cs.bcomp.js;

import ru.ifmo.cs.bcomp.js.glue.*;
import org.teavm.jso.JSBody;

public class BCompGlue {
	public static void main(String[] args) throws Exception {
		new BCompGlue();
	}

	private BCompCLI cli;

	private short action = 0; //TODO move to enum
	private String actionArg;
	private final Object glueLock = new Object();
	private Thread glueThread = new Thread(() -> {
		while(true){
			try{
				synchronized(glueLock){
					glueLock.wait();
//					System.out.println("released");

					if(action == 1) //enterLine
						cli.enterLine(actionArg);
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	},"glue");

	private BCompGlue() throws Exception {
		cli = new BCompCLI();

//		synchronized(glueLock){
//			glueLock.notify();
//		}
		bindBCompEnterLine((str) -> {
			synchronized (glueLock) {
				action = 1;
				actionArg = str;
				glueLock.notify();
//				System.out.println("notify");
			}
		});
		glueThread.start();
//		exportJS();
		onLoaded();
	}

//	@JSBody(params={ "key","glue" }, script="bcomp[key] = glue")
//	public static native void bindJS(String key,  glue);

//	@JSBody(params={ "key","glue" }, script="bcomp[key] = glue")
//	private static native void bindBCompStart(String key, BCompStart glue);
//	static private final String exportjs =
//		"if(!BCompCLI) return; "+
//		"function BCompCLI(onprint){" +
//			"this.cli = new javaMethods.get('ru.ifmo.cs.bcomp.js.BCompCLI()')();" +
//		"}" +
//		"BCompCLI.prototype.enterLine = function(){" +
//			"javaMethods.get('ru.ifmo.cs.bcomp.js.BCompCLI.enterLine(Ljava.lang.String)V').invoke(this.cli, arguments)" +
//		"}";
//	@JSBody(script=exportjs)
//	private static native void exportJS(); //TODO pretty export

	@JSBody(params={"glue"}, script = "bcomp['enterLine'] = glue")
	private static native void bindBCompEnterLine(BCompEnterLine glue);

	@JSBody(script="if(bcomp && bcomp.onloaded) bcomp.onloaded()")
	private static native void onLoaded();
}

package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.dom.html.HTMLDocument;
import ru.ifmo.cs.bcomp.js.glue.*;
import org.teavm.jso.JSBody;

public class BCompGlue {

	public static void main(String[] args) {
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

	private BCompGlue(){
		try {
			cli = new BCompCLI(HTMLDocument.current().getElementById("console"));
		}catch(Exception e){
			throw new RuntimeException("BCompError", e);
		}

//		bindBCompStart("start", cli::start);
		synchronized(glueLock){
			glueLock.notify();
		}
//		cli.start();
		bindBCompEnterLine("enterLine", (str) -> {
			synchronized (glueLock) {
				action = 1;
				actionArg = str;
				glueLock.notify();
//				System.out.println("notify");
			}
		});
		glueThread.start();
		onLoaded();
	}

//	@JSBody(params={ "key","glue" }, script="bcomp[key] = glue")
//	public static native void bindJS(String key,  glue);

//	@JSBody(params={ "key","glue" }, script="bcomp[key] = glue")
//	private static native void bindBCompStart(String key, BCompStart glue);

	@JSBody(params={ "key","glue" }, script="bcomp[key] = glue")
	private static native void bindBCompEnterLine(String key, BCompEnterLine glue);

	@JSBody(script="if(bcomp.onloaded) bcomp.onloaded()")
	private static native void onLoaded();
}

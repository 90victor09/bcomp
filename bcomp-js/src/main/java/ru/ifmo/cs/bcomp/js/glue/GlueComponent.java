package ru.ifmo.cs.bcomp.js.glue;

import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;

/**
 * JS <-> multithreaded java connector
 * @param <E> enum with cmd types
 */
public class GlueComponent<E> {
	private Queue<GlueComponentCmd<E>> cmdQueue = new ArrayBlockingQueue<>(5);
	private GlueComponentExecutionListener<E> listener;
	private final Object glueCmdExecLock = new Object();

	private boolean glueThreadStarted = false;
	private Thread glueThread = new Thread(() -> {
		while(true){
			try{
				synchronized(glueCmdExecLock){
					if(cmdQueue.size() == 0)
						glueCmdExecLock.wait();
				}
				Object cmdResult;
				while(cmdQueue.size() > 0){
					GlueComponentCmd<E> cmd = cmdQueue.poll();

					cmdResult = listener.execute(cmd.getType(), cmd.getArgs());
					cmd.processResult(cmdResult);
				}
			}catch(InterruptedException e){
				e.printStackTrace();
			}
		}
	},"glue");

	/**
	 *
	 * @param exec Cmd execution processor
	 */
	public GlueComponent(GlueComponentExecutionListener<E> exec){
		listener = exec;
		glueThread.start();
	}

	/**
	 * Queue cmd for execution
	 * @param type		Cmd type from enum
	 * @param listener	Callback function to process result
	 * @param args		Arguments for cmd
	 */
	public void sendCmd(E type, GlueComponentCmdResultListener listener, Object ...args){
		if(!glueThreadStarted){
			glueThread.start();
			glueThreadStarted = true;
		}

		cmdQueue.offer(new GlueComponentCmd<>(type, listener, args));

		synchronized(glueCmdExecLock){
			glueCmdExecLock.notify();
		}
	}
}

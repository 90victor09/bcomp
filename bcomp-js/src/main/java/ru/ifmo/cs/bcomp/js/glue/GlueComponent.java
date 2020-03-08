package ru.ifmo.cs.bcomp.js.glue;

import java.util.Deque;
import java.util.LinkedList;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.locks.ReentrantLock;

/**
 * JS <-> multithreaded java connector
 * @param <E> enum with cmd types
 */
public class GlueComponent<E> {
	private Deque<GlueComponentCmd<E>> cmdQueue = new LinkedList<>();
	private GlueComponentExecutionListener<E> listener;
	private final Object glueCmdExecLock = new Object();

	private ReentrantLock executionLock = new ReentrantLock();

	private boolean glueThreadStarted = false;
	private Thread glueThread = new Thread(() -> {
		while(true){
			try{
				synchronized(glueCmdExecLock){
					if(cmdQueue.size() == 0)
						glueCmdExecLock.wait();
				}

				try{
					executionLock.lock();
					Object cmdResult;
					while(cmdQueue.size() > 0){
						GlueComponentCmd<E> cmd = cmdQueue.pollLast();
						cmdResult = listener.execute(cmd.getType(), cmd.getArgs());
						cmd.processResult(cmdResult);
					}
				}finally{
					executionLock.unlock();
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

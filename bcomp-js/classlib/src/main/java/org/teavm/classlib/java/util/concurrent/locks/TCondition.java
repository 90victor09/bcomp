package org.teavm.classlib.java.util.concurrent.locks;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;

//TODO: Корректная реализация
public class TCondition implements Condition {
	private final Object o = new Object();
	private TReentrantLock lock;

	TCondition(TReentrantLock lock){
		this.lock = lock;
	}

	@Override
	public boolean await(long l, TimeUnit timeUnit) throws InterruptedException {
		throw new RuntimeException("unimplemented");
	}

	@Override
	public void await() throws InterruptedException {
		synchronized(o){
			if(lock.getOwner().equals(Thread.currentThread()))
				lock.unlock();

//			System.out.println("[" + Thread.currentThread().getName() + "] Condition");
			o.wait();
//			System.out.println("[" + Thread.currentThread().getName() + "] CondDone");
		}
	}

	@Override
	public void awaitUninterruptibly() {
		throw new RuntimeException("unimplemented");
	}

	@Override
	public long awaitNanos(long l) throws InterruptedException {
		throw new RuntimeException("unimplemented");
	}

	@Override
	public boolean awaitUntil(Date date) throws InterruptedException {
		throw new RuntimeException("unimplemented");
	}

	@Override
	public void signal() {
		synchronized(o){
			o.notify();
		}
	}

	@Override
	public void signalAll() {
		synchronized(o){
			o.notifyAll();
		}
	}
}

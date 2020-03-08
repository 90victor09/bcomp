package org.teavm.classlib.java.util.concurrent.locks;

import java.util.concurrent.locks.Condition;

//TODO: Корректная реализация
public class TReentrantLock {
	private boolean locked = false;
//	private long ownerId;
	private final Object lock = new Object();
	private Thread owner;


	public void lock(){
		synchronized (lock) {
			if(locked){
				//XXX: MT bug
//				if(getOwner().equals(Thread.currentThread()))
//					return;
				try{
//					System.out.println("[" + Thread.currentThread().getName() + "] lock wait started");

						lock.wait();

//					System.out.println("[" + Thread.currentThread().getName() + "] lock wait ended");
				}catch (InterruptedException e) { /* totally not empty C: */ } catch (Exception e) {
					e.printStackTrace();
				}
			}
	//		ownerId = Thread.currentThread().getId();
			locked = true;
			owner = Thread.currentThread();
//			System.out.println("[" + Thread.currentThread().getName() + "] lock acquired");
//			new Exception().printStackTrace();
		}
	}

	public void unlock(){
		if(!getOwner().equals(Thread.currentThread()))
			return;
		synchronized(lock){
			lock.notify();
			locked = false;
		}
	}
	public boolean isLocked(){
		return locked;
	}
	public boolean tryLock(){
		if(locked)
			return false;
		lock();
		return true;
	}

	Thread getOwner(){
		return owner;
	}

	public Condition newCondition(){
		return new TCondition(this);
	}
}

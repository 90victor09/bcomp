package ru.ifmo.cs.bcomp.js;

import ru.ifmo.cs.bcomp.*;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueBCompSignalListener;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueVoidResultListener;
import ru.ifmo.cs.components.DataDestination;
import ru.ifmo.cs.components.Memory;

public class BCompAngular {
	private BasicComp bcomp;
	private CPU cpu;

	public BCompAngular(){
		try{
			bcomp = new BasicComp();
			cpu = bcomp.getCPU();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	public BCompAngular(BasicComp bcomp){  //TODO delete this
		this.bcomp = bcomp;
		this.cpu = bcomp.getCPU();
	}

	public void setRegValue(Reg reg, long value){
		cpu.getRegister(reg).setValue(value);
	}
	public long getRegValue(Reg reg){
		return cpu.getRegValue(reg);
	}

	public int getRegWidth(Reg reg){
		return (int) cpu.getRegWidth(reg);
	}

	public String getRunningCycle(){
		return cpu.getRunningCycle().name();
	}

	public void addSignalListener(ControlSignal signal, GlueBCompSignalListener listener){
		cpu.addDestination(signal, value -> {
			listener.setValue((double) value);
		});
	}

	public void setTickStartListener(GlueVoidResultListener listener){
		cpu.setTickStartListener(listener::process);
	}
	public void setTickFinishListener(GlueVoidResultListener listener){
		cpu.setTickFinishListener(listener::process);
	}

	public void executeContinue(){
		cpu.executeContinue();
	}

	public void setMemoryValue(long addr, long value){
		cpu.getMemory().setValue(addr, value);
	}
	public long getMemoryValue(long addr){
		Memory mem = cpu.getMemory();
		return mem.getValue(addr);
	}
	public long getLastAccessedMemoryAddress(){
		return cpu.getMemory().getLastAccessedAddress();
	}

}

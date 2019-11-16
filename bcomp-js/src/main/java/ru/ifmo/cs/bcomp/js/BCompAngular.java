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

	public String getRegValue(Reg reg){
		return Utils.toHex(cpu.getRegValue(reg), cpu.getRegWidth(reg));
	}

	public int getRegWidth(Reg reg){
		return (int)cpu.getRegWidth(reg);
	}

	public String getRunningCycle(){
		return cpu.getRunningCycle().name();
	}

	public void addSignalListener(ControlSignal signal, GlueBCompSignalListener listener){
		cpu.addDestination(signal, value -> {
			listener.setValue(Utils.toHex(value,Utils.getBinaryWidth((int)(value>>32)) + Utils.getBinaryWidth((int)(value&0xFFFFFFFF))));
		});
	}

	public void setTickStartListener(GlueVoidResultListener listener){
		cpu.setTickStartListener(listener::process);
	}
	public void setTickFinishListener(GlueVoidResultListener listener){
		cpu.setTickFinishListener(listener::process);
	}

	public String getMemoryValue(int addr){
		Memory mem = cpu.getMemory();
		return Utils.toHex(mem.getValue(addr), mem.width);
	}
	public int getLastAccessedMemoryAddress(){
		return (int)cpu.getMemory().getLastAccessedAddress(); //Possible overflow
	}

}

package ru.ifmo.cs.bcomp.js;

import ru.ifmo.cs.bcomp.*;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueBCompSignalListener;
import ru.ifmo.cs.bcomp.js.glue.listeners.GlueVoidResultListener;
import ru.ifmo.cs.components.DataDestination;

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
			listener.setValue(Utils.toHex(value,64));
		});
	}

	public void setTickStartListener(GlueVoidResultListener listener){
		cpu.setTickStartListener(listener::process);
	}
	public void setTickFinishListener(GlueVoidResultListener listener){
		cpu.setTickFinishListener(listener::process);
	}

}

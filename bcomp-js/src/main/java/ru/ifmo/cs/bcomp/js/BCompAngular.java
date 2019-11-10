package ru.ifmo.cs.bcomp.js;

import ru.ifmo.cs.bcomp.*;

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

//	public Reg getRegByName(String name){
//		Reg.valueOf(name);
//	}

	public String getRegValue(Reg reg){
		return Utils.toHex(cpu.getRegValue(reg), cpu.getRegWidth(reg));
	}

	public int getRegWidth(Reg reg){
		return (int)cpu.getRegWidth(reg);
	}

	public int getRunningCycle(){
		return cpu.getRunningCycle().ordinal();
	}

}

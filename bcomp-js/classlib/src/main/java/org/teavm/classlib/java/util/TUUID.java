package org.teavm.classlib.java.util;

import java.io.Serializable;

public class TUUID implements Serializable {//, Comparable<TUUID> {

	public TUUID(){
	}

	public TUUID(long hi, long lo){

	}

	public static TUUID fromString(String str){
		return new TUUID();
	}

	@Override
	public boolean equals(Object o){
		return o instanceof TUUID;
	}
}

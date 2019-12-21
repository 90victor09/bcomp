package org.teavm.classlib.java.io;

import java.io.ObjectStreamException;

public class TInvalidClassException extends RuntimeException {
	public String classname;

	public TInvalidClassException(String str) {
		super(str);
	}

	public TInvalidClassException(String str, String classname) {
		super(str);
		this.classname = classname;
	}

	public String getMessage() {
		return this.classname == null ? super.getMessage() : this.classname + "; " + super.getMessage();
	}
}

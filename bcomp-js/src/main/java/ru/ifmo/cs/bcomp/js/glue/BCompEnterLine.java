package ru.ifmo.cs.bcomp.js.glue;

import org.teavm.jso.JSFunctor;
import org.teavm.jso.JSObject;

@JSFunctor
public interface BCompEnterLine extends JSObject {
	void enterLine(String s) throws Exception;
}

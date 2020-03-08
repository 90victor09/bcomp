package ru.ifmo.cs.bcomp.js.glue.listeners;

import org.teavm.jso.JSFunctor;
import org.teavm.jso.JSObject;

@JSFunctor
public interface GlueDoubleResultListener extends JSObject {
	void process(double result);
}

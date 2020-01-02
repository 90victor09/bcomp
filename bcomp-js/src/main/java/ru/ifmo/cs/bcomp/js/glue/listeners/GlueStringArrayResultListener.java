package ru.ifmo.cs.bcomp.js.glue.listeners;

import org.teavm.jso.JSFunctor;
import org.teavm.jso.JSObject;

@JSFunctor
public interface GlueStringArrayResultListener extends JSObject {
	void process(String[] result);
}

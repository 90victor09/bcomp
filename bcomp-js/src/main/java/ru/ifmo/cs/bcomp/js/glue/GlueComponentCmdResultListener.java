package ru.ifmo.cs.bcomp.js.glue;

import org.teavm.jso.JSFunctor;

/**
 * Listener for cmd result processing
 */
@JSFunctor
public interface GlueComponentCmdResultListener {
	void process(Object result);
}
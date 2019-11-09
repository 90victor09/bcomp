package ru.ifmo.cs.bcomp.js.glue;

/**
 * Listener responsible for processing cmds
 * @param <E> enum with cmd types
 */
public interface GlueComponentExecutionListener<E> {
	Object execute(E type, Object ...args);
}

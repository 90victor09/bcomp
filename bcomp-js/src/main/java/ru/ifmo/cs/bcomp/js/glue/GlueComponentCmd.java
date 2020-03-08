package ru.ifmo.cs.bcomp.js.glue;

/**
 * @param <E> enum with cmd types
 */
class GlueComponentCmd<E> {
	private E type;
	private GlueComponentCmdResultListener resultListener;
	private Object[] args;

	GlueComponentCmd(E cmdType, GlueComponentCmdResultListener resultListener, Object ...cmdArgs){
		this.type = cmdType;
		this.resultListener = resultListener;
		this.args = cmdArgs;
	}

	E getType(){
		return type;
	}
	void processResult(Object result){
		if(resultListener != null)
			resultListener.process(result);
	}
	Object[] getArgs(){
		return args;
	}
}

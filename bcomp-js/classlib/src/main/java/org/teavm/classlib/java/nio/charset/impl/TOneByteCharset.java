package org.teavm.classlib.java.nio.charset.impl;

import org.teavm.classlib.java.nio.charset.TCharset;
import org.teavm.classlib.java.nio.charset.TCharsetDecoder;
import org.teavm.classlib.java.nio.charset.TCharsetEncoder;
import org.teavm.classlib.java.nio.charset.TCoderResult;

public class TOneByteCharset extends TCharset {
	protected TOneByteCharset(String canonicalName, String[] aliases){
		super(canonicalName, aliases);
	}
	@Override
	public boolean contains(TCharset cs) {
		return cs == this;
	}

	@Override
	public TCharsetDecoder newDecoder() {
		return new TBufferedDecoder(this, 1,1) {
			@Override
			protected TCoderResult arrayDecode(byte[] inArray, int inPos, int inSize, char[] outArray, int outPos, int outSize, Controller controller){
				TCoderResult result = null;
				while (inPos < inSize && outPos < outSize) {
					outArray[outPos++] = (char) (inArray[inPos++] & 0xFF);
				}

				controller.setInPosition(inPos);
				controller.setOutPosition(outPos);
				return result;
			}
		};
	}

	@Override
	public TCharsetEncoder newEncoder() {
		return new TBufferedEncoder(this, 1, 1) {
			@Override
			protected TCoderResult arrayEncode(char[] inArray, int inPos, int inSize, byte[] outArray, int outPos, int outSize, Controller controller){
				TCoderResult result = null;
				while (inPos < inSize && outPos < outSize)
					outArray[outPos++] = (byte) inArray[inPos++];

				controller.setInPosition(inPos);
				controller.setOutPosition(outPos);
				return result;
			}
		};
	}
}

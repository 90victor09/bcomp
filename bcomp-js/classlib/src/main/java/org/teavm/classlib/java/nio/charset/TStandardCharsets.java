package org.teavm.classlib.java.nio.charset;

import org.teavm.classlib.java.nio.charset.impl.TISO_8859_1Charset;
import org.teavm.classlib.java.nio.charset.impl.TUS_ASCIICharset;
import org.teavm.classlib.java.nio.charset.impl.TUTF8Charset;

public final class TStandardCharsets {
	private TStandardCharsets() {
	}

	public static final TCharset US_ASCII = new TUS_ASCIICharset();
	public static final TCharset ISO_8859_1 = new TISO_8859_1Charset();
	public static final TCharset UTF_8 = new TUTF8Charset();
}
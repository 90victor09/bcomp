package ru.ifmo.cs.bcomp.js;

import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLElement;

import ru.ifmo.cs.bcomp.ui.CLI;

public class BCompCLI extends CLI {
	private HTMLElement console;
	public BCompCLI(HTMLElement console) throws Exception {
		super();
		this.console = console;
		println("Эмулятор Базовой ЭВМ.\n" +
				"БЭВМ готова к работе.\n" +
				"Используйте ? или help для получения справки");
		new Thread(() -> {
			String line;
			while(true){
				try{
					line = fetchLine();
				}catch(Exception e){
					break;
				}

				if(line.trim().equalsIgnoreCase("clear")){
					console.clear();
					continue;
				}

				processLine(line);
				lineProcessed();
			}
		}, "BCompCLI").start();
	}

	@Override
	protected void printHelp() {
		println("Доступные команды:\n" +
				"a[ddress]\t- Пультовая операция \"Ввод адреса\"\n" +
				"w[rite]\t\t- Пультовая операция \"Запись\"\n" +
				"r[ead]\t\t- Пультовая операция \"Чтение\"\n" +
				"s[tart]\t\t- Пультовая операция \"Пуск\"\n" +
				"c[continue]\t- Пультовая операция \"Продолжить\"\n" +
				"ru[n]\t\t- Переключение режима Работа/Останов\n" +
				"cl[ock]\t\t- Переключение режима потактового выполнения\n" +
				"ma[ddress]\t- Переход на микрокоманду\n" +
				"mw[rite]\t- Запись микрокоманды\n" +
				"mr[ead]\t\t- Чтение микрокоманды\n" +
				"io\t\t- Вывод состояния всех ВУ\n" +
				"io addr\t\t- Вывод состояния указанного ВУ\n" +
				"io addr value\t- Запись value в указанное ВУ\n" +
				"flag addr\t- Установка флага готовности указанного ВУ\n" +
				"asm\t\t- Ввод программы на ассемблере\n" +
				"sleep value\t- Задержка между тактами при фоновом выполнении\n" +
				"clear\t\t- Очистить консоль\n" +
				"(0000-FFFF)\t- Ввод шестнадцатеричного значения в клавишный регистр\n" +
				"(метка)\t\t- Ввод адреса метки в клавишный регистр"
		);
	}

	private String enteredLine;
	private final Object lineLock = new Object();
	public void enterLine(String line){
		println("> " + line);

		synchronized(lineLock){
			enteredLine = line;
			lineLock.notify();
		}
	}


	@Override
	protected String fetchLine() throws Exception {
		synchronized(lineLock){
			lineLock.wait();
			return enteredLine;
		}
	}

	public void lineProcessed(){
//		console.setScrollTop(console.getScrollHeight());
		HTMLDocument.current().getDocumentElement().setScrollTop(HTMLDocument.current().getDocumentElement().getScrollHeight());
	}

	@Override
	protected void println(String str){
		console.appendChild(console.getOwnerDocument().createTextNode(str + "\n"));
	}
}
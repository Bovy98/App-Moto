package com.riccardo.importExportFiles;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.riccardo.models.Moto;

public class WriteToExcelFile {

	private static final Logger logger = LoggerFactory.getLogger(WriteToExcelFile.class);

	public static void writeMotoListToFile(String fileName, List<Moto> motoList) throws Exception {

		// inizializzo il workbook
		Workbook workbook = null;

		// controlli sul formato del file, se ok istanzio workbook
		if (fileName.endsWith("xlsx")) {
			workbook = new XSSFWorkbook();
		} else if (fileName.endsWith("xls")) {
			workbook = new HSSFWorkbook();
		} else {
			throw new Exception("invalid file name, should be xls or xlsx");
		}

		Sheet sheet = workbook.createSheet("Moto"); // creo il foglio all'interno del documento

		Iterator<Moto> iterator = motoList.iterator();

		int rowIndex = 0;
		while (iterator.hasNext()) {

			Row header = sheet.createRow(0);

			CellStyle headerStyle = workbook.createCellStyle();
			headerStyle.setFillForegroundColor(IndexedColors.AQUA.getIndex());
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			Cell headerCell = header.createCell(0);
			headerCell.setCellValue("IdMoto");
			headerCell.setCellStyle(headerStyle);

			headerCell = header.createCell(1);
			headerCell.setCellValue("Modello");
			headerCell.setCellStyle(headerStyle);

			headerCell = header.createCell(2);
			headerCell.setCellValue("Cc");
			headerCell.setCellStyle(headerStyle);

			headerCell = header.createCell(3);
			headerCell.setCellValue("Anno");
			headerCell.setCellStyle(headerStyle);

			headerCell = header.createCell(4);
			headerCell.setCellValue("Prezzo");
			headerCell.setCellStyle(headerStyle);

			Moto motoBean = iterator.next();
			Row row = sheet.createRow(rowIndex++);

			Cell cell0 = row.createCell(0);
			cell0.setCellValue(motoBean.getIdMoto());
			Cell cell1 = row.createCell(1);
			cell1.setCellValue(motoBean.getModello());
			Cell cell2 = row.createCell(2);
			cell2.setCellValue(motoBean.getCc());
			Cell cell3 = row.createCell(3);
			cell3.setCellValue(motoBean.getAnno());
			Cell cell4 = row.createCell(4);
			cell4.setCellValue(motoBean.getPrezzo());
		}

		// lets write the excel data to file now
		FileOutputStream fos = new FileOutputStream(fileName);
		workbook.write(fos);
		fos.close();
		logger.debug(fileName + " written successfully");
	}

	public static void main(String args[]) throws Exception {
		// List<Moto> list = ReadExcelFileToList.readExcelData("Sample.xlsx");
		// WriteToExcelFile.writeCountryListToFile("Countries.xls", list);

		List<Moto> listaMoto = new ArrayList<>();

		Moto m1 = new Moto();

		m1.setIdMoto(0);
		m1.setModello("uno");
		m1.setCc(456);
		m1.setAnno("2019");
		m1.setPrezzo(7000);

		Moto m2 = new Moto();

		m2.setIdMoto(1);
		m2.setModello("due");
		m2.setCc(123);
		m2.setAnno("2023");
		m2.setPrezzo(5000);

		Moto m3 = new Moto();

		m3.setIdMoto(2);
		m3.setModello("tre");
		m3.setCc(987);
		m3.setAnno("2021");
		m3.setPrezzo(10000);

		Moto m4 = new Moto();

		m4.setIdMoto(3);
		m4.setModello("quattro");
		m4.setCc(654);
		m4.setAnno("2022");
		m4.setPrezzo(8000);

		Moto m5 = new Moto();

		m5.setIdMoto(4);
		m5.setModello("cinque");
		m5.setCc(321);
		m5.setAnno("2020");
		m5.setPrezzo(4000);

		listaMoto.add(0, m1);
		listaMoto.add(1, m2);
		listaMoto.add(2, m3);
		listaMoto.add(3, m4);
		listaMoto.add(4, m5);

		WriteToExcelFile.writeMotoListToFile("WriteProva1.xls", listaMoto);
	}
}
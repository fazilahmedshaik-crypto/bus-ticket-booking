package com.example.demo.service;

import com.example.demo.dto.BookingResponse;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class TicketPdfService {

    private final DeviceRgb VOYAGEUR_GOLD = new DeviceRgb(201, 169, 110);

    public byte[] generateTicket(BookingResponse booking) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            document.setMargins(40, 40, 40, 40);

            // Brand Header
            Paragraph brand = new Paragraph("VOYAGEUR")
                    .setBold()
                    .setFontSize(26)
                    .setFontColor(VOYAGEUR_GOLD)
                    .setTextAlignment(TextAlignment.LEFT)
                    .setMarginBottom(0);
            document.add(brand);

            Paragraph tagline = new Paragraph("PREMIUM BUS TRAVEL — E-TICKET RECEIPT")
                    .setFontSize(9)
                    .setCharacterSpacing(2)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(20);
            document.add(tagline);

            document.add(new LineSeparator(new SolidLine(1f)).setMarginBottom(25));

            // PNR & Key Info
            float[] topWidths = {3, 1};
            Table topTable = new Table(UnitValue.createPercentArray(topWidths)).useAllAvailableWidth();
            
            topTable.addCell(createTransparentCell("PASSENGER DETAILS", true).setFontColor(VOYAGEUR_GOLD));
            topTable.addCell(createTransparentCell("BOOKING ID", true).setFontColor(VOYAGEUR_GOLD).setTextAlignment(TextAlignment.RIGHT));
            
            String pnr = String.format("VQ-%08d", booking.getId() * 73);
            topTable.addCell(createTransparentCell(
                booking.getPassengerName().toUpperCase() + "\n" +
                booking.getPassengerPhone() + " | " + (booking.getPassengerEmail() != null ? booking.getPassengerEmail() : "N/A")
            ));
            topTable.addCell(createTransparentCell(pnr).setBold().setFontSize(14).setTextAlignment(TextAlignment.RIGHT));
            
            document.add(topTable.setMarginBottom(30));

            // Journey Details
            Paragraph sectHeader = new Paragraph("JOURNEY INFORMATION")
                    .setBold().setFontSize(10).setFontColor(VOYAGEUR_GOLD).setMarginBottom(10);
            document.add(sectHeader);

            float[] journeyWidths = {2, 1, 2};
            Table journeyTable = new Table(UnitValue.createPercentArray(journeyWidths)).useAllAvailableWidth();

            // From
            Cell fromCell = new Cell().add(new Paragraph(booking.getSource().toUpperCase()).setBold().setFontSize(18))
                                     .add(new Paragraph("DEPARTURE").setFontSize(8).setFontColor(ColorConstants.GRAY))
                                     .setBorder(null).setPaddingBottom(15);
            journeyTable.addCell(fromCell);

            // Arrow/Icon
            journeyTable.addCell(new Cell().add(new Paragraph("➔").setFontSize(24).setFontColor(VOYAGEUR_GOLD))
                                          .setTextAlignment(TextAlignment.CENTER).setBorder(null));

            // To
            Cell toCell = new Cell().add(new Paragraph(booking.getDestination().toUpperCase()).setBold().setFontSize(18))
                                   .add(new Paragraph("ARRIVAL").setFontSize(8).setFontColor(ColorConstants.GRAY))
                                   .setBorder(null).setTextAlignment(TextAlignment.RIGHT);
            journeyTable.addCell(toCell);

            document.add(journeyTable.setMarginBottom(5));

            // Secondary Journey Info
            float[] secWidths = {1, 1, 1};
            Table secTable = new Table(UnitValue.createPercentArray(secWidths)).useAllAvailableWidth();
            secTable.addCell(createTransparentCell("DATE: " + (booking.getJourneyDate() != null ? booking.getJourneyDate() : "N/A")));
            secTable.addCell(createTransparentCell("BUS: " + booking.getBusName()).setTextAlignment(TextAlignment.CENTER));
            secTable.addCell(createTransparentCell("SEATS: " + booking.getSeatCount()).setTextAlignment(TextAlignment.RIGHT));
            
            document.add(secTable.setMarginBottom(30));

            document.add(new LineSeparator(new SolidLine(0.5f)).setMarginBottom(20));

            // Fare Summary
            Table fareTable = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
            fareTable.addCell(createTransparentCell("PAYMENT STATUS", true).setFontColor(VOYAGEUR_GOLD));
            fareTable.addCell(createTransparentCell("TOTAL FARE PAID", true).setFontColor(VOYAGEUR_GOLD).setTextAlignment(TextAlignment.RIGHT));
            
            fareTable.addCell(createTransparentCell(booking.getStatus().toUpperCase()).setBold());
            fareTable.addCell(createTransparentCell("INR " + booking.getTotalFare()).setBold().setFontSize(16).setTextAlignment(TextAlignment.RIGHT));
            
            document.add(fareTable.setMarginBottom(50));

            // Terms
            document.add(new Paragraph("IMPORTANT INFORMATION").setBold().setFontSize(9).setMarginBottom(5));
            String terms = "• Please present this e-ticket and a valid photo ID (Aadhar, PAN, Passport) at the time of boarding.\n" +
                           "• Passengers are requested to report at the boarding point at least 20 minutes prior to departure.\n" +
                           "• This ticket is non-transferable and valid only for the specified journey and seat(s).\n" +
                           "• For cancellations and support, please visit the Voyageur app or contact our 24/7 concierge.";
            document.add(new Paragraph(terms).setFontSize(8).setFontColor(ColorConstants.DARK_GRAY));

            // Footer
            Paragraph footer = new Paragraph("Thank you for choosing Voyageur. Wishing you an exquisite journey.")
                    .setItalic().setFontSize(9).setTextAlignment(TextAlignment.CENTER).setMarginTop(60).setFontColor(VOYAGEUR_GOLD);
            document.add(footer);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating luxury PDF ticket", e);
        }

        return baos.toByteArray();
    }

    private Cell createTransparentCell(String content) {
        return createTransparentCell(content, false);
    }

    private Cell createTransparentCell(String content, boolean isHeader) {
        Cell cell = new Cell().add(new Paragraph(content).setFontSize(isHeader ? 8 : 10));
        cell.setBorder(null);
        if (isHeader) {
            cell.setBold();
        }
        return cell.setPaddingTop(5).setPaddingBottom(5);
    }
}

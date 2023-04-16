import PDFDocument from "pdfkit";
import getStream from "get-stream";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { type countryName, formatCurrency } from "~/utils/calcs";
import type { Invoice, InvoiceItem } from "@prisma/client";

export async function generateInvoiceDoc(
  origin: string | undefined,
  invoice: Invoice & { items: Array<InvoiceItem> }
) {
  let mainFont = "Helvetica";
  let mainFontBold = "Helvetica-Bold";
  const doc = new PDFDocument();

  if (origin) {
    const font = await fetch(`${origin}/Poppins-Regular.ttf`);
    const customFont = await font.arrayBuffer();

    const fontBold = await fetch(`${origin}/Poppins-SemiBold.ttf`);
    const customFontBold = await fontBold.arrayBuffer();

    doc.registerFont("poppins", customFont);
    doc.registerFont("poppins-semibold", customFontBold);
    mainFont = "poppins";
    mainFontBold = "poppins-semibold";
  }

  dayjs.extend(localizedFormat);
  doc.font(mainFontBold).fontSize(9).text(`Invoice number:`, 10, 30);

  doc.font(mainFont).fontSize(9).text(`${invoice.number}`, 90, 30);

  doc.font(mainFontBold).fontSize(9).text(`Created at:`, 10, 45);

  doc
    .font(mainFont)
    .fontSize(9)
    .text(`${dayjs(invoice.invoiceDate.toString()).format("LL")}`, 65, 45);

  doc.font(mainFontBold).fontSize(9).text(`Due to:`, 10, 60);

  doc
    .font(mainFont)
    .fontSize(9)
    .text(`${dayjs(invoice.dueDate.toString()).format("LL")}`, 45, 60);

  doc.font(mainFontBold).fontSize(9).text(`Bill from`, 10, 100);

  doc.font(mainFont).fontSize(8).text(invoice.name, 10, 115);

  doc.font(mainFont).fontSize(8).text(`${invoice.streetAddress}`, 10, 130);

  doc
    .font(mainFont)
    .fontSize(8)
    .text(`${invoice.postCode} ${invoice.city} ${invoice.country}`, 10, 145);

  doc.font(mainFont).fontSize(8).text(`${invoice.idNo}`, 10, 160);

  doc.font(mainFont).fontSize(8).text(`Bank - ${invoice.bankAccount}`, 10, 175);

  doc.font(mainFontBold).fontSize(9).text(`Bill to`, 300, 100);

  doc.font(mainFont).fontSize(8).text(invoice.clientName, 300, 115);

  doc.font(mainFont).fontSize(8).text(`${invoice.clientEmail}`, 300, 130);

  doc
    .font(mainFont)
    .fontSize(8)
    .text(`${invoice.clientStreetAddress}`, 300, 145);

  doc
    .font(mainFont)
    .fontSize(8)
    .text(
      `${invoice.clientPostCode} ${invoice.clientCity} ${invoice.clientCountry}`,
      300,
      160
    );

  doc.font(mainFont).fontSize(8).text(`${invoice.idNo}`, 300, 175);

  doc
    .lineJoin("bevel")
    .rect(10, 215, doc.page.width - 20, 20)
    .fill("#ccc");

  doc.font(mainFont).fontSize(7).fill("#000").text(`LP`, 20, 220);
  doc.font(mainFont).fontSize(7).fill("#000").text(`Name`, 60, 220);
  doc.font(mainFont).fontSize(7).fill("#000").text(`Quantity`, 240, 220);
  doc.font(mainFont).fontSize(7).fill("#000").text(`Price`, 290, 220);
  doc.font(mainFont).fontSize(7).fill("#000").text(`Tax %`, 365, 220);
  doc.font(mainFont).fontSize(7).fill("#000").text(`Net`, 400, 220);
  doc.font(mainFont).fontSize(7).fill("#000").text(`Gross`, 500, 220);

  let lastItemHeight = 220;
  let currentHeight = 220;
  let iterator = 1;

  invoice.items.forEach((item, i) => {
    let height = iterator * 30 + currentHeight;

    if (height > 720) {
      doc
        .lineJoin("bevel")
        .rect(10, height, doc.page.width - 20, 1)
        .fill("#ccc");
      doc.addPage();
      height = 65;
      currentHeight = 35;
      iterator = 1;

      doc
        .lineJoin("bevel")
        .rect(10, 30, doc.page.width - 20, 20)
        .fill("#ccc");

      doc.font(mainFont).fontSize(7).fill("#000").text(`LP`, 20, 35);
      doc.font(mainFont).fontSize(7).fill("#000").text(`Name`, 60, 35);
      doc.font(mainFont).fontSize(7).fill("#000").text(`Quantity`, 240, 35);
      doc.font(mainFont).fontSize(7).fill("#000").text(`Price`, 290, 35);
      doc.font(mainFont).fontSize(7).fill("#000").text(`Tax %`, 365, 35);
      doc.font(mainFont).fontSize(7).fill("#000").text(`Net`, 400, 35);
      doc.font(mainFont).fontSize(7).fill("#000").text(`Gross`, 500, 35);
    }

    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(String(i + 1), 20, height, {
        width: 40,
      });

    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(String(doc.page.height), 0, 0, {
        width: 180,
      });

    doc.font(mainFont).fontSize(7).fill("#000").text(item.name, 60, height, {
      width: 180,
    });

    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(String(item.quantity), 240, height, {
        width: 50,
      });

    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(
        formatCurrency(invoice.currencyCountry as countryName, item.price),
        290,
        height,
        {
          width: 75,
        }
      );
    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(`${item.tax}%`, 365, height, {
        width: 35,
      });
    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(
        formatCurrency(invoice.currencyCountry as countryName, item.net),
        400,
        height,
        {
          width: 100,
        }
      );
    doc
      .font(mainFont)
      .fontSize(7)
      .fill("#000")
      .text(
        formatCurrency(invoice.currencyCountry as countryName, item.gross),
        500,
        height,
        {
          width: 100,
        }
      );
    lastItemHeight = height;
    iterator++;
  });

  if (lastItemHeight < 730) {
    doc
      .lineJoin("bevel")
      .rect(10, lastItemHeight + 25, doc.page.width - 20, 1)
      .fill("#ccc");
  }

  let summaryHeight = lastItemHeight + 100;

  if (summaryHeight + 60 > 725) {
    doc.addPage();
    summaryHeight = 30;
  }

  doc
    .font(mainFontBold)
    .fontSize(8)
    .fill("#000")
    .text(`Total Net:`, 360, summaryHeight, {
      align: "right",
      width: 100,
    });

  doc
    .font(mainFontBold)
    .fontSize(8)
    .fill("#000")
    .text(`Tax:`, 360, summaryHeight + 20, {
      align: "right",
      width: 100,
    });

  doc
    .font(mainFontBold)
    .fontSize(9)
    .fill("#000")
    .text(`Balance Due:`, 360, summaryHeight + 60, {
      align: "right",
      width: 100,
    });

  doc
    .font(mainFont)
    .fontSize(8)
    .fill("#000")
    .text(
      formatCurrency(
        invoice.currencyCountry as countryName,
        invoice.totalAmount
      ),
      475,
      summaryHeight,
      {
        align: "right",
        width: 120,
      }
    );

  doc
    .font(mainFont)
    .fontSize(8)
    .fill("#000")
    .text(
      formatCurrency(
        invoice.currencyCountry as countryName,
        invoice.grossTotalAmount - invoice.totalAmount
      ),
      475,
      summaryHeight + 20,
      {
        align: "right",
        width: 120,
      }
    );

  doc
    .font(mainFontBold)
    .fontSize(9)
    .fill("#000")
    .text(
      formatCurrency(
        invoice.currencyCountry as countryName,
        invoice.grossTotalAmount
      ),
      475,
      summaryHeight + 60,
      {
        align: "right",
        width: 120,
      }
    );

  doc
    .lineCap("butt")
    .moveTo(400, summaryHeight + 45)
    .lineTo(600, summaryHeight + 45)
    .stroke();

  doc.end();
  return await getStream.buffer(doc);
}

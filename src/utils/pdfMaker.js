import PDFDocument from "pdfkit";

export const generatePDF = (inputs, callback, endCallback) => {
  const doc = new PDFDocument();

  doc.on("data", callback);
  doc.on("end", endCallback);

  doc.text(inputs);

  doc.end();
};

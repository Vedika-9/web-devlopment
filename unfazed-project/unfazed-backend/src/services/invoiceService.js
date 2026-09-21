const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const INVOICE_DIR = path.join(__dirname, '..', '..', 'invoices');
if (!fs.existsSync(INVOICE_DIR)) fs.mkdirSync(INVOICE_DIR, { recursive: true });

/**
 * Generates a simple GST-style invoice PDF for a payment and returns its
 * local file path. Swap this for S3 upload in production (see cloud storage
 * note in README) -- the interface (payment, therapist, client) stays the same.
 */
function generateInvoice({ payment, therapist, client }) {
  const fileName = `invoice-${payment._id}.pdf`;
  const filePath = path.join(INVOICE_DIR, fileName);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Unfazed', { align: 'left' });
  doc.fontSize(10).text('Tax Invoice', { align: 'left' });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice #: ${payment._id}`);
  doc.text(`Date: ${new Date(payment.createdAt || Date.now()).toLocaleDateString('en-IN')}`);
  doc.moveDown();

  doc.text(`Billed to: ${client.name}`);
  doc.text(`Email: ${client.email}`);
  doc.moveDown();

  doc.text(`Therapist: ${therapist.name}`);
  doc.moveDown();

  const gstRate = 0.18;
  const base = Math.round(payment.amount / (1 + gstRate));
  const gst = payment.amount - base;

  doc.text(`Description: ${payment.purpose === 'package' ? 'Session package' : 'Therapy session'}`);
  doc.text(`Base amount: Rs. ${(base / 100).toFixed(2)}`);
  doc.text(`GST (18%): Rs. ${(gst / 100).toFixed(2)}`);
  doc.fontSize(14).text(`Total paid: Rs. ${(payment.amount / 100).toFixed(2)}`, { underline: true });

  doc.end();
  return `/invoices/${fileName}`;
}

module.exports = { generateInvoice, INVOICE_DIR };

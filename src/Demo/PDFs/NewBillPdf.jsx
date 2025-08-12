import jsPDF from "jspdf";

export const NewBillPdf = (bill, hospital) => {
  const doc = new jsPDF("p", "mm", "a4");

  const items = bill?.medicine_items || [];

  // Hospital details
  const hospitalName = hospital?.name || "Hospital";
  const hospitalPhone = hospital?.contact || "N/A";
  const hospitalAddress = hospital?.address || "Address";

  const invoiceDate = new Date(bill?.created_at || Date.now()).toLocaleDateString();
  const paymentDate = bill?.payment_date
    ? new Date(bill?.payment_date).toLocaleDateString()
    : "N/A";

  // HEADER
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(hospitalName, 105, 12, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Phone: ${hospitalPhone}`, 105, 18, { align: "center" });
  doc.text(`${hospitalAddress}`, 105, 24, { align: "center" });

  // Invoice Info
  doc.setTextColor(0);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("INVOICE", 15, 40);
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text(`Invoice Date: ${invoiceDate}`, 150, 40);

  // Patient Info
  doc.text(`Patient Name: ${bill.patient_name || "N/A"}`, 15, 50);
  doc.text(`Payment Mode: ${bill.payment_mode || "N/A"}`, 15, 56);
  doc.text(`Payment Status: ${bill.payment_status || "N/A"}`, 15, 62);
  doc.text(`Payment Date: ${paymentDate}`, 15, 68);

  // Table Header
  let y = 80;
  doc.setFillColor(230, 230, 230);
  doc.rect(15, y, 180, 8, "F");
  doc.setTextColor(0);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("Medicine", 17, y + 6);
  doc.text("Dosage", 75, y + 6);
  doc.text("Duration", 105, y + 6);
  doc.text("Qty", 135, y + 6);
  doc.text("Amount", 160, y + 6);

  y += 10;
  doc.setFont("times", "normal");

  items.forEach((item) => {
    doc.text(item.name || "-", 17, y);
    doc.text(item.dosage || "-", 75, y);
    doc.text(item.duration || "-", 105, y);
    doc.text(String(item.quantity || "-"), 135, y);
    doc.text("₹" + (item.amount || "0"), 160, y);
    y += 7;
  });

  y += 10;

  // Totals
  doc.setFont("times", "bold");
  doc.text(`Total Amount: ₹${bill.total_amount || "0"}`, 160, y);

  y += 10;

  // Notes if any
  if (bill.note) {
    doc.setFont("times", "italic");
    doc.text("Note:", 15, y);
    doc.setFont("times", "normal");
    doc.text(bill.note, 30, y);
    y += 10;
  }

  // FOOTER
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Thank you for your visit!`, 105, 292, { align: "center" });

  // Open PDF
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, "_blank");
  if (!newWindow) alert("Please enable pop-ups to view the invoice.");
};

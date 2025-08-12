import jsPDF from "jspdf";

const GenerateInvoiceBill = (invoice, hospital) => {
  const doc = new jsPDF("p", "mm", "a4");
  const bill = invoice?.bill || {};
  const patient = invoice?.patient || {};
  let y = 20;

  // HEADER
  doc.setFillColor(30, 58, 138); // navy blue
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(hospital?.name || "Hospital Name", 105, 12, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(hospital?.address || "Hospital Address", 105, 18, { align: "center" });
  doc.text(`Contact: ${hospital?.contact || "N/A"}`, 105, 24, { align: "center" });

  // INVOICE TITLE
  y = 36;
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Receipt", 15, y);
  y += 6;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 8;

  // Invoice + Bill Details (2 Columns)
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const leftDetails = [
    ["Invoice ID", invoice?.id || "—"],
    ["Bill ID", bill?.id || "—"],
    ["Date", new Date(invoice?.date).toLocaleString()],
    ["Payment Mode", invoice?.payment_mode?.toUpperCase() || "N/A"],
    ["Amount Paid", invoice?.paid_amount || "0.00"],
  ];
  const rightDetails = [
    ["Status", bill?.status?.toUpperCase() || "N/A"],
    ["Bill Date", bill?.date || "—"],
    ["Payment Date", new Date(bill?.payment_date_time).toLocaleString()],
  ];

  leftDetails.forEach(([label, value], index) => {
    const posY = y + index * 6;
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 15, posY);
    doc.setFont("helvetica", "normal");
    doc.text(`${value}`, 55, posY);
  });

  rightDetails.forEach(([label, value], index) => {
    const posY = y + index * 6;
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 120, posY);
    doc.setFont("helvetica", "normal");
    doc.text(`${value}`, 160, posY);
  });

  y += Math.max(leftDetails.length, rightDetails.length) * 6 + 6;

  // PATIENT DETAILS
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Patient Details", 15, y);
  y += 6;

  const patientDetails = [
    ["Name", patient?.full_name || "—"],
    ["Patient ID", patient?.patient_id || "—"],
    ["Gender", patient?.gender || "—"],
    ["Age", patient?.age || "—"],
    ["Blood Group", patient?.blood_group || "—"],
    ["Contact", patient?.contact_number || "—"],
    ["Email", patient?.email || "—"],
    ["Address", patient?.address || "—"],
  ];

  doc.setFontSize(11);
  patientDetails.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${value}`, 55, y);
    y += 6;
  });

  y += 4;

  // PARTICULARS TABLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Billing Particulars", 15, y);
  y += 6;

  doc.setFontSize(11);
  doc.setDrawColor(180);
  doc.setLineWidth(0.1);
  doc.line(15, y, 195, y);
  y += 5;

  doc.text("Sr", 16, y);
  doc.text("Name", 26, y);
  doc.text("Description", 80, y);
  doc.text("Amount", 160, y);
  y += 6;

  doc.setFont("helvetica", "normal");

  invoice.particulars?.forEach((item, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${index + 1}`, 16, y);
    doc.text(item.name || "-", 26, y);
    doc.text(item.description || "-", 80, y, { maxWidth: 70 });
    doc.text(`${item.amount}`, 160, y);
    y += 6;
  });

  // TOTAL
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.3);
  doc.rect(15, y, 180, 12);
  doc.text(`Total Amount Paid: ${invoice?.paid_amount || "0.00"}`, 25, y + 8);

  // FOOTER
  y = 285;
  doc.setFillColor(30, 58, 138);
  doc.rect(0, y, 210, 12, "F");

  doc.setFont("helvetica", "normal");
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, y + 8);
  doc.text(`Contact: ${hospital?.contact || "N/A"}`, 160, y + 8);

  // Save
  doc.save(`Invoice_${invoice?.id || "Bill"}.pdf`);
};

export default GenerateInvoiceBill;

import jsPDF from "jspdf";

export const generateBillPDF = (patient, bill, billingData, paymentsForBill, hospital) => {
  const doc = new jsPDF("p", "mm", "a4");

  // HEADER - Blue Banner
  doc.setFillColor(13, 54, 93); // Dark blue
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(hospital?.name || "Hospital Name", 105, 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(hospital?.address || "Hospital Address", 105, 18, { align: "center" });
  doc.text(`Phone: ${hospital?.contact || "+91-XXXXXXXXXX"}`, 105, 24, { align: "center" });

  // Horizontal line below header
  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.7);
  doc.line(10, 42, 200, 42);

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Bill Summary", 105, 55, { align: "center" });

  let y = 70;
  const addLine = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${label}:`, 20, y);
    doc.text(`${value ?? "N/A"}`, 70, y);
    y += 8;
  };

  // Patient Info Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Patient Information", 20, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 6;

  addLine("Patient Name", patient?.full_name);
  addLine("Patient ID", patient?.patient_id);
  addLine("Age", patient?.age);
  addLine("Gender", patient?.gender);
  addLine("Blood Group", patient?.blood_group);
  addLine("Contact", patient?.contact_number);
  addLine("Address", patient?.address);

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  // doc.text("Billing Details", 20, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 6;

   // Billing Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Billing Details", 20, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sr.", 20, y);
  doc.text("Date", 30, y);
  doc.text("Perticular", 70, y);
  doc.text("Amount", 160, y);
  y += 6;

  doc.setDrawColor(230);
  doc.line(20, y, 190, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  billingData.forEach((item, i) => {
    doc.text(`${i + 1}`, 20, y);
    doc.text(item.date || "-", 30, y);
    doc.text(item.perticular || "-", 70, y);
    doc.text(`${item.amount}`, 160, y);
    y += 6;
  });

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ${bill.total_amount}`, 140, y);
  y += 10;

  // Payment Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Payment Summary", 20, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sr.", 20, y);
  doc.text("Date", 30, y);
  doc.text("Method", 80, y);
  doc.text("Amount", 130, y);
  doc.text("Status", 170, y);
  y += 6;

  doc.setDrawColor(230);
  doc.line(20, y, 190, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  paymentsForBill.forEach((p, i) => {
    doc.text(`${i + 1}`, 20, y);
    doc.text(p.date || "-", 30, y);
    doc.text(p.method || "-", 80, y);
    doc.text(`${p.totalAmount}`, 130, y);
    doc.text(p.status || "-", 170, y);
    y += 6;
  });

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text(`Bill Status: ${bill.status?.toUpperCase() || "UNPAID"}`, 20, y);
// c.text(`Bill Status: ${bill.status?.toUpperCase() || "UNPAID"}`, 20, y);

  // FOOTER - Blue Strip
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Phone: ${hospital?.contact || "+91-XXXXXXXXXX"}`, 15, 292);

  // Save File
  doc.save(`Bill_${bill.bill_id}_${patient.full_name?.replace(/\s+/g, "_") || "Patient"}.pdf`);
};

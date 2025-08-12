import jsPDF from "jspdf";

export const PrescriptionPdfGenerator = (data) => {
  const doc = new jsPDF("p", "mm", "a4");

  const patient = data.patient_info || {};
  const doctor = data.doctor_info || {};
  const hospital = data.hospital_info || {};

  const hospitalName = hospital?.name || "Hospital Name";
  const hospitalAddress = hospital?.address || "Hospital Address";
  const hospitalPhone = hospital?.contact || "+91-XXXXXXXXXX";
  const doctorName = doctor?.name || "________";
  const doctorEmail = doctor?.email || "doctor@example.com";

  // HEADER
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(hospitalName, 105, 12, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(hospitalAddress, 105, 18, { align: "center" });
  doc.text(`Phone: ${hospitalPhone}`, 105, 24, { align: "center" });

  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.7);
  doc.line(10, 42, 200, 42);

  doc.setTextColor(13, 54, 93);
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.text(`${doctorName}`, 15, 50);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text(`Email: ${doctorEmail}`, 15, 56);
  doc.setFont("times", "normal");
  doc.setTextColor(0);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 180, 50, { align: "right" });

  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.5);
  doc.line(10, 68, 200, 68);

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PRESCRIPTION", 15, 78);

  let y = 88;

  // Notes
  doc.setFont("times", "bold");
  doc.text("Note:", 15, y); y += 6;
  doc.setFont("times", "normal");
  const notes = doc.splitTextToSize(data.notes || "N/A", 180);
  doc.text(notes, 15, y);
  y += notes.length * 6 + 8;

  // Medicines
  if (!data.items || data.items.length === 0) {
    doc.setFont("times", "normal");
    doc.text("No medicines prescribed.", 15, y); y += 10;
  } else {
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setFillColor(230, 230, 230);
    doc.rect(15, y, 180, 8, "F");
    doc.setTextColor(0);
    doc.text("Sr. No.", 15, y + 6);
    doc.text("Medicine", 25, y + 6);
    doc.text("Dosage", 85, y + 6);
    doc.text("Duration", 120, y + 6);
    doc.text("Instruction", 150, y + 6);
    y += 10;

    doc.setFont("times", "normal");

    data.items.forEach((item, index) => {
      const rowHeight = 6;
      const wrappedInstruction = doc.splitTextToSize(item.instruction || "-", 45);
      const numLines = wrappedInstruction.length;
      const currentHeight = numLines * rowHeight;

      doc.rect(15, y, 10, currentHeight);
      doc.rect(25, y, 60, currentHeight);
      doc.rect(85, y, 35, currentHeight);
      doc.rect(120, y, 30, currentHeight);
      doc.rect(150, y, 45, currentHeight);

      doc.text(`${index + 1}`, 17, y + 5);
      doc.text(item.pharmacy_medicine?.medicine_name || "-", 27, y + 5);
      doc.text(item.dosage || "-", 87, y + 5);
      doc.text(`${item.duration_days || "-"} days`, 122, y + 5);
      doc.text(wrappedInstruction, 152, y + 5);

      y += currentHeight;
    });

    y += 10;
  }

  // PATIENT DETAILS IN TABLE FORMAT
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Patient Information", 15, y); y += 6;

  const patientInfo = [
    ["Full Name", patient.full_name || "N/A"],
    ["Age", patient.age || "N/A"],
    ["Gender", patient.gender || "N/A"],
    ["Blood Group", patient.blood_group || "N/A"],
    ["Contact", patient.contact_number || "N/A"],
    ["Address", patient.address || "N/A"]
  ];

  const col1Width = 40;
  const col2Width = 150;
  const rowHeight = 7;

  patientInfo.forEach(([label, value]) => {
    doc.setFont("times", "bold");
    doc.rect(15, y, col1Width, rowHeight);
    doc.text(label, 17, y + 5);

    doc.setFont("times", "normal");
    doc.rect(15 + col1Width, y, col2Width, rowHeight);
    const wrapped = doc.splitTextToSize(value, col2Width - 4);
    doc.text(wrapped, 15 + col1Width + 2, y + 5);

    y += rowHeight;
  });

  // Signatures
  y = Math.max(y + 20, 250);
  doc.setFont("times", "normal");
  doc.text("Patient's Signature", 15, y);
  doc.line(15, y + 2, 70, y + 2);
  y += 10;
  doc.text("Doctor's Signature", 140, y);
  doc.line(140, y + 2, 190, y + 2);

  // Footer
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Phone: ${hospitalPhone}`, 15, 292);

  // Open PDF in new tab
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, "_blank");
  if (!newWindow) {
    alert("Please enable pop-ups to view the prescription.");
  }
};

import jsPDF from "jspdf";

const generateClinicalNotePDF = ({ record, patient, doctor, hospital }) => {
  const doc = new jsPDF("p", "mm", "a4");

  const hospitalName = hospital?.name || "Hospital Name";
  const hospitalAddress = hospital?.address || "Hospital Address";
  const hospitalPhone = hospital?.contact || "+91-XXXXXXXXXX";

  const doctorName = doctor?.name || "________";
  const doctorEmail = doctor?.email || "doctor@example.com";

  // HEADER
  doc.setFillColor(13, 54, 93); // Dark blue
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

  // DOCTOR INFO
  doc.setTextColor(13, 54, 93);
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.text(`${doctorName}`, 15, 50);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`Email: ${doctorEmail}`, 15, 56);

  doc.setFont("times", "normal");
  doc.setTextColor(0);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 180, 50, { align: "right" });

  doc.setLineWidth(0.5);
  doc.line(10, 68, 200, 68);

  // Heading
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("CLINICAL NOTE", 15, 78);

  let y = 88;

  // Clinical Info
  const addText = (label, value) => {
    doc.setFont("times", "bold");
    doc.text(`${label}:`, 15, y);
    doc.setFont("times", "normal");
    doc.text(`${value || "N/A"}`, 50, y);
    y += 6;
  };

  addText("Pain", record.pain);
  addText("Start Date", record.pain_start_date);
  addText("Severity", record.pain_severity);
  addText("Observation", record.observation);
  addText("Diagnosis", record.diagnosis);
  addText("Advice", record.advice);
  addText("Next Follow-Up", record.next_followup_date);

  y += 4;

  // Medicines Table
  if (record.medicines?.length > 0) {
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setFillColor(230, 230, 230);
    doc.rect(15, y, 180, 8, "F");
    doc.setTextColor(0);
    doc.text("Medicine", 17, y + 6);
    doc.text("Dosage", 85, y + 6);
    doc.text("Frequency", 120, y + 6);
    y += 10;

    doc.setFont("times", "normal");

    record.medicines.forEach((med) => {
      const lineHeight = 6;
      doc.rect(15, y, 70, lineHeight); // medicine
      doc.rect(85, y, 30, lineHeight); // dosage
      doc.rect(115, y, 80, lineHeight); // frequency

      doc.text(med.medicine_name || "-", 17, y + 4);
      doc.text(`${med.dosage_amount}${med.dosage_unit}`, 87, y + 4);
      doc.text(med.frequency.replace(/_/g, " ") || "-", 117, y + 4);

      y += lineHeight;
    });

    y += 10;
  } else {
    doc.setFont("times", "normal");
    doc.text("No medicines prescribed.", 15, y);
    y += 10;
  }

  // Patient Info
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Patient Information", 15, y);
  y += 6;

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${patient.full_name || "N/A"}`, 15, y); y += 6;
  doc.text(`Age: ${patient.age || "N/A"}`, 15, y); y += 6;
  doc.text(`Gender: ${patient.gender || "N/A"}`, 15, y); y += 6;
  doc.text(`Blood Group: ${patient.blood_group || "N/A"}`, 15, y); y += 6;
  doc.text(`Contact: ${patient.contact_number || "N/A"}`, 15, y); y += 6;
  doc.text(`Address: ${patient.address || "N/A"}`, 15, y); y += 10;

  // Signatures
  y = Math.max(y + 20, 250);
  doc.setFont("times", "normal");
  doc.text("Patient's Signature", 15, y);
  doc.line(15, y + 2, 70, y + 2);

  doc.text("Doctor's Signature", 140, y);
  doc.line(140, y + 2, 190, y + 2);

  // Footer
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Phone: ${hospitalPhone}`, 15, 292);

  doc.save(`${patient.full_name?.replace(/\s+/g, "_") || "clinical_note"}.pdf`);
};

export default generateClinicalNotePDF;

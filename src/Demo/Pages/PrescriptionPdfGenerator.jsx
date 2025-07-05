// src/Pages/PrescriptionPdfGenerator.jsx
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
  doc.setFillColor(13, 54, 93); // Dark blue
  doc.rect(0, 0, 210, 40, "F"); // Header background

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(hospitalName, 105, 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(hospitalAddress, 105, 18, { align: "center" });
  doc.text(`Phone: ${hospitalPhone}`, 105, 24, { align: "center" });

  // BLUE LINE BELOW HEADER
  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.7);
  doc.line(10, 42, 200, 42);

  // DOCTOR & DATE SECTION
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

  // SECOND BLUE LINE
  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.5);
  doc.line(10, 68, 200, 68);

  // "PRESCRIPTION" HEADING
  doc.setTextColor(13, 54, 93);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.text("PRESCRIPTION", 15, 78);

  let y = 88;

  // NOTES
  doc.setFont("times", "bold");
  doc.text("Note:", 15, y); y += 6;

  doc.setFont("times", "normal");
  const notes = doc.splitTextToSize(data.notes || "N/A", 180);
  doc.text(notes, 15, y);
  y += notes.length * 6 + 8;

  // MEDICINES
  if (!data.items || data.items.length === 0) {
    doc.setFont("times", "bold");
    // doc.text("Prescribed Medicines:", 15, y); y += 6;
    doc.setFont("times", "normal");
    doc.text("No medicines prescribed.", 15, y); y += 10;
  } else {
    doc.setFont("times", "bold");
    // doc.text("Prescribed Medicines:", 15, y); y += 8;

    // Table headers
    doc.setFontSize(11);
    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230); // Light gray background
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

      // Draw cells
      doc.rect(15, y, 10, currentHeight); // #
      doc.rect(25, y, 60, currentHeight); // medicine
      doc.rect(85, y, 35, currentHeight); // dosage
      doc.rect(120, y, 30, currentHeight); // duration
      doc.rect(150, y, 45, currentHeight); // instruction

      // Add content
      doc.text(`${index + 1}`, 17, y + 5);
      doc.text(item.medicine_name || "-", 27, y + 5);
      doc.text(item.dosage || "-", 87, y + 5);
      doc.text(`${item.duration_days || "-"} days`, 122, y + 5);
      doc.text(wrappedInstruction, 152, y + 5);

      y += currentHeight;
    });

    y += 30; // Space after medicine table
  }

  // PATIENT DETAILS
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  // doc.text("Patient Information:", 15, y); y += 6;

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${patient.full_name || "N/A"}`, 15, y); y += 6;
  doc.text(`Age: ${patient.age || "N/A"}   `, 15, y); y += 6;
  doc.text(`Gender: ${patient.gender || "N/A"}`, 15, y); y += 6;
  doc.text(`Blood Group: ${patient.blood_group || "N/A"}`, 15, y); y += 6;
  doc.text(`Contact: ${patient.contact_number || "N/A"}`, 15, y); y += 6;
  doc.text(`Address: ${patient.address || "N/A"}`, 15, y); y += 10;

  // SIGNATURES
  y = Math.max(y + 20, 250);
  doc.setFont("times", "normal");
  doc.text("Patient's Signature", 15, y);
  doc.line(15, y + 2, 70, y + 2);
  y += 10;
  doc.text("Doctor's Signature", 140, y);
  doc.line(140, y + 2, 190, y + 2);

  // FOOTER
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Phone: ${hospitalPhone}`, 15, 292);

  // PREVIEW IN NEW TAB
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, "_blank");

  if (!newWindow) {
    alert("Please enable pop-ups to view the prescription.");
  }
};

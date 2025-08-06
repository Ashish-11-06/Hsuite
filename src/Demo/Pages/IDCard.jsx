// IDCard.jsx
import jsPDF from "jspdf";

/**
 * Generates and downloads a styled Patient ID Card as a PDF.
 * @param {Object} patient - The patient data object.
 * @param {Object} hospital - The hospital data object.
 */
const IdCard = (patient, hospital) => {
  const doc = new jsPDF("p", "mm", [80, 100]); // ID card size

  // HEADER BACKGROUND
  doc.setFillColor(0, 102, 204); // Blue background
  doc.rect(0, 0, 90, 20, "F"); // Full width, 20mm height

  // HOSPITAL NAME - White text
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255); // White
  doc.text(hospital?.name?.toUpperCase() || "HOSPITAL NAME", 5, 8);

  // ADDRESS & CONTACT
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Address: ${hospital?.address || "N/A"}`, 5, 13);
  doc.text(`Contact: ${hospital?.contact || hospital?.phone || "N/A"}`, 5, 17);

  // RESET TEXT COLOR TO BLACK
  doc.setTextColor(0, 0, 0);

  // Draw separator line
  doc.setDrawColor(0);
  doc.line(5, 21, 85, 21);

  // PATIENT DETAILS SECTION
  let y = 26;
  const lineSpacing = 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT ID CARD", 28, y);
  y += lineSpacing + 1;

  doc.setFont("helvetica", "normal");

  doc.text(`ID: ${patient.patient_id || patient.id || "N/A"}`, 5, y); y += lineSpacing;
  doc.text(`Name: ${patient.full_name || "N/A"}`, 5, y); y += lineSpacing;
  doc.text(`Age: ${patient.age || "N/A"}`, 5, y); y += lineSpacing;
  doc.text(`Gender: ${patient.gender || "N/A"}`, 5, y); y += lineSpacing;
  doc.text(`Contact: ${patient.contact_number || "N/A"}`, 5, y); y += lineSpacing;
  doc.text(`Blood: ${patient.blood_group || "N/A"}`, 5, y);
  doc.text(`Address:`, 5, y + lineSpacing);
  doc.setFontSize(8);
  doc.text(`${patient.address || "N/A"}`, 5, y + lineSpacing + 4, { maxWidth: 80 });

  // SAVE
  const filename = `Patient_ID_Card_${patient.patient_id || patient.id || "Unknown"}.pdf`;
  doc.save(filename);
};

export default IdCard;

import jsPDF from "jspdf";

export const downloadCertificatePDF = async (record, previewOnly = false) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Extracting from record
  const hospitalName = record.hospital_name || "Hospital Name";
  const hospitalAddress = record.hospital_address || "Hospital Address";
  const hospitalPhone = record.hospital_contact || "+91-XXXXXXXXXX";
  const doctorName = record.doctor_name || "Dr. __________";
  const doctorEmail = record.doctor_email || "doctor@example.com";

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

  // Horizontal line below header
  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.7);
  doc.line(10, 42, 200, 42);

  // Doctor Info and Date
  doc.setTextColor(13, 54, 93);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text(`${doctorName}`, 15, 50);

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text(`Email: ${doctorEmail}`, 15, 56);

  doc.setFont("times", "normal");
  doc.setTextColor(0);
  doc.text(`Date: ${record.date || "__________"}`, 180, 50, { align: "right" });

  // Second blue line
  doc.setDrawColor(13, 54, 93);
  doc.setLineWidth(0.5);
  doc.line(10, 68, 200, 68);

  // Title
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("RECOVERY CERTIFICATE", 105, 78, { align: "center" });

  // Body
  let bodyY = 88;
  doc.setFont("times", "normal");
  const bodyText = `This is to certify that I, ${doctorName} after examining Ms./Mr. ${record.patient_name || "__________"}, aged about ${record.patient_age || "__"} years, gender - ${record.patient_gender || "__"}, resident of ${record.patient_address || "__________"}, whose signature is verified as under, has found that the patient has completely recovered from the illness of ${record.description || "__________"} and is now fit to resume activities of daily living with effect from ${record.remark || "__________"}.

I also certify that I have examined the required medical history of the patient and have taken them into consideration in arriving at my decision.`;

  doc.setFontSize(14);
  doc.text(doc.splitTextToSize(bodyText, 180), 15, bodyY);

  // Signatures
  let sigY = Math.max(bodyY + 80, 250);
  doc.setFont("times", "normal");
  doc.text("Patient's Signature", 15, sigY);
  doc.line(15, sigY + 2, 70, sigY + 2);

  sigY += 10;
  doc.text("Doctor's Signature", 140, sigY);
  doc.line(140, sigY + 2, 190, sigY + 2);

  sigY += 10;
  doc.setFont("times", "bold");
  doc.text(doctorName, 140, sigY);

  // FOOTER
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Phone: ${hospitalPhone}`, 15, 292);

  // Output
  if (previewOnly) {
    const pdfBlob = await doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  } else {
    doc.save(`Recovery_Certificate_${record.date || "Date"}.pdf`);
  }
};

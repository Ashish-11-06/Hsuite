import jsPDF from "jspdf";

const generateVitalsPDF = ({ record, patient, hospital }) => {
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

  // Title Section
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Vitals Report", 105, 55, { align: "center" });

  // Patient Info Section
  let y = 70;
  const addLine = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${label}:`, 20, y);
    doc.text(`${value ?? "N/A"}`, 70, y);
    y += 8;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Patient Information", 20, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 6;

  addLine("Patient Name", patient?.full_name);
  addLine("Date", record?.date);
  addLine("Gender", patient?.gender);
  addLine("Age", patient?.age);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Vitals Summary", 20, y);
  y += 8;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 6;

  // Vitals
  addLine("Temperature", record?.temperature);
  addLine("Pulse", record?.pulse);
  addLine("Blood Pressure", record?.blood_pressure);
  addLine("Weight", record?.weight);
  addLine("Height", record?.height);
  addLine("CNS", record?.cns);
  addLine("RS", record?.rs);
  addLine("PA", record?.pa);
  addLine("WBC", record?.wbc);
  addLine("RBC", record?.rbc);

  // FOOTER - Blue Strip
  doc.setFillColor(13, 54, 93);
  doc.rect(0, 285, 210, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Phone: ${hospital?.contact || "+91-XXXXXXXXXX"}`, 15, 292);

  // Save File
  doc.save(`Vitals_${patient?.full_name?.replace(/\s+/g, "_") || "Patient"}_${record?.date || "Date"}.pdf`);
};

export default generateVitalsPDF;

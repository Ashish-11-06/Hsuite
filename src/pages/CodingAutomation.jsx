import React, { useState } from 'react';
import { Upload, Card, Typography, Row, Col, Button, Space, Image, message } from 'antd';
import { UploadOutlined, FileImageOutlined, FileWordOutlined, FilePdfOutlined, FileExcelOutlined ,DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { runCodeAutomation, resetCodeAutomationState } from "../Redux/Slices/AIintegrationSlice";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const FilePreview = ({ file }) => {
  if (file.type === 'Image') return <Image src={file.content} alt={file.name} style={{ maxWidth: '100%', maxHeight: '200px' }} />;
  
  const iconProps = {
    PDF: { icon: <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} /> },
    Word: { icon: <FileWordOutlined style={{ fontSize: '48px', color: '#1890ff' }} /> },
    Excel: { icon: <FileExcelOutlined style={{ fontSize: '48px', color: '#52c41a' }} /> }
  };

  return (
    <div style={{ padding: '16px', border: '1px dashed #d9d9d9', textAlign: 'center' }}>
      {iconProps[file.type]?.icon || <FilePdfOutlined style={{ fontSize: '48px', color: '#888' }} />}
      <p>{file.name}</p>
      <p>({file.type} document)</p>
    </div>
  );
};

const CodingAutomation = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.aiintegration || {});
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const renderGeneratedCodes = () => {
    if (!data?.sections) return 'No specific codes identified';
    
    const sectionsToShow = [
      "6_medical_coding_summary:",
      "7_medical_codes:"
    ];
    
    return sectionsToShow.map((sectionKey) => {
      if (!data.sections[sectionKey]) return null;
      
      const title = sectionKey
        .replace(/_/g, ' ')
        .replace(/:/g, '')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      return (
        <div key={sectionKey} style={{ marginBottom: '24px' }}>
          <Title level={5}>{title}</Title>
          <Paragraph style={{ 
            whiteSpace: 'pre-line', 
            background: '#fafafa', 
            padding: '16px', 
            borderRadius: '4px'
          }}>
            {data.sections[sectionKey]}
          </Paragraph>
        </div>
      );
    });
  };

  const renderAnalysisReport = () => {
    if (!data?.sections) return null;
    
    const sectionsToShow = [
      "1_patient_demographics:",
      "2_diagnosis_and_icd_10_codes:",
      "3_symptoms_mentioned:",
      "4_treatment_plan:",
      "5_medications_and_dosage:"
    ];
    
    return sectionsToShow.map((sectionKey) => {
      if (!data.sections[sectionKey]) return null;
      
      const title = sectionKey
        .replace(/_/g, ' ')
        .replace(/:/g, '')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      return (
        <div key={sectionKey} style={{ marginBottom: '24px' }}>
          <Title level={5}>{title}</Title>
          <Paragraph style={{ 
            whiteSpace: 'pre-line', 
            background: '#fafafa', 
            padding: '16px', 
            borderRadius: '4px'
          }}>
            {data.sections[sectionKey]}
          </Paragraph>
        </div>
      );
    });
  };

  const handleFile = async (info, fileType) => {
    const file = info.file;
    if (file.size > 10 * 1024 * 1024) return message.error('File size must be less than 10MB');

    dispatch(resetCodeAutomationState());
    setSelectedFile(file);

    if (fileType === 'Image') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const preview = [{ type: fileType, content: e.target.result, name: file.name }];
        setFilePreviews(preview);
        await processDocument(file);
      };
      reader.readAsDataURL(file);
    } else {
      const preview = [{ type: fileType, content: null, name: file.name }];
      setFilePreviews(preview);
      await processDocument(file);
    }
  };

  const processDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await dispatch(runCodeAutomation(formData)).unwrap();

      if (data?.status !== 'success') {
        message.error('Failed to process document');
      }
    } catch (err) {
      message.error(err.message || 'Failed to process document');
    }
  };

  const downloadReport = () => {
    if (!data?.analysis_report) return message.error('No report available');
    
    let reportContent = '';
    
    // Add the specific sections to the report
    const sectionsToShow = [
      "1_patient_demographics:",
      "2_diagnosis_and_icd_10_codes:",
      "3_symptoms_mentioned:",
      "4_treatment_plan:",
      "5_medications_and_dosage:",
      "6_medical_coding_summary:",
      "7_medical_codes:"
    ];
    
    sectionsToShow.forEach(sectionKey => {
      if (data.sections?.[sectionKey]) {
        const title = sectionKey
          .replace(/_/g, ' ')
          .replace(/:/g, '')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        reportContent += `=== ${title} ===\n${data.sections[sectionKey]}\n\n`;
      }
    });
    
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([reportContent], { type: 'text/plain' }));
    element.download = "medical_analysis_report.txt";
    document.body.appendChild(element).click();
    document.body.removeChild(element);
  };

  const printReport = () => {
    if (!data?.analysis_report) return message.error('No report available');
    const printWindow = window.open('', '', 'width=800,height=600');
    
    let sectionsHtml = '';
    const sectionsToShow = [
      "1_patient_demographics:",
      "2_diagnosis_and_icd_10_codes:",
      "3_symptoms_mentioned:",
      "4_treatment_plan:",
      "5_medications_and_dosage:",
      "6_medical_coding_summary:",
      "7_medical_codes:"
    ];
    
    sectionsToShow.forEach(sectionKey => {
      if (data.sections?.[sectionKey]) {
        const title = sectionKey
          .replace(/_/g, ' ')
          .replace(/:/g, '')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        sectionsHtml += `
          <div class="section">
            <h2>${title}</h2>
            <pre>${data.sections[sectionKey]}</pre>
          </div>
        `;
      }
    });
    
    printWindow.document.write(`
      <html><head><title>Medical Analysis Report</title><style>
        body { font-family: Arial; line-height: 1.6; padding: 20px; }
        h1 { color: #1890ff; } 
        h2 { color: #1890ff; font-size: 1.2em; margin-top: 20px; }
        pre { white-space: pre-wrap; font-family: inherit; }
        .section { margin-bottom: 20px; }
        .codes { background: #f5f5f5; padding: 15px; border-radius: 4px; }
      </style></head><body>
        <h1>Medical Analysis Report</h1>
        ${sectionsHtml}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const uploadProps = (fileType) => ({
    name: 'file',
    multiple: false,
    showUploadList: false,
    onChange: (info) => handleFile(info, fileType),
    beforeUpload: () => false,
     accept: fileType === 'Image' ? 'image/*' : 
            fileType === 'Word' ? '.doc,.docx' : 
            fileType === 'Excel' ? '.xls,.xlsx' : 
            '.pdf'
  });

   const renderUploadCard = (type, color, text) => (
    <Col span={6}>
      <Card hoverable>
        <Dragger {...uploadProps(type)}>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            {type === 'Image' ? <FileImageOutlined style={{ fontSize: '32px', color }} /> :
             type === 'Word' ? <FileWordOutlined style={{ fontSize: '32px', color }} /> :
             type === 'Excel' ? <FileExcelOutlined style={{ fontSize: '32px', color }} /> :
             <FilePdfOutlined style={{ fontSize: '32px', color }} />}
            <Title level={4} style={{ marginTop: '8px' }}>Upload {type}</Title>
            <Text type="secondary">{text}</Text>
            {/* <Button icon={<UploadOutlined />} style={{ marginTop: '16px' }}>Select File</Button> */}
          </div>
        </Dragger>
      </Card>
    </Col>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Medical Coding Automation</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {renderUploadCard('Image', '#52c41a', 'JPG, PNG, etc.')}
        {renderUploadCard('Word', '#1890ff', 'DOC, DOCX')}
        {renderUploadCard('PDF', '#ff4d4f', 'PDF documents')}
         {renderUploadCard('Excel', '#52c41a', 'XLS, XLSX')}
      </Row>

      {filePreviews.length > 0 && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card title="Uploaded Document" bordered={false}>
                {filePreviews.map((file, i) => (
                  <div key={i}>
                    <FilePreview file={file} />
                    <div style={{ marginTop: '16px' }}>
                      <Text strong>File Name:</Text> {file.name}<br />
                      <Text strong>Type:</Text> {file.type} document
                    </div>
                  </div>
                ))}
              </Card>
            </Col>

            <Col span={9}>
              <Card 
                title="Analysis Report" 
                bordered={false}
                extra={
                  <Space>
                    <Button 
                      icon={<DownloadOutlined />} 
                      onClick={downloadReport}
                      disabled={!data?.analysis_report}
                    />
                    <Button 
                      icon={<PrinterOutlined />} 
                      onClick={printReport}
                      disabled={!data?.analysis_report}
                    />
                  </Space>
                }
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Paragraph>Processing document...</Paragraph>
                  </div>
                ) : (
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {renderAnalysisReport()}
                  </div>
                )}
              </Card>
            </Col>

            <Col span={9}>
              <Card 
                title="Generated Codes" 
                bordered={false}
                extra={
                  <Space>
                    <Button 
                      icon={<DownloadOutlined />} 
                      onClick={downloadReport}
                      disabled={!data?.analysis_report}
                    />
                    <Button 
                      icon={<PrinterOutlined />} 
                      onClick={printReport}
                      disabled={!data?.analysis_report}
                    />
                  </Space>
                }
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Paragraph>Processing document...</Paragraph>
                  </div>
                ) : (
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {renderGeneratedCodes()}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}

      {error && (
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#fff1f0', 
          border: '1px solid #ffccc7', 
          borderRadius: '4px', 
          textAlign: 'center'
        }}>
          <Text type="danger">Error: {error.message || 'Failed to process document'}</Text>
        </div>
      )}
    </div>
  );
};

export default CodingAutomation;
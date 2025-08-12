import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, Steps, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { TextArea } = Input;

const NotesModal = ({ visible, onCancel, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: {},
    doctor: {},
    lab: {},
    additional: {},
  });

  const [form] = Form.useForm();

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        const currentStep = ["patient", "doctor", "lab", "additional"][step];
        const updated = { ...formData, [currentStep]: { ...formData[currentStep], ...values } };
        setFormData(updated);

        if (step === 3) {
          onSubmit(updated);
          form.resetFields();
          setStep(0);
        } else {
          setStep(step + 1);
          form.resetFields();
        }
      })
      .catch(() => {
        message.error("Please fill all required fields");
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setStep(0);
    setFormData({ patient: {}, doctor: {}, lab: {}, additional: {} });
    onCancel();
  };

  const uploadProps = (section) => ({
    beforeUpload: (file) => {
      const fileURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          file: fileURL,
          fileName: file.name,
        },
      }));
      return false;
    },
    showUploadList: false,
  });

  const renderFilePreview = (section) => {
    const { file, fileName } = formData[section];
    if (!file) return null;

    const isImage = file?.includes("image");
    return (
      <div style={{ marginTop: 8 }}>
        <b>Uploaded:</b> {fileName}
        <div style={{ marginTop: 8 }}>
          {fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img src={file} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200 }} />
          ) : (
            <a href={file} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          )}
        </div>
      </div>
    );
  };

  const steps = [
    {
      title: "Patient Data",
      content: (
        <>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="bloodGroup" label="Blood Group" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Doctor Notes",
      content: (
        <>
          <Form.Item name="diagnosis" label="Diagnosis" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
          <Form.Item name="notes" label="Clinical Notes" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
          <Form.Item name="treatment" label="Treatment Plan" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
          <Form.Item name="allergies" label="Known Allergies">
            <Input />
          </Form.Item>
          <Form.Item name="medicalHistory" label="Medical History">
            <TextArea />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Lab Reports",
      content: (
        <>
          <Form.Item name="tests" label="Tests Done" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
          <Form.Item label="Upload File">
            <Upload {...uploadProps("lab")}>
              <Button icon={<UploadOutlined />}>Upload Lab Report</Button>
            </Upload>
            {renderFilePreview("lab")}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Additional Report",
      content: (
        <>
          <Form.Item name="report" label="MRI/CT Report" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
          <Form.Item label="Upload File">
            <Upload {...uploadProps("additional")}>
              <Button icon={<UploadOutlined />}>Upload Report</Button>
            </Upload>
            {renderFilePreview("additional")}
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      title="Add Clinical Details"
      onCancel={handleCancel}
      footer={[
        <Button key="next" type="primary" onClick={handleNext}>
          {step === 3 ? "Submit" : "Next"}
        </Button>,
      ]}
    >
      <Steps current={step} size="small" style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Form layout="vertical" form={form}>
        {steps[step].content}
      </Form>
    </Modal>
  );
};

export default NotesModal;

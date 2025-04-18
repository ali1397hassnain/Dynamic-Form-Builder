import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const FileUploadField = ({ 
  name, 
  label, 
  required,
  multiple = false
}) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[{ required, message: `${label} is required` }]}
    >
      <Upload 
        beforeUpload={() => false} // Prevent auto upload
        multiple={multiple}
      >
        <Button icon={<UploadOutlined />}>
          Click to Upload
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default FileUploadField;
import { Form, Input } from 'antd';

const TextareaField = ({ 
  name, 
  label, 
  required, 
  placeholder,
  rows = 4 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: `${label} is required` }]}
    >
      <Input.TextArea 
        placeholder={placeholder} 
        rows={rows} 
      />
    </Form.Item>
  );
};

export default TextareaField;
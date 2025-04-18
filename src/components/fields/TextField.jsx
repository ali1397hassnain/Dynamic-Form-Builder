import { Form, Input } from 'antd';

const TextField = ({ 
  name, 
  label, 
  required, 
  placeholder, 
  validation
}) => {
  const rules = [
    { required, message: `${label} is required` }
  ];

  if (validation?.pattern) {
    rules.push({
      pattern: new RegExp(validation.pattern),
      message: validation.message || 'Invalid format'
    });
  }

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
    >
      <Input placeholder={placeholder}/>
    </Form.Item>
  );
};

export default TextField;
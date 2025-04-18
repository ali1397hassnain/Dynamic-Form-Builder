import { Form, InputNumber } from 'antd';

const NumberField = ({ 
  name, 
  label, 
  required, 
  min, 
  max,
  placeholder 
}) => {
  const rules = [
    { required, message: `${label} is required` },
    { type: 'number', message: 'Must be a number' }
  ];

  if (min !== undefined) {
    rules.push({ 
      min, 
      message: `Minimum value is ${min}`,
      type: 'number' 
    });
  }

  if (max !== undefined) {
    rules.push({ 
      max, 
      message: `Maximum value is ${max}`,
      type: 'number' 
    });
  }

  return (
    <Form.Item name={name} label={label} rules={rules}>
      <InputNumber 
        placeholder={placeholder}
        style={{ width: '100%' }} 
      />
    </Form.Item>
  );
};

export default NumberField;
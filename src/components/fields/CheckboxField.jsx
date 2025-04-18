import { Form, Checkbox } from 'antd';

const CheckboxField = ({ 
  name, 
  label, 
  required,
  options, // Only for checkbox group
  single // If single checkbox
}) => {
  if (single) {
    return (
      <Form.Item
        name={name}
        valuePropName="checked"
        rules={[{ required, message: `${label} is required` }]}
      >
        <Checkbox>{label}</Checkbox>
      </Form.Item>
    );
  }

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: `${label} is required` }]}
    >
      <Checkbox.Group>
        {options.map(option => (
          <Checkbox key={option.value} value={option.value}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );
};

export default CheckboxField;
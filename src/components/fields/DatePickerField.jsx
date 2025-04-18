import { Form, DatePicker } from 'antd';

const DatePickerField = ({ 
  name, 
  label, 
  required, 
  placeholder,
  picker = 'date' // 'week'|'month'|'quarter'|'year'
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: `${label} is required` }]}
    >
      <DatePicker 
        placeholder={placeholder}
        style={{ width: '100%' }}
        picker={picker}
      />
    </Form.Item>
  );
};

export default DatePickerField;
import { Form, Select } from 'antd';

const DropdownField = ({ 
  name, 
  label, 
  required, 
  options, 
  placeholder,
  mode 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: `${label} is required` }]}
    >
      <Select 
        placeholder={placeholder}
        mode={mode}
        optionFilterProp="label"
        showSearch
      >
        {options.map(option => (
          <Select.Option 
            key={option.value} 
            value={option.value}
            label={option.label}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default DropdownField;
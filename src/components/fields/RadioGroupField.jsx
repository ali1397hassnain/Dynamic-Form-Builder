import { Form, Radio, Space } from 'antd';

const RadioGroupField = ({ 
  name, 
  label, 
  required, 
  options 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: `${label} is required` }]}
    >
      <Radio.Group>
        <Space direction="vertical">
          {options.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Form.Item>
  );
};

export default RadioGroupField;
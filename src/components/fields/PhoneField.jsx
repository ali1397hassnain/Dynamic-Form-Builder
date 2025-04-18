import { Form } from 'antd';
import { useState } from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneField = ({ 
  name, 
  label, 
  required,
  placeholder
}) => {
  const [value, setValue] = useState();

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        { required, message: `${label} is required` },
        { 
          validator: (_, val) => 
            val && !val.startsWith('+') 
              ? Promise.reject('Include country code') 
              : Promise.resolve()
        }
      ]}
    >
      <PhoneInput
        international
        placeholder={placeholder}
        defaultCountry="PK"
        value={value}
        onChange={setValue}
      />
    </Form.Item>
  );
};

export default PhoneField;
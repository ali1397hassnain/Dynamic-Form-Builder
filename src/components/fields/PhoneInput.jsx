import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Input } from 'antd';

const CustomPhoneInput = ({ value, onChange, ...props }) => {
  return (
    <PhoneInput
      international
      defaultCountry="US"
      value={value}
      onChange={onChange}
      inputComponent={Input}
      {...props}
    />
  );
};

export default CustomPhoneInput;
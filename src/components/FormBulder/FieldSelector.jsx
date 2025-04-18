import { useState } from 'react';
import { Button, Select, Input, Form, Row, Col, InputNumber, Switch, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addField } from '../../features/form/formSlice';

const { Option } = Select;
const { TextArea } = Input;

const FieldSelector = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState('');
  const [options, setOptions] = useState([{ value: '', label: '' }]);
  const { sections } = useSelector(state => state.form);

  const fieldTypes = [
    'text', 'textarea', 'number', 
    'dropdown', 'radio', 'checkbox', 
    'phone', 'date', 'file'
  ];

  const handleAddOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, key, value) => {
    const newOptions = [...options];
    newOptions[index][key] = value;
    setOptions(newOptions);
  };

  const flattenSections = (sections, level = 0) => {
    let result = [];
    sections.forEach(section => {
      result.push({
        ...section,
        title: `${'— '.repeat(level)}${section.title}`,
        level
      });
      if (section.sections.length > 0) {
        result = [...result, ...flattenSections(section.sections, level + 1)];
      }
    });
    return result;
  };

  const onFinish = (values) => {
    const fieldConfig = {
      id: `field-${Date.now()}`,
      type: values.type,
      label: values.label,
      placeholder: values.placeholder,
      required: values.required || false,
      validation: {
        min: values.min,
        max: values.max,
        pattern: values.pattern
      }
    };

    if (['dropdown', 'radio', 'checkbox'].includes(values.type)) {
      fieldConfig.options = options.filter(opt => opt.value && opt.label);
    }

    dispatch(addField({
      field: fieldConfig,
      sectionId: values.sectionId === "" ? null : values.sectionId
    }));

    form.resetFields();
    setOptions([{ value: '', label: '' }]);
  };

  return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="label" label="Field Label" rules={[{ required: true }]}>
              <Input placeholder="e.g. Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Field Type" rules={[{ required: true }]}>
              <Select onChange={setSelectedType} placeholder="Select type">
                {fieldTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="sectionId" label="Assign to Section">
          <Select 
            placeholder="(Optional) Select section"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            <Option value="">Top Level</Option>
            {flattenSections(sections).map(section => (
              <Option key={section.id} value={section.id}>
                {section.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="placeholder" label="Placeholder Text">
          <Input />
        </Form.Item>

        <Form.Item name="required" label="Required" valuePropName="checked">
          <Switch />
        </Form.Item>

        {['number'].includes(selectedType) && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="min" label="Minimum Value">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max" label="Maximum Value">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {['dropdown', 'radio', 'checkbox'].includes(selectedType) && (
          <div>
            <Divider orientation="left">Options</Divider>
            {options.map((option, index) => (
              <Row gutter={16} key={index} style={{ marginBottom: '8px' }}>
                <Col span={10}>
                  <Input
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  />
                </Col>
                <Col span={10}>
                  <Input
                    placeholder="Display Label"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  />
                </Col>
                <Col span={4}>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemoveOption(index)}
                  />
                </Col>
              </Row>
            ))}
            <Button 
              type="dashed" 
              onClick={handleAddOption} 
              icon={<PlusOutlined />}
            >
              Add Option
            </Button>
          </div>
        )}

        <Form.Item style={{ marginTop: '16px' }}>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Field
          </Button>
        </Form.Item>
      </Form>
  );
};

export default FieldSelector;
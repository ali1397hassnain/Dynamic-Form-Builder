import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCondition } from '../../features/form/formSlice';

const { Option } = Select;

const ConditionalLogicEditor = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { fields, sections } = useSelector(state => state.form);

  const getAllFields = () => {
    const allFields = [...fields];
    const flattenSectionFields = (section) => {
      allFields.push(...section.fields);
      section.sections.forEach(flattenSectionFields);
    };
    sections.forEach(flattenSectionFields);
    return allFields;
  };

  const onFinish = (values) => {
    dispatch(addCondition({
      id: `cond-${Date.now()}`,
      sourceId: values.sourceId,    
      targetId: values.targetId,    
      action: values.action,        
      operator: values.operator,    
      value: values.value           
    }));
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={() => setOpen(true)}>
        Add Conditional Logic
      </Button>
      <Modal
        title="Conditional Logic"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="targetId" label="Target Field/Section" rules={[{ required: true }]}>
            <Select placeholder="Select what to show/hide">
              {getAllFields().map(field => (
                <Option key={field.id} value={field.id}>
                  Field: {field.label}
                </Option>
              ))}
              {sections.map(section => (
                <Option key={section.id} value={section.id}>
                  Section: {section.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="action" label="Action" rules={[{ required: true }]}>
            <Select>
              <Option value="show">Show when conditions are met</Option>
              <Option value="hide">Hide when conditions are met</Option>
            </Select>
          </Form.Item>

          <Form.Item name="sourceId" label="When this field" rules={[{ required: true }]}>
            <Select placeholder="Select field to check">
              {getAllFields().map(field => (
                <Option key={field.id} value={field.id}>
                  {field.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="operator" label="Has value that" rules={[{ required: true }]}>
            <Select>
              <Option value="equals">Equals</Option>
              <Option value="notEquals">Does not equal</Option>
              <Option value="contains">Contains</Option>
              <Option value="greaterThan">Is greater than</Option>
              <Option value="lessThan">Is less than</Option>
            </Select>
          </Form.Item>

          <Form.Item name="value" label="Value" rules={[{ required: true }]}>
            <Input placeholder="Enter comparison value" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ConditionalLogicEditor;
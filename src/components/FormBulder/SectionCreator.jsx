import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSection } from '../../features/form/formSlice';

const SectionCreator = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { sections } = useSelector(state => state.form);

  const onFinish = (values) => {
    dispatch(addSection({
      title: values.title,
      parentId: values.parentId === "" ? null : values.parentId
    }));
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={() => setOpen(true)}>
        Add Section
      </Button>
      <Modal
        title="Create New Section"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="title" label="Section Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Personal Information" />
          </Form.Item>
          <Form.Item name="parentId" label="Parent Section (optional)">
            <Select placeholder="Select parent section">
              <Select.Option value="">None (Top Level)</Select.Option>
              {sections.map(section => (
                <Select.Option key={section.id} value={section.id}>
                  {section.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SectionCreator;
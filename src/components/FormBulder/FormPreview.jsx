import { Form, Button, Collapse, notification, Alert, Space, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  TextareaField,
  NumberField,
  DropdownField,
  RadioGroupField,
  CheckboxField,
  DatePickerField,
  PhoneField,
  FileUploadField,
} from "../fields";
import {
  createFieldLabelLookup,
  selectVisibleFormData,
} from "../../features/form/formSelectors";
import { setFormData } from "../../features/form/formSlice";
import { useState } from "react";
import useNotification from "../../hooks/useNotification";
import { FileDoneOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const FormPreview = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form) || {};
  const [submitting, setSubmitting] = useState(false);
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const { fields, sections } = useSelector((state) =>
    selectVisibleFormData(state, formValues || {})
  );

  const fieldLabelLookup = useSelector(createFieldLabelLookup);
  const conditions = useSelector((state) => state.form.conditionalLogic);
  const getFieldLabel = (fieldId) => fieldLabelLookup[fieldId] || fieldId;

  const onFinish = (values) => {
    setSubmitting(true);
    setTimeout(() => {
      try {
        const success = true;

        if (success) {
          console.log("Form submitted:", values);
          dispatch(setFormData(values));
          openNotificationWithIcon("success", {
            message: "Form Submitted",
            description: "Your data has been saved successfully!",
          });
          form.resetFields();
        } else {
          openNotificationWithIcon("error", {
            message: "Validation Failed",
            description: "Please check your entries and try again.",
          });
        }
      } finally {
        setSubmitting(false);
      }
    }, 500);
  };

  const fieldComponents = {
    text: TextField,
    textarea: TextareaField,
    dropdown: DropdownField,
    radio: RadioGroupField,
    file: FileUploadField,
    checkbox: CheckboxField,
    date: DatePickerField,
    number: NumberField,
    phone: PhoneField,
  };

  const renderField = (field) => {
    const FieldComponent = fieldComponents[field.type];
    if (!FieldComponent) return null;

    const fieldConditions = conditions.filter((c) => c.targetId === field.id);

    return (
      <div className={conditions.length ? "conditional-field" : ""}>
        <FieldComponent
          key={field.id}
          name={field.id}
          label={
            <>
              {field.label}
              {fieldConditions.length > 0 && (
                <span className="text-xs text-blue-500 ml-2">
                  (Conditional)
                </span>
              )}
            </>
          }
          required={field.required}
          placeholder={field.placeholder}
          options={field.options}
          {...field.validation}
        />
        {fieldConditions.length > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {fieldConditions.map((cond) => (
              <div key={cond.id}>
                {cond.action === "show" ? "Shows" : "Hides"} when{" "}
                <span className="font-medium">
                  {getFieldLabel(cond.sourceId)}
                </span>{" "}
                {cond.operator} "{cond.value}"
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  console.log("sections", sections);

  const renderSection = (section, level = 0) => {
    const sectionKey = `section-${section.id}`;
    const parentKeys = [];
    let current = section;
    while (current.parentId) {
      parentKeys.unshift(`section-${current.parentId}`);
      current = sections.find(s => s.id === current.parentId);
    }
  
    return (
      <Panel
        key={sectionKey}
        header={
          <div style={{ paddingLeft: `${level * 16}px` }}>
            {section.title}
          </div>
        }
        extra={
          <span className="text-xs text-gray-500">
            {section.fields.length > 0
              ? `${section.fields.length} field(s)`
              : section.sections.length > 0 &&
                `${section.sections.length} sub-section(s)`}
          </span>
        }
        forceRender
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {section.fields.map((field) => (
            <div key={field.id}>{renderField(field)}</div>
          ))}
          <Collapse 
            accordion
            bordered={false}
            defaultActiveKey={parentKeys} 
            ghost 
          >
            {section.sections.map((subSection) =>
              renderSection(subSection, level + 1)
            )}
          </Collapse>
        </Space>
      </Panel>
    );
  };


  // const renderSection = (section, level = 0) => (
  //   <Panel
  //     key={section.id}
  //     header={
  //       <div style={{ paddingLeft: `${level * 16}px` }}>{section.title}</div>
  //     }
  //     extra={
  //       <span className="text-xs text-gray-500">
  //         {section.fields.length > 0
  //           ? `${section.fields.length} field(s)`
  //           : section.sections.length > 0 &&
  //             `${section.sections.length} sub-section(s)`}
  //       </span>
  //     }
  //   >
  //     <Space direction="vertical" style={{ width: "100%" }}>
  //       {section.fields.map((field) => (
  //         <div key={field.id}>{renderField(field)}</div>
  //       ))}
  //       {section.sections.map((subSection) =>
  //         renderSection(subSection, level + 1)
  //       )}
  //     </Space>
  //   </Panel>
  // );

  return (
    <div>
      {contextHolder}
      <Spin spinning={submitting}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          {fields.length === 0 && sections.length === 0 ? (
            <Alert message="No fields added yet" type="info" showIcon />
          ) : (
            <Collapse
              accordion
              bordered={false}
              defaultActiveKey={["root-fields"]}
              className="bg-white"
            >
              {fields.length > 0 && (
                <Panel key="root-fields" header="Root Fields" showArrow={false}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {fields.map((field) => (
                      <div key={field.id}>{renderField(field)}</div>
                    ))}
                  </Space>
                </Panel>
              )}
              {sections.map((section) => renderSection(section))}
            </Collapse>
          )}

          {(fields.length > 0 || sections.length > 0) && (
            <Form.Item style={{ marginTop: 24, padding: "4 26px" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<FileDoneOutlined />}
                style={{ padding: "4px 12px" }}
              >
                Submit Form
              </Button>
            </Form.Item>
          )}
        </Form>
      </Spin>
    </div>
  );
};

export default FormPreview;

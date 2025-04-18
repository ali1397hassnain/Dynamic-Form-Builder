import { Drawer, Descriptions, Collapse, Button, Card, Space, Alert } from "antd";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { createFieldLabelLookup } from "../features/form/formSelectors";
import { EyeOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const DataDisplay = () => {
  const [open, setOpen] = useState(false);
  const { formData, sections, fields } = useSelector((state) => state.form);
  const fieldLabelLookup = useSelector(createFieldLabelLookup);

  // Memoize root fields calculation
  const rootFields = useMemo(() => {
    return fields.filter(
      (f) => !sections.some((s) => s.fields.some((sf) => sf.id === f.id))
    );
  }, [fields, sections]);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  // Pure function for rendering - no hooks inside
  const renderHierarchicalData = () => {
    const renderSection = (section, level = 0) => {
      const hasNestedSections = section.sections?.length > 0;
      const hasFields = section.fields?.length > 0;

      return (
        <Panel
          header={<span style={{ fontWeight: 500 }}>{section.title}</span>}
          key={section.id}
          extra={
            <span className="text-xs text-gray-500">
              {section.fields.length > 0
              ? `${section.fields.length} field(s)`
              : section.sections.length > 0 &&
                `${section.sections.length} sub-section(s)`}
            </span>
          }
        >
          <div style={{ paddingLeft: level * 24 }}>
            {hasFields && (
              <Descriptions bordered column={1} size="small">
                {section.fields.map((field) => (
                  <Descriptions.Item
                    key={field.id}
                    label={fieldLabelLookup[field.id] || field.id}
                  >
                    {formData[field.id] !== undefined
                      ? String(formData[field.id])
                      : "Not provided"}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            )}

            {hasNestedSections && (
              <Collapse accordion ghost>
                {section.sections.map((subSection) =>
                  renderSection(subSection, level + 1)
                )}
              </Collapse>
            )}
          </div>
        </Panel>
      );
    };

    return (
      <>
        {rootFields.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-medium mb-3">Root Fields</h4>
            <Descriptions bordered column={1} size="small">
              {rootFields.map((field) => (
                <Descriptions.Item
                  key={field.id}
                  label={fieldLabelLookup[field.id] || field.id}
                >
                  {formData[field.id] !== undefined
                    ? String(formData[field.id])
                    : "Not provided"}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        )}

        <Collapse accordion defaultActiveKey={sections.map((s) => s.id)}>
          {sections.map((section) => renderSection(section))}
        </Collapse>
      </>
    );
  };

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <Space style={{ marginTop: 24 }} direction="vertical">
        <Alert message="No data submitted yet" type="info" showIcon style={{width: 200, marginBottom: 20}}/>
        <Button type="primary" disabled>
          View Data
        </Button>
      </Space>
    );
  }

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer} icon={<EyeOutlined />}>
          View Data
        </Button>
      </Space>

      <Drawer
        title="Form Data Hierarchy"
        width={800}
        placement="right"
        onClose={onClose}
        open={open}
        styles={{
          body: { padding: 24 },
        }}
      >
        {renderHierarchicalData()}
      </Drawer>
    </>
  );
};

export default DataDisplay;

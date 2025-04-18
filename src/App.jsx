import { Layout, Row, Col, Space, Divider } from "antd";
import { Provider } from "react-redux";
import { store } from "./app/store";
import FieldSelector from "./components/FormBulder/FieldSelector";
import FormPreview from "./components/FormBulder/FormPreview";
import DataDisplay from "./components/DataDisplay";
import SectionCreator from "./components/FormBulder/SectionCreator";
import ConditionalLogicEditor from "./components/FormBulder/ConditionalLogicEditor";

const { Header, Content } = Layout;

function App() {
  return (
    <Provider store={store}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <h1 style={{ color: "white", margin: 0 }}>Dynamic Form Builder</h1>
        </Header>
        <Content style={{ padding: "24px" }}>
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div
                style={{
                  background: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                }}
              >
                <h2>Form Configuration</h2>
                <FieldSelector />
                <Divider />
                <Space>
                  <SectionCreator />
                  <ConditionalLogicEditor />
                </Space>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div
                style={{
                  background: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                  height: "100%",
                }}
              >
                <h2>Form Preview</h2>
                <FormPreview />
              </div>
            </Col>
            <Col span={24} style={{ marginTop: 24 }}>
              <div
                style={{
                  background: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                }}
              >
                <h2>Form Data</h2>
                <DataDisplay />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Provider>
  );
}

export default App;

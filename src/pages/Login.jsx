import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text } = Typography;

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const success = await login(values);
    if (success) {
      form.resetFields();
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
      <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Title level={2} style={{ textAlign: "center" }}>Login</Title>
        <Divider />
        
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: "100%" }}
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: "center" }}>
          <Text>Don't have an account? </Text>
          <Link to="/register">Register now!</Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;

import React from "react";
import { Typography, Card, Divider, Row, Col, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

function About() {
  return (
    <div>
      <Title level={2}>About Our Blog</Title>
      <Divider />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card>
            <Title level={3}>Welcome to Our Blog Platform</Title>
            <Paragraph>
              Our blog is a RESTful API-powered platform built with Express.js, MongoDB, and React. It provides a feature-rich environment for creating and sharing content, discussions, and ideas.
            </Paragraph>
            
            <Title level={4}>Our Features</Title>
            <Paragraph>
              <ul>
                <li><Text strong>User Authentication</Text> - Secure login and registration with JWT</li>
                <li><Text strong>Post Management</Text> - Create, edit, and delete blog posts</li>
                <li><Text strong>Comments System</Text> - Interactive discussions with nested comments</li>
                <li><Text strong>Likes/Reactions</Text> - Show appreciation for posts and comments</li>
                <li><Text strong>User Profiles</Text> - Personalized user spaces</li>
                <li><Text strong>Search & Filtering</Text> - Find content that matters to you</li>
                <li><Text strong>Responsive Design</Text> - Looks great on any device</li>
              </ul>
            </Paragraph>
            
            <Divider />
            
            <Title level={4}>Our Technology Stack</Title>
            <Paragraph>
              <Space direction="vertical">
                <Text strong>Frontend:</Text>
                <ul>
                  <li>React.js</li>
                  <li>Ant Design</li>
                  <li>React Router</li>
                  <li>Context API for state management</li>
                </ul>
                
                <Text strong>Backend:</Text>
                <ul>
                  <li>Express.js</li>
                  <li>MongoDB with Mongoose</li>
                  <li>JSON Web Tokens (JWT) for authentication</li>
                  <li>RESTful API architecture</li>
                </ul>
              </Space>
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <Title level={3}>Contact Us</Title>
            <Paragraph>
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </Paragraph>
            <Paragraph>
              <Space direction="vertical">
                <Text strong>Email:</Text>
                <Text>contact@blogplatform.com</Text>
                
                <Text strong>Social Media:</Text>
                <Text>Twitter: @blogplatform</Text>
                <Text>Facebook: /blogplatform</Text>
                <Text>Instagram: @blogplatform</Text>
              </Space>
            </Paragraph>
          </Card>
          
          <Card style={{ marginTop: 24 }}>
            <Title level={3}>Join Our Community</Title>
            <Paragraph>
              Become part of our growing community of writers, readers, and creators. Share your knowledge, engage in discussions, and discover new perspectives.
            </Paragraph>
            <Paragraph>
              <Text strong>Get started by creating an account today!</Text>
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default About;

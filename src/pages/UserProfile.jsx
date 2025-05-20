import React, { useState, useEffect } from "react";
import { Card, Avatar, Typography, Form, Input, Button, Tabs, List, Divider, Space, Tag } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI, postsAPI } from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      // Set initial form values
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      });

      // Fetch user's posts
      fetchUserPosts();
    }
  }, [user, form]);

  const fetchUserPosts = async () => {
    if (!user) return;
    
    setLoadingPosts(true);
    try {
      const response = await postsAPI.getAll({ author: user._id });
      setUserPosts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch your posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoadingProfile(true);
    try {
      await usersAPI.update(user._id, values);
      
      // If there's a password field and it's not empty, we don't include it in the success message
      const updatedFields = Object.keys(values).filter(
        (key) => key !== "password" || (key === "password" && values[key])
      );
      
      toast.success(`Updated: ${updatedFields.join(", ")}`);
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  if (authLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card
        style={{ 
          marginBottom: 24,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: "#1890ff" }}
          />
          <div style={{ marginLeft: 24 }}>
            <Title level={3} style={{ margin: 0 }}>
              {user.username}
            </Title>
            <Text type="secondary">
              {user.role} account
            </Text>
          </div>
          {!editMode && (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setEditMode(true)}
              style={{ marginLeft: "auto" }}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {editMode ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="password"
              label="New Password (leave blank to keep current)"
              rules={[
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            
            <Space>
              <Button type="primary" htmlType="submit" loading={loadingProfile}>
                Save Changes
              </Button>
              <Button onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Space>
          </Form>
        ) : (
          <div>
            <Divider orientation="left">Account Information</Divider>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Card>

      <Tabs defaultActiveKey="posts">
        <TabPane tab="My Posts" key="posts">
          <List
            loading={loadingPosts}
            itemLayout="vertical"
            dataSource={userPosts}
            renderItem={(post) => (
              <List.Item
                key={post._id}
                actions={[
                  <Link to={`/edit-post/${post._id}`} key="edit">Edit</Link>,
                  <Text key="comments">{post.commentCount || 0} comments</Text>,
                  <Text key="likes">{post.likes?.length || 0} likes</Text>
                ]}
                extra={
                  <div>
                    {post.status === 'published' ? (
                      <Tag color="green">Published</Tag>
                    ) : (
                      <Tag color="orange">Draft</Tag>
                    )}
                  </div>
                }
              >
                <List.Item.Meta
                  title={<Link to={`/posts/${post._id}`}>{post.title}</Link>}
                  description={`Created on ${new Date(post.createdAt).toLocaleDateString()}`}
                />
                <div>{post.content.substring(0, 200)}...</div>
              </List.Item>
            )}
            pagination={{
              pageSize: 5,
            }}
            locale={{ emptyText: "You haven't created any posts yet" }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default UserProfile;

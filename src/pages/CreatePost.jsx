import React, { useState } from "react";
import { Form, Input, Button, Select, Card, Typography, Divider, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");

  const handleSubmit = async (values) => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      navigate("/login");
      return;
    }

    setLoading(true);
    
    // Add tags to the values
    values.tags = tags;
    
    try {
      const response = await postsAPI.create(values);
      toast.success("Post created successfully!");
      navigate(`/posts/${response.data.data._id}`);
    } catch (error) {
      toast.error("Failed to create post: " + (error.response?.data?.message || error.message));
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (!inputTag.trim()) return;
    
    const newTag = inputTag.trim().toLowerCase();
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputTag("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div>
      <Title level={2}>Create New Post</Title>
      <Divider />
      
      <Card style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "published" }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter post title" size="large" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <TextArea 
              placeholder="Write your post content here..." 
              rows={12} 
              style={{ resize: "none" }}
            />
          </Form.Item>
          
          <Form.Item label="Tags">
            <Space style={{ display: "flex", marginBottom: 8 }}>
              <Input
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onPressEnter={addTag}
                placeholder="Add a tag and press Enter"
              />
              <Button type="primary" onClick={addTag}>Add</Button>
            </Space>
            
            <div className="tag-list">
              {tags.map(tag => (
                <Space key={tag} style={{ display: "inline-flex", margin: "0 8px 8px 0" }}>
                  <span className="tag">{tag}</span>
                  <Button 
                    type="text" 
                    danger 
                    onClick={() => removeTag(tag)}
                    size="small"
                  >
                    ✕
                  </Button>
                </Space>
              ))}
            </div>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
          >
            <Select defaultValue="published">
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Post
              </Button>
              <Button onClick={() => navigate("/posts")}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default CreatePost;

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Card, Typography, Divider, Space, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { postsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchingPost(true);
        const response = await postsAPI.getById(id);
        const post = response.data.data;
        
        // Check if user is authorized to edit this post
        if (!user || (user._id !== post.author?._id && user.role !== "admin")) {
          toast.error("You don't have permission to edit this post");
          navigate(`/posts/${id}`);
          return;
        }
        
        // Set form values
        form.setFieldsValue({
          title: post.title,
          content: post.content,
          status: post.status || "published",
        });
        
        // Set tags
        if (post.tags && Array.isArray(post.tags)) {
          setTags(post.tags);
        }
        
      } catch (error) {
        toast.error("Failed to load post");
        navigate("/posts");
      } finally {
        setFetchingPost(false);
      }
    };
    
    fetchPost();
  }, [id, user, navigate, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    // Add tags to the values
    values.tags = tags;
    
    try {
      await postsAPI.update(id, values);
      toast.success("Post updated successfully!");
      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error("Failed to update post: " + (error.response?.data?.message || error.message));
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

  if (fetchingPost) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading post..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Edit Post</Title>
      <Divider />
      
      <Card style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
            <Select>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Post
              </Button>
              <Button onClick={() => navigate(`/posts/${id}`)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default EditPost;

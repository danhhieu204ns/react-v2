import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, Card, Space, Tag, Button, Typography, Input, Select, Spin, Pagination } from "antd";
import { 
  EyeOutlined, 
  LikeOutlined, 
  MessageOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { postsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "./PostLists.css";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

function PostLists() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tag: "",
    status: "published"
  });
  const [sort, setSort] = useState("-createdAt");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0
  });

  useEffect(() => {
    fetchPosts();
  }, [pagination.current, searchQuery, filters, sort]);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        sort: sort,
      };
      
      if (searchQuery) {
        queryParams.search = searchQuery;
      }
      
      if (filters.tag) {
        queryParams.tag = filters.tag;
      }
      
      if (filters.status) {
        queryParams.status = filters.status;
      }
      
      const response = await postsAPI.getAll(queryParams);
      const { data, totalRecords } = response.data;
      
      setPosts(data);
      setPagination(prev => ({
        ...prev,
        total: totalRecords
      }));
    } catch (error) {
      // Thêm điều kiện để tránh hiển thị thông báo lỗi nhiều lần
      if (!error.handled) {
        error.handled = true;
        toast.error("Failed to fetch posts");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleDeletePost = async (id) => {
    try {
      await postsAPI.delete(id);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={4}>All Posts</Title>
        {user && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate("/create-post")}
          >
            New Post
          </Button>
        )}
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <Space wrap>
          <Search
            placeholder="Search posts..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          
          <Select 
            placeholder="Filter by Status"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange("status", value)}
            value={filters.status}
          >
            <Option value="published">Published</Option>
            <Option value="draft">Draft</Option>
            {user && user.role === "admin" && <Option value="all">All</Option>}
          </Select>
          
          <Select
            placeholder="Sort By"
            style={{ width: 150 }}
            onChange={handleSortChange}
            value={sort}
          >
            <Option value="-createdAt">Newest First</Option>
            <Option value="createdAt">Oldest First</Option>
            <Option value="-likesCount">Most Liked</Option>
            <Option value="-commentCount">Most Commented</Option>
          </Select>
        </Space>
      </div>
      
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={posts}
        locale={{ emptyText: "No posts found" }}
        renderItem={(post) => (
          <List.Item>
            <Card
              hoverable
              className="post-card"
              actions={[
                <Link to={`/posts/${post._id}`}><EyeOutlined key="view" /> View</Link>,
                <span><LikeOutlined key="like" /> {post.likes?.length || 0}</span>,
                <span><MessageOutlined key="message" /> {post.commentCount || 0}</span>,
              ]}
              extra={
                user && (user._id === post.author?._id || user.role === "admin") && (
                  <Space>
                    <Button 
                      icon={<EditOutlined />} 
                      size="small"
                      onClick={() => navigate(`/edit-post/${post._id}`)}
                    />
                    <Button 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="small"
                      onClick={() => handleDeletePost(post._id)}
                    />
                  </Space>
                )
              }
            >
              <Card.Meta
                title={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    {post.status === "draft" && <Tag color="orange">Draft</Tag>}
                  </div>
                }
                description={
                  <div>
                    <div className="post-info">
                      <Text type="secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Text>
                      <Text type="secondary">
                        By: {post.author?.username || "Unknown"}
                      </Text>
                    </div>
                    <Paragraph ellipsis={{ rows: 3 }} className="post-excerpt">
                      {post.content}
                    </Paragraph>
                    <div className="post-tags">
                      {post.tags && post.tags.map(tag => (
                        <Tag 
                          color="blue" 
                          key={tag}
                          onClick={() => handleFilterChange("tag", tag)}
                          style={{ cursor: "pointer" }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
      
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default PostLists;
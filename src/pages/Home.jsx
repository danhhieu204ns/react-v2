import React, { useState, useEffect } from "react";
import { Typography, Card, Divider, List, Tag, Space, Spin, Input, Pagination } from "antd";
import { EyeOutlined, LikeOutlined, MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { postsAPI } from "../services/api";
import { toast } from "react-toastify";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [pagination.current, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        status: "published",
        sort: "-createdAt",
      };
      
      if (searchQuery) {
        queryParams.search = searchQuery;
      }
      
      const response = await postsAPI.getAll(queryParams);
      const { data, totalRecords } = response.data;
      
      setPosts(data);
      setPagination(prev => ({
        ...prev,
        total: totalRecords
      }));
      
      // Set the first post as featured post if it exists
      if (data.length > 0 && pagination.current === 1 && !searchQuery) {
        setFeaturedPost(data[0]);
        setPosts(data.slice(1));
      }
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
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
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
      <Title level={2}>Welcome to Our Blog</Title>
      <Paragraph>
        Discover the latest articles, news, and insights from our community
      </Paragraph>

      <Search
        placeholder="Search posts..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        style={{ marginBottom: 24 }}
      />

      {!searchQuery && featuredPost && (
        <>
          <Divider orientation="left">Featured Post</Divider>
          <Card 
            hoverable 
            style={{ marginBottom: 24 }}
            cover={
              <div style={{ 
                height: 200, 
                background: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold'
              }}>
                {featuredPost.title}
              </div>
            }
          >
            <Card.Meta
              title={<Link to={`/posts/${featuredPost._id}`}>{featuredPost.title}</Link>}
              description={
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text type="secondary">{new Date(featuredPost.createdAt).toLocaleDateString()}</Text>
                  <Text type="secondary">By: {featuredPost.author?.username || "Unknown"}</Text>
                  <Paragraph ellipsis={{ rows: 3 }}>
                    {featuredPost.content}
                  </Paragraph>
                  <Space>
                    <Text><LikeOutlined /> {featuredPost.likes?.length || 0}</Text>
                    <Text><MessageOutlined /> {featuredPost.commentCount || 0}</Text>
                  </Space>
                </Space>
              }
            />
          </Card>
          <Divider orientation="left">Recent Posts</Divider>
        </>
      )}

      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Card 
              hoverable 
              style={{ marginBottom: 16, height: 320 }}
              actions={[
                <span><EyeOutlined key="view" /> <Link to={`/posts/${post._id}`}>Read More</Link></span>,
                <span><LikeOutlined key="like" /> {post.likes?.length || 0}</span>,
                <span><MessageOutlined key="comment" /> {post.commentCount || 0}</span>
              ]}
            >
              <Card.Meta
                title={
                  <div style={{ height: 48, overflow: 'hidden' }}>
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  </div>
                }
                description={
                  <div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">{new Date(post.createdAt).toLocaleDateString()}</Text>
                        <Text type="secondary">By: {post.author?.username || "Unknown"}</Text>
                      </div>
                      <Paragraph ellipsis={{ rows: 4 }} style={{ height: 100 }}>
                        {post.content}
                      </Paragraph>
                      {post.tags && post.tags.length > 0 && (
                        <div>
                          {post.tags.map(tag => (
                            <Tag color="blue" key={tag}>
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </Space>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
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

export default Home;

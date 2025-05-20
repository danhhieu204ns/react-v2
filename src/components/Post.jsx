import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Typography, 
  Divider, 
  Tag, 
  Space, 
  Button, 
  Skeleton, 
  Avatar,
  Card,
  List,
  Form,
  Input,
  Popconfirm,
  message,
  Tooltip
} from "antd";
import { 
  UserOutlined, 
  CalendarOutlined, 
  LikeOutlined, 
  LikeFilled,
  EditOutlined, 
  DeleteOutlined,
  CommentOutlined
} from "@ant-design/icons";
import { postsAPI, commentsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Comment from "./Comment";
import "./Post.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // Check if post is liked by current user
  useEffect(() => {
    if (post && user) {
      const isLiked = post.likes?.includes(user._id);
      setLiked(isLiked);
    }
  }, [post, user]);  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getById(id);
      if (response.data && response.data.post) {
        // Server returns post in response.data.post
        setPost(response.data.post);
        console.log("Post loaded from response.data.post:", response.data.post);
        
        // If the post already contains comments, set them directly
        if (response.data.post.comments && response.data.post.comments.length > 0) {
          console.log("Comments loaded from post:", response.data.post.comments);
          setComments(response.data.post.comments);
          setLoadingComments(false);
        } else {
          // Still try to fetch comments separately if not included
          fetchComments();
        }
      } else if (response.data && response.data.data) {
        setPost(response.data.data);
        console.log("Post loaded from response.data.data:", response.data.data);
      } else if (response.data) {
        setPost(response.data);
        console.log("Post loaded from response.data:", response.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Failed to load post");
      navigate("/posts");
    } finally {
      setLoading(false);
    }
  };  const fetchComments = async () => {
    // If we already have comments from the post, no need to fetch
    if (post && post.comments && post.comments.length > 0 && !loadingComments) {
      console.log("Using comments from post:", post.comments);
      setComments(post.comments);
      setLoadingComments(false);
      return;
    }
    
    setLoadingComments(true);
    try {
      const response = await commentsAPI.getByPost(id);
      console.log("Comments API response:", response);
      
      if (response.data && response.data.data) {
        setComments(response.data.data);
        console.log("Comments loaded from response.data.data:", response.data.data);
      } else if (response.data && response.data.comments) {
        setComments(response.data.comments);
        console.log("Comments loaded from response.data.comments:", response.data.comments);
      } else if (Array.isArray(response.data)) {
        setComments(response.data);
        console.log("Comments loaded from array response.data:", response.data);
      } else if (response.data) {
        // Handle any other response format
        console.log("Comments response in unknown format:", response.data);
        if (typeof response.data === 'object') {
          const possibleComments = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleComments) {
            setComments(possibleComments);
            console.log("Extracted possible comments array:", possibleComments);
          }
        }
      } else {
        throw new Error("Invalid comment data format");
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      // Don't show error toast if we've already loaded comments from the post
      if (!(post && post.comments && post.comments.length > 0)) {
        toast.error("Failed to load comments");
      }
    } finally {
      setLoadingComments(false);
    }
  };
  const handleLikePost = async () => {
    if (!user) {
      toast.info("Please login to like posts");
      return;
    }

    try {
      if (liked) {
        // Backend might not have an unlike endpoint as specified in the prompt
        // So we may need to toggle like with the same endpoint
        await postsAPI.like(id);
        setPost(prev => ({
          ...prev,
          likes: prev.likes.filter(likeId => likeId !== user._id),
          likesCount: prev.likesCount - 1
        }));
        setLiked(false);
      } else {
        await postsAPI.like(id);
        setPost(prev => ({
          ...prev,
          likes: [...prev.likes, user._id],
          likesCount: prev.likesCount + 1
        }));
        setLiked(true);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleDeletePost = async () => {
    try {
      await postsAPI.delete(id);
      toast.success("Post deleted successfully");
      navigate("/posts");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      toast.info("Comment cannot be empty");
      return;
    }

    if (!user) {
      toast.info("Please login to comment");
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await commentsAPI.create(id, { content: commentContent });
      console.log("Comment created response:", response);
      setCommentContent("");
      toast.success("Comment added successfully");
      
      // Update the post to get new comments
      await fetchPost();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="post-skeleton">
        <Skeleton active avatar paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
        <Divider />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-not-found">
        <Title level={3}>Post not found</Title>
        <Paragraph>The post you're looking for doesn't exist or has been removed.</Paragraph>
        <Button type="primary">
          <Link to="/posts">Back to Posts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <div className="post-header">
        <Title level={2}>{post.title}</Title>
        
        <Space className="post-meta">
          <span>
            <CalendarOutlined /> {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span>
            <UserOutlined /> {post.author?.username || "Unknown"}
          </span>
          {post.tags && post.tags.map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </Space>
        
        {user && (user._id === post.author?._id || user.role === "admin") && (
          <div className="post-actions">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => navigate(`/edit-post/${post._id}`)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete this post?"
              description="This action cannot be undone."
              onConfirm={handleDeletePost}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
      
      <Divider />
      
      <div className="post-content">
        <Paragraph>{post.content}</Paragraph>
      </div>
      
      <div className="post-footer">
        <Button 
          type={liked ? "primary" : "default"}
          icon={liked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLikePost}
        >
          {post.likes?.length || 0} Likes
        </Button>
      </div>
      
      <Divider orientation="left">Comments ({comments.length})</Divider>
      
      {user ? (
        <div className="comment-form">
          <Form layout="vertical">
            <Form.Item>
              <TextArea 
                rows={4} 
                placeholder="Write your comment here..." 
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                onClick={handleCommentSubmit}
                loading={submittingComment}
                icon={<CommentOutlined />}
              >
                Add Comment
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="login-to-comment">
          <Link to="/login">Login to comment</Link>
        </div>
      )}
      
      <List
        loading={loadingComments}
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
        itemLayout="horizontal"
        renderItem={(comment) => (
          <li>
            <Comment comment={comment} postId={id} onUpdate={fetchComments} />
          </li>
        )}
      />
    </div>
  );
}

export default Post;
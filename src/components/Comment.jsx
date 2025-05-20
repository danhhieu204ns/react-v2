import React, { useState } from "react";
import { Avatar, Tooltip, Typography, Button, Input, Form, Space, Popconfirm, List, Card } from "antd";
import { UserOutlined, LikeOutlined, LikeFilled, EditOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { commentsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "./Comment.css";

const { TextArea } = Input;
const { Text } = Typography;

function Comment({ comment, postId, onUpdate }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(comment?.likes?.includes(user?._id));
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [content, setContent] = useState(comment?.content || "");
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like comments");
      return;
    }

    try {
      // Using the patch method for like according to provided routes
      await commentsAPI.like(comment._id);
      setLiked(!liked); // Toggle the like state
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to update like status");
    }
  };
  const handleEdit = async () => {
    if (!content.trim()) {
      toast.info("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      await commentsAPI.update(comment._id, { content });
      setEditing(false);
      if (onUpdate) onUpdate();
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await commentsAPI.delete(comment._id);
      if (onUpdate) onUpdate();
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };
  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.info("Reply cannot be empty");
      return;
    }

    if (!user) {
      toast.info("Please login to reply to comments");
      return;
    }

    setSubmitting(true);
    try {
      // Using the updated API endpoint for replies
      await commentsAPI.reply(comment._id, { content: replyContent });
      setReplying(false);
      setReplyContent("");
      if (onUpdate) onUpdate();
      toast.success("Reply added successfully");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setSubmitting(false);
    }
  };

  const actions = [
    <Tooltip key="like" title={liked ? "Unlike" : "Like"}>
      <span onClick={handleLike}>
        {liked ? <LikeFilled /> : <LikeOutlined />}
        <span style={{ paddingLeft: 8 }}>
          {comment.likes?.length || 0}
        </span>
      </span>
    </Tooltip>,
    <span key="reply" onClick={() => setReplying(!replying)}>Reply</span>
  ];

  if (user && (user._id === comment.author?._id || user.role === "admin")) {
    actions.push(
      <span key="edit" onClick={() => setEditing(!editing)}>Edit</span>,
      <Popconfirm
        key="delete"
        title="Delete this comment?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <span>Delete</span>
      </Popconfirm>
    );
  }

  if (comment.replies && comment.replies.length > 0) {
    actions.push(
      <span key="expand" onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? "Hide Replies" : `View ${comment.replies.length} Replies`}
      </span>
    );
  }
  return (
    <List.Item
      className="comment-item"
      actions={actions}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Text strong>{comment.author?.username || "Anonymous"}</Text>
              <Tooltip title={new Date(comment.createdAt).toLocaleString()}>
                <Text type="secondary">{new Date(comment.createdAt).toLocaleDateString()}</Text>
              </Tooltip>
            </Space>
          </div>
        }
        description={
          editing ? (
            <div>
              <Form.Item>
                <TextArea 
                  rows={3} 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={handleEdit}
                    loading={submitting}
                  >
                    Save
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditing(false);
                      setContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </div>
          ) : (
            <p>{comment.content}</p>
          )
        }
      />

      {replying && (
        <div style={{ marginLeft: 40, marginTop: 16, marginBottom: 24 }}>
          <Form.Item>
            <TextArea 
              rows={2} 
              placeholder="Write your reply..." 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleReply}
                loading={submitting}
              >
                Reply
              </Button>
              <Button onClick={() => {
                setReplying(false);
                setReplyContent("");
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </div>
      )}

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies" style={{ marginLeft: 40, marginTop: 16 }}>
          <List
            itemLayout="horizontal"
            dataSource={comment.replies}
            renderItem={reply => (
              <Comment
                key={reply._id}
                comment={reply}
                postId={postId}
                onUpdate={onUpdate}
              />
            )}
          />
        </div>
      )}
    </List.Item>
  );
}

export default Comment;
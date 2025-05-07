import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Post.css";

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() =>{
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/blogs/${slug}`
        );
        setPost(response.data);
        setError(false);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();  
  }, [slug]);

  if (loading) {
    return <div className="post-loading">Đang tải bài viết...</div>;
  }

  if (error || !post) {
    return <div className="post-error">Bài viết bạn yêu cầu không tồn tại hoặc đã xảy ra lỗi.</div>;
  }
  
  const { title, content } = post;
  return (
    <div className="post-container">
      <h1 className="post-title">{title}</h1>
      <div className="post-content">{content}</div>
    </div>
  );
}

export default Post;

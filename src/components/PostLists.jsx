import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PostLists.css";

function PostLists() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [inputNum, setInputNum] = useState('');
  const [num, setNum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSlug, setNewPostSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleNumChange = (e) => {
    setInputNum(e.target.value);
  };

  const handleNumSubmit = () => {
    if (!inputNum || inputNum.trim() === '') {
      setNum(0);
    } else {
      const parsedNum = parseInt(inputNum, 10);
      if (!isNaN(parsedNum) && parsedNum >= 0) {
        setNum(parsedNum);
      } else {
        setNum(0);
      }
    }
  };

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const url = num > 0 ? `http://localhost:8080/api/blogs?limit=${num}` : `http://localhost:8080/api/blogs`;
      const response = await axios.get(url);
      // Check if response.data is an array directly or if posts are nested in a property
      if (Array.isArray(response.data)) {
        setBlogPosts(response.data);
      } else if (response.data && Array.isArray(response.data.posts)) {
        // If the API returns {posts: [...]} structure
        setBlogPosts(response.data.posts);
      } else if (response.data && Array.isArray(response.data.data)) {
        // If the API returns {data: [...]} structure
        setBlogPosts(response.data.data);
      } else {
        // If we can't find an array, set to empty array as fallback
        console.error("Unexpected API response format:", response.data);
        setBlogPosts([]);
      }
      setError(false);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogPosts([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [num]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleAddPostSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess('');
    setIsSubmitting(true);

    // Get token
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      setSubmitError("Bạn cần đăng nhập để thêm bài đăng mới.");
      setIsSubmitting(false);
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setSubmitError("Tiêu đề và nội dung không được để trống.");
      setIsSubmitting(false);
      return;
    }

    const postData = {
      title: newPostTitle,
      content: newPostContent,
      slug: newPostSlug.trim() || undefined,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/blogs', postData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setSubmitSuccess(`Bài đăng "${response.data.title}" đã được thêm thành công!`);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostSlug('');
      fetchBlogs();
    } catch (err) {
      console.error("Failed to add post:", err);
      if (err.response?.status === 401) {
        setSubmitError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setSubmitError(err.response?.data?.error || "Thêm bài đăng thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-list-container">
      <div className="card mb-3">
        <div className="card-header">
          <h2>Thêm bài đăng mới</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddPostSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="post-title">Tiêu đề:</label>
              <input
                className="form-control"
                id="post-title"
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="post-slug">Slug (tùy chọn):</label>
              <input
                className="form-control"
                id="post-slug"
                type="text"
                value={newPostSlug}
                onChange={(e) => setNewPostSlug(e.target.value)}
                placeholder="vi-du-slug-bai-dang"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="post-content">Nội dung:</label>
              <textarea
                className="form-control"
                id="post-content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
                rows="5"
              />
            </div>
            
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang thêm...' : 'Thêm bài đăng'}
            </button>
            
            {submitError && <p className="post-list-error mt-3">{submitError}</p>}
            {submitSuccess && <p className="mt-3" style={{ color: 'green' }}>{submitSuccess}</p>}
          </form>
        </div>
      </div>

      {/* Phần lọc bài đăng */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="form-group">
            <label className="form-label" htmlFor="post-number">Giới hạn số lượng bài đăng:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                className="form-control"
                id="post-number"
                type="number"
                value={inputNum}
                onChange={handleNumChange}
                placeholder="Để trống hoặc 0 để lấy tất cả"
                min="0"
              />
              <button className="btn btn-primary" onClick={handleNumSubmit}>Áp dụng</button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách bài đăng */}
      <h2 className="post-list-title">Danh sách bài đăng</h2>
      
      {loading && (
        <div className="post-list-loading">Đang tải bài viết...</div>
      )}
      
      {error && (
        <div className="post-list-error">Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.</div>
      )}
      
      {!loading && !error && blogPosts.length === 0 && (
        <div className="text-center">Không có bài viết nào để hiển thị.</div>
      )}
      
      {!loading && !error && blogPosts.length > 0 && (
        <div className="post-list">
          {blogPosts.map((post) => {
            // Safely destructure blog post data with fallbacks
            const { id = 'unknown', slug = 'post', title = 'Untitled Post', content = '' } = post || {};
            return (
              <div key={id} className="post-item">
                <div className="post-item-image">
                  {/* Hình ảnh bài viết (có thể thay thế bằng hình ảnh thực tế) */}
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#3b82f6', fontSize: '3rem' }}>📝</span>
                  </div>
                </div>
                <div className="post-item-content">
                  <h3 className="post-item-title">{title}</h3>
                  <p className="post-item-excerpt">
                    {content && content.length > 150 ? content.substring(0, 150) + '...' : content}
                  </p>
                  <div className="post-item-meta">
                    <span>ID: {id}</span>
                    <Link to={`/posts/${slug}`} className="post-item-button">Xem chi tiết</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PostLists;
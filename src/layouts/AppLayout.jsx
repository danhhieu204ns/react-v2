import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Spin } from "antd";
import { 
  HomeOutlined, 
  FileTextOutlined, 
  InfoCircleOutlined, 
  UserOutlined, 
  LoginOutlined, 
  LogoutOutlined,
  PieChartOutlined,
  PlusOutlined,
  BookOutlined
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import PostLists from "../components/PostLists";
import Post from "../components/Post";
import Posts from "../pages/Posts";
import Books from "../pages/Books";
import BookLists from "../components/BookLists";
import Book from "../components/Book";
import Home from "../pages/Home";
import About from "../pages/About";
import NoMatch from "../pages/NoMatch";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserProfile from "../pages/UserProfile";
import CreatePost from "../pages/CreatePost";
import EditPost from "../pages/EditPost";
import Stats from "../pages/Stats";

const { Header, Content, Footer } = Layout;

function AppLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%", padding: "0 16px" }}>
        <div style={{ float: "left", width: 120, height: 31, color: "white", fontSize: "18px", fontWeight: "bold" }}>
          Blog App
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']} style={{ lineHeight: '64px' }}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="posts" icon={<FileTextOutlined />}>
            <Link to="/posts">Posts</Link>
          </Menu.Item>
          <Menu.Item key="books" icon={<BookOutlined />}>
            <Link to="/books">Books</Link>
          </Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>
            <Link to="/about">About</Link>
          </Menu.Item>
          
          {user && (
            <Menu.Item key="create-post" icon={<PlusOutlined />}>
              <Link to="/create-post">New Post</Link>
            </Menu.Item>
          )}

          {user && (
            <Menu.Item key="stats" icon={<PieChartOutlined />}>
              <Link to="/stats">Stats</Link>
            </Menu.Item>
          )}

          {user ? (
            <>
              <Menu.Item key="profile" icon={<UserOutlined />} style={{ marginLeft: 'auto' }}>
                <Link to="/profile">{user.username}</Link>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Logout
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="login" icon={<LoginOutlined />} style={{ marginLeft: 'auto' }}>
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="register" icon={<UserOutlined />}>
                <Link to="/register">Register</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      
      <Content style={{ padding: '88px 50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: '100%', borderRadius: '4px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />}>
              <Route index element={<PostLists />} />
              <Route path=":id" element={<Post />} />
            </Route>
            <Route path="/books" element={<Books />}>
              <Route index element={<BookLists />} />
              <Route path=":id" element={<Book />} />
            </Route>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Blog Application ©{new Date().getFullYear()} Created with React & Ant Design
      </Footer>
    </Layout>
  );
}

export default AppLayout;

import { Outlet } from "react-router-dom";
import { Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

function Posts() {
  return (
    <div>
      <Title level={2}>Blog Posts</Title>
      <Paragraph>
        Explore our collection of articles, tutorials, and insights
      </Paragraph>
      <Divider />
      <Outlet />
    </div>
  );
}

export default Posts;

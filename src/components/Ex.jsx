import { useEffect, useState } from "react";

function Ex() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotalPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/blogs/count");
        const data = await response.json();
        // console.log(data);
        setTotal(data.count);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTotalPosts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>This is a child component from Starts</h3>
      <p>Total posts: {total}</p>
    </div>
  );
}

export default Ex;

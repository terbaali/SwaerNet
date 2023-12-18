import React, { useEffect, useState } from 'react';

const Content = ({ token }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/posts', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, [token]);

  return (
    <div>
      <h2>SwearNet</h2>
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <p>ID: {post.id}</p>
            <p>Message: {post.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
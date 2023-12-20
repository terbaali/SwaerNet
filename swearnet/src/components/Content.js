import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Content = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleLogoff = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem('token');

        if (!token) {
          console.error('Token not found.');
          alert('Error on log in')
          handleLogoff()
          return;
        }

        const response = await fetch('http://localhost:3000/posts', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>SwearNet</h2>
      <div>
        <button onClick={handleLogoff}>Log Off</button>
      </div>
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
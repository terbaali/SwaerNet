import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import DOMPurify from 'dompurify';
import Cookies from 'universal-cookie';


const Content = (props) => {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postPopUpVisibility, setPostPopUpVisibility] = useState(false);

  const navigate = useNavigate();
  const { logedin } = useContext(AuthContext);

  useEffect(() => {
    const cookies = new Cookies();
    const banInfoCookie = cookies.get('banInfo');
    if (banInfoCookie) {
      try {
        if (banInfoCookie.banned && Date.now() < new Date(banInfoCookie.expires).getTime()) {
          props.onBanned(banInfoCookie.banned);
        }
      } 
      catch (error) {
        console.error('Error parsing banInfo cookie:', error.message);
      }
    }
    
    const fetchPosts = async () => {
      try {
        /*
        const token = sessionStorage.getItem('token');

        if (!token) {
          console.error('Token not found.');
          alert('Error on log in')
          handleLogoff()
          return;
        }
        */
      
        const response = await fetch('http://localhost:3000/posts', {
          method: 'GET',
          headers: {
            //Authorization: token,
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
    
    const checkAdminStatus = async () => {
      try {
        if (logedin.isAdmin === 1) setIsAdmin(true);
        /*
        const token = sessionStorage.getItem('token');

        if (!token) {
          console.error('Token not found.');
          return;
        }

        const adminResponse = await fetch('http://localhost:3000/users/isAdmin', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (adminResponse.ok) {
          const isAdmin = await adminResponse.json();
          setIsAdmin(isAdmin);
        }
        */
      } 
      catch (error) {
        console.error('Error checking admin status:', error.message);
      }
    };

    if (logedin) {
      checkAdminStatus();
    }

  }, [logedin]);

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input); 
  };

  const handleLogoff = () => {
    sessionStorage.removeItem('token');
    setPostPopUpVisibility(false);
    props.setLogedin(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = sessionStorage.getItem('token');

      if (!token) {
        console.error('Token not found.');
        alert("you don't have the right, O you don't have the right");
        handleLogoff();
        return;
      }

      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });
      
      if (response.ok) {
        alert('Post deleted successfully.');
        var newPosts = [...posts];
        const deleteIndex = newPosts.findIndex(i => i.id === postId);
        newPosts.splice(deleteIndex, 1);
        setPosts(newPosts);
      } 
      else {
        alert('Failed to delete post.');
      }
    } 
    catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  const handlePostPopUp = () => {

    return (
      <div className="swearPopUp">
        <h3>Create a Curse</h3>
        <textarea
          value={postContent}
          onChange={(e) => {
            const inputText = e.target.value.slice(0, 255);
            setPostContent(inputText);
          }}
          maxLength={255}
          placeholder="Sweare here..."
        />
        <br />
        <button onClick={handlePostCreation}>Create Curse</button>
        <button className="" onClick={ ()=> setPostPopUpVisibility(false) }> Cancel </button>
      </div>
    );
  };

  const handlePostCreation = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        alert("You must be logged in to create a post.");
        handleLogoff();
        return;
      }
      
      if (!postContent.trim()) {
        alert('Content cannot be empty.');
        return;
      }

      const isSafeInput = /^[a-zA-Z0-9\s.,!?()]+$/.test(postContent);
      if (!isSafeInput) {
        alert('Invalid input. Please enter a valid value.');
        return;
      }

      const sanitizedPost = sanitizeInput(postContent);

      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ user_id: props.logedin.userId, postMessage: postContent }),
      });

      if (response.ok) {
        alert('Curse created successfully.');
        // LISÄÄ TÄHÄN POSTAUSTEN LOKAALI PÄIVITYS
        const newPosts = [...posts, {
          post_id: posts.length+1, 
          message: postContent, 
          user_id: logedin.userId,
          username: logedin.userName
        }];
        setPosts(newPosts);
        setPostContent('');
        setPostPopUpVisibility(false);
      } 
      else {
        alert('Failed to create curse.');
      }
    } 
    catch (error) {
      console.error('Error creating curse:', error.message);
    }
  };




  return (
    <div>
      <h2>SwearNet</h2>
      <p>{logedin.userName && "Welcome " + logedin.userName}</p>
      <div>
        {logedin ? (
          <div>
            <button onClick={handleLogoff}>Log Off</button>
            <button onClick={() => setPostPopUpVisibility(true)}>Create new post</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Log In</button>
        )}
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.post_id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <div style={{ display: 'flex' }}>
              <p key={post.post_id} style={{ paddingRight: '10px' }}>ID: {post.post_id}</p>
              <p>User: {post.user_id}</p>
            </div>
            <p>Message: {post.message}</p>
            {isAdmin || post.user_id === logedin.userId ? <button onClick={() => handleDeletePost(post.post_id)}>Delete</button> : null}
            {postPopUpVisibility && handlePostPopUp()} 
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
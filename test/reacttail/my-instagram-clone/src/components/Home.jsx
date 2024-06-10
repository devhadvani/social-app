import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import axios from 'axios';
import logo from '../assets/profile.svg';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Home = () => {
  // State for managing posts and comment inputs
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const suggestedUsers = [
    { name: 'bharadavarasiklal', status: 'New to Instagram' },
    { name: 'i_am_vaibhlo_manjsa', status: 'New to Instagram' },
    { name: 'maradiyagirihbhai', status: 'Suggested for you' },
    { name: 'mali__chora_', status: 'New to Instagram' },
  ];

  // Fetch posts from the server
  const fetchPosts = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get('http://127.0.0.1:8000/home-posts/', config)
      .then(response => {
        setPosts(response.data);
        // Initialize comment input state for each post
        const initialCommentInputs = {};
        response.data.forEach(post => {
          initialCommentInputs[post.id] = { text: '', isTyping: false };
        });
        setCommentInputs(initialCommentInputs);
      })
      .catch(error => {
        console.error("There was an error fetching the posts!", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle like button click
  const handleLike = (postId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.post(`http://127.0.0.1:8000/posts/${postId}/like/`, {}, config)
      .then(response => {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const newLikesCount = post.is_liked ? post.likes_count - 1 : post.likes_count + 1;
            return { 
              ...post, 
              likes_count: newLikesCount,
              is_liked: !post.is_liked 
            };
          }
          return post;
        }));
      })
      .catch(error => {
        console.error("There was an error liking the post!", error);
      });
  };

  // Handle comment input change
  const handleCommentChange = (postId, e) => {
    const value = e.target.value;
    setCommentInputs(prevState => ({
      ...prevState,
      [postId]: {
        text: value,
        isTyping: !!value
      }
    }));
  };

  // Handle posting comment
  const handlePostComment = (postId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.post(`http://127.0.0.1:8000/posts/${postId}/comment/`, { text: commentInputs[postId].text }, config)
      .then(response => {
        // Update the UI with the new comment
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              comments: [...post.comments, response.data]
            };
          }
          return post;
        }));
        // Clear the comment input field and hide the "Post" button
        setCommentInputs(prevState => ({
          ...prevState,
          [postId]: {
            text: '',
            isTyping: false
          }
        }));
      })
      .catch(error => {
        console.error("There was an error posting the comment!", error);
      });
  };

  // Settings for the image carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll:1 
  };

  return (
    <div className="bg-black min-h-screen text-white flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="w-6/12 p-4 ml-80">
        <div className="space-y-4">
          {/* Story Section */}
          <div className="flex space-x-4 overflow-x-auto">
            {['savan', 'cyberknight', 'clarify', 'deep', 'ahir_sir', 'uday', 'jignesh'].map((user, index) => (
              <div key={index} className="w-20 h-20 rounded-full bg-gray-800"></div>
            ))}
          </div>

          {/* Post Section */}
          <div className="w-3/4 ml-20">
            {posts.map(post => (
              <div key={post.id} className="bg-black p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={post.user_profile.profile_image || logo} alt="profile" className="w-10 h-10 rounded-full bg-gray-700" />
                  <div className="flex-1">
                    <Link to={`/${post.user_profile.name}`}>
                      <span className="font-bold">{post.user_profile.profile_name}</span>
                    </Link>
                  </div>
                  <span className="text-gray-500">
                    {formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                {/* Image Carousel */}
                {post.images.length > 1 ? (
                  <div className="rounded-lg border-slate-600 border-2 mb-4">
                  <Slider {...carouselSettings}>
                    {post.images.map((image, index) => (
                      <img key={index} src={image.image} alt={`post-${index}`} className="w-full object-contain rounded-lg" style={{ maxHeight: '550px' }}/>
                    ))}
                  </Slider>
                  </div>
                ) : (
                  <div className="rounded-lg border-slate-600 border-2 mb-4">
                    <img src={post.images[0].image} alt="post" className="w-full object-contain rounded-lg" style={{ maxHeight: '550px' }}/>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button onClick={() => handleLike(post.id)}>
                      <i className={`fas fa-heart ${post.is_liked ? 'text-red-500' : ''}`}></i>
                    </button>
                    <button><i className="fas fa-comment"></i></button>
                    <button><i className="fas fa-share"></i></button>
                  </div>
                  <button><i className="fas fa-bookmark"></i></button>
                </div>

                <div className="mt-4">
                  <span className="font-bold">{post.likes_count}</span> likes
                </div>
                <div className="mt-4">
                  <span className="font-bold">{post.user_profile.profile_name}</span> {post.caption}
                </div>
                {/* View Comments Button */}
                <button>Show {post.comments_count} Comments</button>
                <div className="flex items-center">
      <input 
        type="text" 
        value={commentInputs[post.id]?.text} 
        onChange={(e) => handleCommentChange(post.id, e)} 
        placeholder="Add a comment..." 
        className="w-full p-2 mr-2 rounded border border-gray-800 bg-black focus:outline-none"
      />
      {commentInputs[post.id]?.isTyping && (
        <button 
          onClick={() => handlePostComment(post.id)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      )}
    </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Right */}

      <div className="w-1/5 p-4 border-l border-gray-800">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          <div>
            <div className="font-bold">_dev.dev</div>
            <div className="text-gray-500">Dev Hadvani</div>
          </div>
          {/* <a href="#" className="text-blue-500">Switch</a> */}
        </div>

        <div className="text-gray-500 mb-2">Suggested for you</div>
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-gray-500 text-sm">{user.status}</div>
              </div>
            </div>
            <a href="#" className="text-blue-500">Follow</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

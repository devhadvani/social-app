import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import SideBar from './SideBar';
import axios from 'axios';
import logo from '../assets/profile.svg';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

Modal.setAppElement('#root');  // Set the root element for the modal

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [comments, setComments] = useState([]); // New state for storing comments of a specific post

  const suggestedUsers = [
    { name: 'bharadavarasiklal', status: 'New to Instagram' },
    { name: 'i_am_vaibhlo_manjsa', status: 'New to Instagram' },
    { name: 'maradiyagirihbhai', status: 'Suggested for you' },
    { name: 'mali__chora_', status: 'New to Instagram' },
  ];

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

  const handlePostComment = (postId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.post(`http://127.0.0.1:8000/posts/${postId}/comment/`, { text: commentInputs[postId].text }, config)
      .then(response => {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              comments: [...post.comments, response.data]
            };
          }
          return post;
        }));
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

  const handleCommentLike = (commentId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.post(`http://127.0.0.1:8000/comments/${commentId}/like/`, {}, config)
      .then(response => {
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            const newLikesCount = comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1;
            return { 
              ...comment, 
              likes_count: newLikesCount,
              is_liked: !comment.is_liked 
            };
          }
          return comment;
        }));
      })
      .catch(error => {
        console.error("There was an error liking the comment!", error);
      });
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const fetchComments = (postId) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get(`http://127.0.0.1:8000/posts/${postId}/comments/`, config)
      .then(response => {
        setComments(response.data);
        setModalIsOpen(true);
      })
      .catch(error => {
        console.error("There was an error fetching the comments!", error);
      });
  };

  const openModal = (post) => {
    setCurrentPost(post);
    fetchComments(post.id);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPost(null);
  };

  return (
    <div className="bg-black min-h-screen text-white flex">
      <SideBar />
      <div className="w-6/12 p-4 ml-80">
        <div className="space-y-4">
          <div className="flex space-x-4 overflow-x-auto">
            {['savan', 'cyberknight', 'clarify', 'deep', 'ahir_sir', 'uday', 'jignesh'].map((user, index) => (
              <div key={index} className="w-20 h-20 rounded-full bg-gray-800"></div>
            ))}
          </div>
          <div className="w-3/4 ml-20">
            {posts.map(post => (
              <div key={post.id} className="bg-black p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={post.user_profile.profile_image || logo} alt="profile" className="w-10 h-10 rounded-full bg-gray-700" />
                  <div className="flex-1">
                    <Link to={`/${post.user_profile.name}`}>
                      <span className="font-bold">{post.user_profile.name}</span>
                    </Link>
                  </div>
                  <span className="text-gray-500">
                    {formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })}
                  </span>
                </div>
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
                    <button onClick={() => openModal(post)}><i className="fas fa-comment"></i></button>
                    <button><i className="fas fa-share"></i></button>
                  </div>
                  <button><i className="fas fa-bookmark"></i></button>
                </div>

                <div className="mt-4">
                  <span className="font-bold">{post.likes_count}</span> likes
                </div>
                <div className="mt-4">
                  <span className="font-bold">{post.user_profile.name}</span> {post.caption}
                </div>
                <button onClick={() => openModal(post)}>Show {post.comments_count} Comments</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/5 p-4 border-l border-gray-800">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          <div>
            <div className="font-bold">_dev.dev</div>
            <div className="text-gray-500">Dev Hadvani</div>
          </div>
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

      {/* Modal */}
      {currentPost && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Post Details"
          className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75" // For overlay click to close
        >
          <div className="bg-black text-white rounded-lg overflow-hidden w-full max-w-4xl h-4/5">
            <div className="flex h-full">
              <div className="w-2/3">
                {currentPost.images.length > 1 ? (
                  <Slider {...carouselSettings}>
                    {currentPost.images.map((image, index) => (
                      <img key={index} src={image.image} alt={`post-${index}`} className="w-full object-contain h-full" />
                    ))}
                  </Slider>
                ) : (
                  <img src={currentPost.images[0].image} alt="post" className="w-full object-contain h-full" />
                )}
              </div>
              <div className="w-1/3 p-4 flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={currentPost.user_profile.profile_image || logo} alt="profile" className="w-10 h-10 rounded-full bg-gray-700" />
                  <div className="flex-1">
                    <Link to={`/${currentPost.user_profile.name}`}>
                      <span className="font-bold">{currentPost.user_profile.name}</span>
                    </Link>
                  </div>
                  <span className="text-gray-500">
                    {formatDistanceToNow(parseISO(currentPost.created_at), { addSuffix: true })}
                  </span>
                  <button onClick={closeModal} className="text-gray-500">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div>
                    <span className="font-bold">{currentPost.user_profile.name}</span> {currentPost.caption}
                  </div>
                  <div className="mt-4 space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex space-x-2 items-center">
                        <img src={comment.user.profile_image || logo} alt="profile" className="w-8 h-8 rounded-full bg-gray-700" />
                        <div>
                          <span className="font-bold">{comment.user_profile.name}</span>
                          <span className="text-gray-400 flex">{comment.text}</span> 
                        </div>
                        <span className="text-gray-500">
                  {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}
                </span>
                        <button onClick={() => handleCommentLike(comment.id)} className="ml-auto">
                          <i className={`fas fa-heart ${comment.is_liked ? 'text-red-500' : ''}`}></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <input 
                    type="text" 
                    value={commentInputs[currentPost.id]?.text} 
                    onChange={(e) => handleCommentChange(currentPost.id, e)} 
                    placeholder="Add a comment..." 
                    className="w-full p-2 mr-2 rounded border border-gray-800 bg-white focus:outline-none"
                  />
                  {commentInputs[currentPost.id]?.isTyping && (
                    <button 
                      onClick={() => handlePostComment(currentPost.id)} 
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                    >
                      Post
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;

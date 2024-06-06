// Home.jsx
import React from 'react';
import SideBar from './SideBar';
import logo from '../assets/profile.svg';
import {  Link  } from 'react-router-dom';

const Home = () => {
  const suggestedUsers = [
    { name: 'bharadavarasiklal', status: 'New to Instagram' },
    { name: 'i_am_vaibhlo_manjsa', status: 'New to Instagram' },
    { name: 'maradiyagirihbhai', status: 'Suggested for you' },
    { name: 'mali__chora_', status: 'New to Instagram' },
    { name: 'my_colourful_canvas_14', status: 'New to Instagram' },
  ];

  const posts = [
    {
      id: 2,
      user: 32,
      caption: "this is first post",
      created_at: "2024-06-05T12:20:52.434679Z",
      updated_at: "2024-06-05T12:20:52.434718Z",
      images: [
        {
          id: 1,
          image: "http://127.0.0.1:8000/media/post_images/20211104_115718.jpg"
        }
      ],
      likes_count: 0,
      comments_count: 0
    },
    {
      id: 3,
      user: 32,
      caption: "this is second post",
      created_at: "2024-06-05T12:40:43.971190Z",
      updated_at: "2024-06-05T12:40:43.971239Z",
      images: [
        {
          id: 2,
          image: "http://127.0.0.1:8000/media/post_images/38_X_38_Octagon.jpg"
        }
      ],
      likes_count: 0,
      comments_count: 0
    },
    {
      id: 4,
      user: 32,
      caption: "this is third post",
      created_at: "2024-06-05T13:43:06.262149Z",
      updated_at: "2024-06-05T13:43:06.262171Z",
      images: [
        {
          id: 3,
          image: "http://127.0.0.1:8000/media/post_images/image_copy_3.png"
        }
      ],
      likes_count: 0,
      comments_count: 0
    }
  ];

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
                <img src={logo} alt="profile" className="w-10 h-10 rounded-full bg-gray-700" />
                <div className="flex-1">
                <Link
                      to={`/${post.user}`}
                      // className="flex space-x-4 justify-between"
                    
                    >
                  <span className="font-bold">{`user${post.user}`}</span>
                  </Link>
                </div>
                <span className="text-gray-500">{new Date(post.created_at).toLocaleString()}</span>
              </div>
              <div className="rounded-lg border-slate-600 border-2 mb-4">
                <img src={post.images[0].image} alt="post" className="w-full object-contain rounded-lg" style={{ maxHeight: '550px' }}/>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button><i className="fas fa-heart"></i></button>
                  <button><i className="fas fa-comment"></i></button>
                  <button><i className="fas fa-share"></i></button>
                </div>
                <button><i className="fas fa-bookmark"></i></button>
              </div>
              <div className="mt-4">
                <span className="font-bold">{`user${post.user}`}</span> {post.caption}
              </div>

              <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
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
          <a href="#" className="text-blue-500">Switch</a>
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

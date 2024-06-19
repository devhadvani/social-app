import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../assets/profile.svg';

const PostList = ({ posts }) => {
  if (!posts.length) {
    return <p>No posts yet.</p>;
  }

  return (
    <div className="flex flex-wrap -mx-2">
      {posts.map((post) => (
        <div key={post.id} className="w-1/3 p-2">
          <div className="post rounded-lg overflow-hidden" style={{ height: '400px' }}>
            {/* <div className="post-header flex items-center p-4">
              <Link to={`/${post.user.username}`} className="flex items-center">
                <img
                  src={post.user.profile_image || logo}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full mr-3"
                  onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                />
                <span className="text-white">{post.user.username}</span>
              </Link>
            </div> */}
            <div className="post-body flex justify-center items-center" style={{ height: '250px' }}>
              {post.images.map((image) => (
                <img key={image.id} src={image.image} alt="Post" className="post-image object-contain max-w-full max-h-full" />
              ))}
            </div>
            <div className="p-4 flex space-x-2">
              <button
                onClick={() => likePost(post.id)}
                className={`py-1 px-4 rounded ${post.is_liked ? 'bg-red-500' : 'bg-gray-500'}`}
              >
                {post.is_liked ? 'Unlike' : 'Like'}
              </button>
              <p className="text-white mb-4">{post.caption}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;

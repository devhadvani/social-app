import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/profile/${username}`);
        setProfile(response.data[0]);
        console.log(response.data);
        console.log("r",profile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white flex">
      {/* Sidebar */}
      <div className="w-1/5 p-4 border-r border-gray-800">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold mb-6">Instagram</h1>
          <nav className="space-y-4">
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-search"></i>
              <span>Search</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-compass"></i>
              <span>Explore</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-film"></i>
              <span>Reels</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-heart"></i>
              <span>Notifications</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-plus-square"></i>
              <span>Create</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-gray-400">
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <img src={profile.profile_image} alt={profile.profile_name} className="w-32 h-32 rounded-full" />
          <div>
            <div className="text-2xl font-bold">{username}</div>
            <div className="flex space-x-4 mt-2">
              <button className="bg-gray-800 py-1 px-4 rounded">Edit Profile</button>
              <button className="bg-gray-800 py-1 px-4 rounded">View archive</button>
              <button className="bg-gray-800 py-1 px-4 rounded">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="flex space-x-8 mb-6">
          <div>
            <span className="font-bold">1</span> post
          </div>
          <div>
            <span className="font-bold">{profile.followers_count}</span> followers
          </div>
          <div>
            <span className="font-bold">{profile.following_count}</span> following
          </div>
        </div>

        {/* Profile Name */}
        <div className="font-bold mb-6">{profile.name}</div>
        <div className="mb-6">{profile.bio}</div>

        {/* Profile Content */}
        <div>
          <div className="flex space-x-4 border-b border-gray-800 pb-2 mb-6">
            <div className="cursor-pointer">POSTS</div>
            <div className="cursor-pointer">SAVED</div>
            <div className="cursor-pointer">TAGGED</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <img src="/path-to-your-image.jpg" alt="Post" className="w-full h-auto" />
            </div>
            {/* Repeat for more posts */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;




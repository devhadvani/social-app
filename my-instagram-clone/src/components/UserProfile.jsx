import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../assets/profile.svg';
import {jwtDecode } from 'jwt-decode';
import PostList from './PostList';
import Sidebar from './SideBar';
import useAuthCheck from './auth/useAuthCheck';

const UserProfile = () => {
  useAuthCheck();
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://${window.location.hostname}:8000/profile/${username}`, config);
      setProfile(response.data[0]);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://${window.location.hostname}:8000/followers/${username}`, config);
      setFollowers(response.data);
      setShowFollowersModal(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowings = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://${window.location.hostname}:8000/following/${username}`, config);
      console.log("f", response.data)
      setFollowers(response.data);
      setShowFollowersModal(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const followUser = async (followingName) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      console.log(followingName);
      const response = await axios.post(`http://${window.location.hostname}:8000/follow/`, { following: followingName }, config);
      fetchProfile(); // Optionally, refresh profile to update follow state
    } catch (error) {
      console.error("Error following user:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.detail);
      }
    }
  };

  const unfollowUser = async (followingName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No token found, please log in first.");
        return;
      }
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.delete(`http://${window.location.hostname}:8000/unfollow/${followingName}`, config);
      fetchProfile(); // Optionally, refresh profile to update follow state
    } catch (error) {
      console.error("Error unfollowing user:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.detail);
      }
    }
  };

  const isCurrentUser = currentUser && profile && currentUser.user_id === profile.id;

  return (
    <div className="bg-black min-h-screen text-white flex">
        <Sidebar />
      <div className="w-5/6 px-20 mt-5 ml-80 pl-10">
        {!profile || !currentUser ? (
          <div className="flex justify-center items-center h-full">
            {/* <Sidebar /> */}
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <>
            <div className="flex space-x-5 mb-6">
              <img src={profile.profile_image ? profile.profile_image : logo} alt={profile.profile_name} className="w-40 h-40 rounded-full" onError={(e) => { e.target.onerror = null; e.target.src = logo; }} />
              <div className='ml-10'>
                <div className="flex space-x-4 mt-1 ml-10">
                  <div className="text-2xl font-bold">{username}</div>
                  {isCurrentUser && (
                    <>
                      <button className="bg-black-rgba py-1 px-4 rounded">Edit Profile</button>
                      <button className="bg-black-rgba py-1 px-4 rounded">View Archive</button>
                      <button className="bg-black-rgba py-1 px-4 rounded">
                        <i className="fas fa-cog"></i>
                      </button>
                    </>
                  )}
                  {!isCurrentUser && (
                    <button className={`py-1 px-4 rounded-lg mr-5 font-bold br-3 ${profile.is_following ? 'bg-black-rgba' : 'bg-sky-500'}`} onClick={() => profile.is_following ? unfollowUser(profile.id) : followUser(username)}>
                      {profile.is_following ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
                <div className="flex space-x-8 mt-8 ml-10">
                  <div>
                    <span className="font-bold">1</span> post
                  </div>
                  <div onClick={fetchFollowers} className='cursor-pointer'>
                    <span className="font-bold ">{profile.followers_count}</span> followers
                  </div>
                  <div onClick={fetchFollowings} className='cursor-pointer'>
                    <span className="font-bold">{profile.following_count}</span> following
                  </div>
                </div>

                <div className="flex mt-8 ml-10">
                  <span className='font-bold'>{profile.profile_name}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-8 mb-6"></div>
            <div className="font-bold mb-6">{profile.name}</div>
            <div className="mb-6">{profile.bio}</div>
            <div>
              <div className="flex space-x-4 border-b border-gray-800 pb-2 mb-6">
                <div className="cursor-pointer">POSTS</div>
                <div className="cursor-pointer">SAVED</div>
                <div className="cursor-pointer">TAGGED</div>
              </div>
              <div>
                <div className="mt-8">
                  <h3 className="text-xl mb-4">Posts</h3>
                  <PostList posts={profile.posts} />
                </div>
              </div>
            </div>
          </>
        )}

        {showFollowersModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-neutral-800 p-4 rounded-lg w-1/4">
              <h2 className="text-2xl font-bold mb-4">Followers</h2>
              <button className="absolute top-2 right-2 text-green" onClick={() => setShowFollowersModal(false)}>Close</button>
              <ul>
                {followers.map((follower, index) => (
                  <li key={index} className="flex items-center justify-between space-x-4 mb-4">
                    <Link
                      to={`/${follower.name}`}
                      className="flex space-x-4 justify-between"
                      onClick={() => setShowFollowersModal(false)}
                    >
                      <img
                        src={follower.profile_image ? follower.profile_image : logo}
                        alt={follower.profile_name}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                      />
                      <div>
                        <div className="font-bold text-white">{follower.name}</div>
                        <div className="text-gray-400">{follower.profile_name}</div>
                      </div>
                    </Link>
                    {currentUser.user_id !== follower.id && (
                      <button
                        className={`py-1 px-4 rounded-lg mr-5 font-bold br-3 ${follower.is_following ? 'bg-black-rgba' : 'bg-sky-500'}`}
                        onClick={() => follower.is_following ? unfollowUser(follower.id) : followUser(follower.name)}
                      >
                        {follower.is_following ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

// Home.jsx
import React from 'react';

const Home = () => {
  const suggestedUsers = [
    { name: 'bharadavarasiklal', status: 'New to Instagram' },
    { name: 'i_am_vaibhlo_manjsa', status: 'New to Instagram' },
    { name: 'maradiyagirihbhai', status: 'Suggested for you' },
    { name: 'mali__chora_', status: 'New to Instagram' },
    { name: 'my_colourful_canvas_14', status: 'New to Instagram' },
  ];

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
      <div className="w-3/5 p-4">
        <div className="space-y-4">
          {/* Story Section */}
          <div className="flex space-x-4 overflow-x-auto">
            {['savan', 'cyberknight', 'clarify', 'deep', 'ahir_sir', 'uday', 'jignesh', 'jay'].map((user, index) => (
              <div key={index} className="w-20 h-20 rounded-full bg-gray-800"></div>
            ))}
          </div>

          {/* Post Section */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="flex-1">
                <span className="font-bold">viratishahhh</span> and 3 others
              </div>
              <span className="text-gray-500">10 h</span>
            </div>
            <div className="bg-gray-700 h-80 rounded-lg mb-4"></div>
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

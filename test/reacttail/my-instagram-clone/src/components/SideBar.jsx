import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {jwtDecode} from 'jwt-decode';
const SideBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const name = decoded.name;
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="w-1/5 p-4 border-r border-gray-800 fixed h-full">
            <div className="flex flex-col items-start ml-5 mt-6">
                <h1 className="text-4xl mb-6">Instagram</h1>
                <nav className="space-y-8 text-1xl font-normal mt-8">
                    <Link to="/" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                    <Link to="/search" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-search"></i>
                        <span>Search</span>
                    </Link>
                    <Link to="/explore" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-compass"></i>
                        <span>Explore</span>
                    </Link>
                    <Link to="/reels" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-film"></i>
                        <span>Reels</span>
                    </Link>
                    <Link to="/messages" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-envelope"></i>
                        <span>Messages</span>
                    </Link>
                    <Link to="/notifications" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-heart"></i>
                        <span>Notifications</span>
                    </Link>
                    <Link to="/create" className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-plus-square"></i>
                        <span>Create</span>
                    </Link>
                    <Link to={name} className="flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </Link>
                    <button onClick={handleLogout} className="nav-button flex items-center space-x-4 hover:text-gray-400">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default SideBar;

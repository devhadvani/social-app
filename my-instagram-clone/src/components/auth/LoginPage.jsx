import { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import useAuthCheck from './useAuthCheck';

const LoginPage = () => {
    useAuthCheck();

    const location = useLocation();
    const activate_msg = location.state;
//   console.log(activate_msg)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        // const name = decoded.name;
        
        if (token) {
            const decoded = jwtDecode(token);
            console.log(decoded);
            navigate('/'+decoded.name);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            // const response = await axios.post('http://127.0.0.1:8000/login/', formData);
            const response = await axios.post(`http://${window.location.hostname}:8000/login/`, formData);
            console.log('Login successful', response.data);
            
            // Store the token in localStorage upon successful login
            localStorage.setItem('token', response.data.access);
            const decoded = jwtDecode(response.data.access);
            console.log(decoded)
            // Redirect user to the dashboard
            navigate('/'+decoded.name);
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Login failed', error.response.data);
                setError(error.response.data.detail);
            } else {
                console.error('Login failed', error.message);
                setError('An error occurred during login.');
            }
        } finally {
            setLoading(false); // Set loading to false when login process ends
        }
    };

    return (
        <div className="container auth__container">
    
            {activate_msg && <p className="error-message">successful{activate_msg}</p>}
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="spinner"></p>}

                <form className="auth__form">
            <h1 className="main__title">Login</h1>
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Login to the future</button>
                    {/* <Link to="/reset-password">Forget Password ?</Link> */}
                </form>
            
        </div>
    );
};

export default LoginPage;

import React, { useEffect, useState } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
        
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received data:', event.data);

            setNotifications(prevNotifications => [data.notification, ...prevNotifications]);
        };

        ws.onclose = (event) => {
            console.error('WebSocket closed unexpectedly', event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket encountered an error:', error);
        };

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            ws.close();
        };
    }, []); // Empty dependency array ensures useEffect runs only once

    useEffect(() => {
        console.log('Notifications updated:', notifications);
    }, [notifications]); // Logs the notifications whenever they update

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;

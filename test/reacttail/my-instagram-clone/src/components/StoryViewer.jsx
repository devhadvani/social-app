import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import axios from 'axios';

Modal.setAppElement('#root');  // Set the root element for the modal

const StoryViewer = ({ isOpen, onRequestClose, userId }) => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      axios.get(`http://127.0.0.1:8000/stories/${userId}/`, config)
        .then(response => {
          setStories(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the stories!", error);
        });
    }
  }, [userId]);

  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Story Viewer"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="bg-black text-white rounded-lg overflow-hidden w-full max-w-4xl h-4/5">
        <div className="flex h-full">
          <div className="w-full p-4 flex flex-col">
            {stories.length > 0 ? (
              <Slider {...carouselSettings}>
                {stories.map((story, index) => (
                  <div key={index} className="h-full flex justify-center items-center">
                    <img src={story.image} alt={`story-${index}`} className="w-full object-contain h-full" />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <p>No stories to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StoryViewer;

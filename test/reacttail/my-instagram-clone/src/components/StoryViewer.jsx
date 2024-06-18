import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import axios from 'axios';

Modal.setAppElement('#root');  // Set the root element for the modal

const StoryViewer = ({ isOpen, onClose, userId }) => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      axios.get(`http://127.0.0.1:8000/following-stories/`, config)
        .then(response => {
          setStories(response.data);
          console.log(response.data);
          console.log(stories);
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
      onClose={onClose}
      contentLabel="Story Viewer"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="bg-black text-white rounded-lg overflow-hidden  max-w-xl h-full">
        <div className="flex h-full">
          <div className="w-full p-6 flex flex-col">
            {stories.length > 0 ? (
              <Slider {...carouselSettings}>
                {stories[0].images.map((image, index) => (
                  <div key={index} className="h-full flex justify-center  items-center">
                    <img src={image.image} alt={`story-${index}`} className="w-full object-contain max-h-96" />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <p>No stories to display.</p>
                {/* {stories[0].user.name} */}
              </div>
            )}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-500">
                    <i className="fas fa-times"></i>
                  </button>
    </Modal>
  );
};

export default StoryViewer;

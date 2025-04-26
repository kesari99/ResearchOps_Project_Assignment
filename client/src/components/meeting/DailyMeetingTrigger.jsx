import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import DailyMeetingModal from './DailyMeetingModal';

const DailyMeetingTrigger = () => {
  const { auth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    if (!auth?.user?._id) return;
    
    // Check if we should show meeting modal today
    const shouldShowMeeting = () => {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      
      // Only show on weekdays (Monday = 1, Friday = 5)
      if (day < 1 || day > 5) return false;
      
      // Show at 9 AM
      if (hours !== 9) return false;
      
      // Check local storage to prevent showing multiple times in the same day
      const lastMeetingDate = localStorage.getItem('lastDailyMeetingDate');
      const today = now.toDateString();
      
      if (lastMeetingDate === today) return false;
      
      return true;
    };
    
    // Function to check and trigger meeting modal
    const checkTime = () => {
      if (shouldShowMeeting()) {
        setShowModal(true);
        // Mark as shown for today
        localStorage.setItem('lastDailyMeetingDate', new Date().toDateString());
      }
    };
    
    // Check immediately when component mounts
    checkTime();
    
    // Check every minute
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, [auth?.user?._id]);
  
  const handleClose = () => {
    setShowModal(false);
  };
  
  // The component doesn't render anything visible, just handles the modal
  return (
    <>
      {showModal && <DailyMeetingModal isOpen={showModal} onClose={handleClose} />}
    </>
  );
};

export default DailyMeetingTrigger;
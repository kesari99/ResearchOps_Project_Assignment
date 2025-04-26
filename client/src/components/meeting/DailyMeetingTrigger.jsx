import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import DailyMeetingModal from './DailyMeetingModal';

const DailyMeetingTrigger = () => {
  const { auth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if (!auth?.user?._id) return;
    
    const shouldShowMeeting = () => {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      
      // Only show on weekdays (Monday = 1, Friday = 5)
      if (day < 1 || day > 5) return false;
      
      // Show at 9 AM
      if (hours !== 9) return false;
      
      const lastMeetingDate = localStorage.getItem('lastDailyMeetingDate');
      const today = now.toDateString();
      
      if (lastMeetingDate === today) return false;
      
      return true;
    };
    
    const checkTime = () => {
      if (shouldShowMeeting()) {
        setShowModal(true);
        localStorage.setItem('lastDailyMeetingDate', new Date().toDateString());
      }
    };
    
    checkTime();
    
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, [auth?.user?._id]);
  
  const handleClose = () => {
    setShowModal(false);
  };
  
  return (
    <>
      {showModal && <DailyMeetingModal isOpen={showModal} onClose={handleClose} />}
    </>
  );
};

export default DailyMeetingTrigger;
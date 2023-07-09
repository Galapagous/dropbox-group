import { useEffect } from 'react';
import { Auth } from 'aws-amplify';

const SessionTimeout = ({ timeoutDuration }) => {
  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(logout, timeoutDuration);
    };

    const logout = async () => {
      try {
        await Auth.signOut(); // Log out using AWS Cognito
        // You can add additional logic here to redirect the user or show a logout message
      } catch (error) {
        console.log('Error logging out:', error);
      }
    };

    resetTimeout();

    const activityHandler = () => resetTimeout();

    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keydown', activityHandler);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keydown', activityHandler);
    };
  }, );

  return null;
};

export default SessionTimeout;
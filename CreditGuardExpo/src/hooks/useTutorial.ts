import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_COMPLETED_KEY = '@tutorial_completed';

export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);
      if (completed === null) {
        // First time user - show tutorial
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      setShowTutorial(false);
    } catch (error) {
      console.error('Error saving tutorial completion:', error);
    }
  };

  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_COMPLETED_KEY);
      setShowTutorial(true);
    } catch (error) {
      console.error('Error resetting tutorial:', error);
    }
  };

  return {
    showTutorial,
    isChecking,
    setShowTutorial,
    completeTutorial,
    resetTutorial,
  };
};

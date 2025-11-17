import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const familyData = await AsyncStorage.getItem('familyMembers');
      const moodData = await AsyncStorage.getItem('moodLogs');
      const activityData = await AsyncStorage.getItem('activities');
      const activityLogData = await AsyncStorage.getItem('activityLogs');

      if (userData) setUser(JSON.parse(userData));
      if (familyData) setFamilyMembers(JSON.parse(familyData));
      if (moodData) setMoodLogs(JSON.parse(moodData));
      if (activityData) setActivities(JSON.parse(activityData));
      if (activityLogData) setActivityLogs(JSON.parse(activityLogData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const saveFamilyMembers = async (members) => {
    try {
      await AsyncStorage.setItem('familyMembers', JSON.stringify(members));
      setFamilyMembers(members);
    } catch (error) {
      console.error('Error saving family members:', error);
    }
  };

  const addMoodLog = async (log) => {
    try {
      const newLogs = [...moodLogs, { ...log, id: Date.now().toString() }];
      await AsyncStorage.setItem('moodLogs', JSON.stringify(newLogs));
      setMoodLogs(newLogs);
    } catch (error) {
      console.error('Error adding mood log:', error);
    }
  };

  const addActivityLog = async (log) => {
    try {
      const newLogs = [...activityLogs, { ...log, id: Date.now().toString() }];
      await AsyncStorage.setItem('activityLogs', JSON.stringify(newLogs));
      setActivityLogs(newLogs);
    } catch (error) {
      console.error('Error adding activity log:', error);
    }
  };

  const value = {
    user,
    familyMembers,
    moodLogs,
    activities,
    activityLogs,
    isLoading,
    saveUser,
    saveFamilyMembers,
    addMoodLog,
    addActivityLog,
    setActivities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

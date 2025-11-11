/**
 * React Native Example
 * Complete example of using ScoreAPI SDK in a React Native app
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreAPIClient, createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';

// Initialize SDK
const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: process.env.CUSTOMER_TOKEN,
  storage: createAsyncStorageAdapter(AsyncStorage),
});

export default function App() {
  const [username, setUsername] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [creditScore, setCreditScore] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await client.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        await loadUserData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await client.auth.userLogin({ username, password });
      setUser(response.user);
      setIsAuthenticated(true);
      Alert.alert('Success', 'Login successful!');
      await loadUserData();
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await client.auth.logout();
      setUser(null);
      setCreditScore(null);
      setAlerts([]);
      setIsAuthenticated(false);
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const loadUserData = async () => {
    try {
      // Load user profile
      const profile = await client.user.getProfile();
      setUser(profile);

      // Load credit score
      const scores = await client.score.getLatestScores();
      setCreditScore(scores);

      // Load alerts
      const alertsData = await client.alerts.getAlerts();
      setAlerts(alertsData.alerts);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const refreshScore = async () => {
    try {
      const scores = await client.score.getLatestScores();
      setCreditScore(scores);
      Alert.alert('Success', 'Score refreshed!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ScoreAPI SDK Example</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.firstName || user?.email}</Text>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Status: {user?.active ? 'Active' : 'Inactive'}</Text>
        <Text>Enrolled: {user?.enrollmentId ? 'Yes' : 'No'}</Text>
      </View>

      {/* Credit Score Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Credit Score</Text>
        {creditScore ? (
          <>
            <Text style={styles.scoreText}>
              {creditScore.vantageScore3 || creditScore.score}
            </Text>
            <Text>Score Date: {creditScore.scoreDate}</Text>
            <Button title="Refresh Score" onPress={refreshScore} />
          </>
        ) : (
          <Text>Loading score...</Text>
        )}
      </View>

      {/* Alerts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts ({alerts.length})</Text>
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <View key={index} style={styles.alert}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text>{alert.description}</Text>
              <Text style={styles.alertDate}>{alert.createdAt}</Text>
            </View>
          ))
        ) : (
          <Text>No alerts</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginVertical: 10,
  },
  alert: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  alertTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

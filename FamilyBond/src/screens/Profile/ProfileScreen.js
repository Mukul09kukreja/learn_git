import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, List, Avatar, Button, Divider } from 'react-native-paper';
import { useApp } from '../../contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const { user, familyMembers, moodLogs, activityLogs, saveUser } = useApp();

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await saveUser(null);
            Alert.alert('Success', 'All data has been reset. Please restart the app.');
          },
        },
      ]
    );
  };

  const totalMoodLogs = moodLogs.filter((log) => log.userId === user?.id).length;
  const totalActivities = activityLogs.length;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Your Stats</Title>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalMoodLogs}</Text>
              <Text style={styles.statLabel}>Mood Logs</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalActivities}</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{familyMembers.length}</Text>
              <Text style={styles.statLabel}>Family Members</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Family Members</Title>
          {familyMembers.map((member) => (
            <List.Item
              key={member.id}
              title={member.name}
              description={member.role}
              left={(props) => (
                <Avatar.Text
                  {...props}
                  size={40}
                  label={member.name.substring(0, 2).toUpperCase()}
                />
              )}
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Information</Title>
          <List.Item
            title="Member Since"
            description={memberSince}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Role"
            description={user?.role}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>About FamilyBond</Title>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Privacy Policy"
            description="View our privacy policy"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            onPress={() => Alert.alert('Privacy Policy', 'Your data is stored locally on your device and is never shared with third parties.')}
          />
          <List.Item
            title="Terms of Service"
            description="View terms of service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => Alert.alert('Terms of Service', 'By using FamilyBond, you agree to use the app for its intended purpose of improving family communication.')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Data Management</Title>
          <Button
            mode="outlined"
            onPress={handleResetData}
            style={styles.resetButton}
            textColor="#d32f2f"
          >
            Reset All Data
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for families</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
    backgroundColor: '#6200ee',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#e0e0e0',
    textTransform: 'capitalize',
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  resetButton: {
    marginTop: 10,
    borderColor: '#d32f2f',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen;

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Chip, Title, Paragraph } from 'react-native-paper';
import { useApp } from '../../contexts/AppContext';
import { activitiesData } from '../../data/activitiesData';

const OnboardingScreen = () => {
  const { saveUser, saveFamilyMembers, setActivities } = useApp();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [familyMembers, setFamilyMembersLocal] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');

  const handleAddMember = () => {
    if (memberName && memberRole) {
      setFamilyMembersLocal([
        ...familyMembers,
        { id: Date.now().toString(), name: memberName, role: memberRole },
      ]);
      setMemberName('');
      setMemberRole('');
    }
  };

  const handleComplete = async () => {
    const user = {
      id: Date.now().toString(),
      name: userName,
      role: userRole,
      createdAt: new Date().toISOString(),
    };
    
    await saveUser(user);
    await saveFamilyMembers([user, ...familyMembers]);
    setActivities(activitiesData);
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.emoji}>👨‍👩‍👧‍👦</Text>
            <Title style={styles.title}>Welcome to FamilyBond</Title>
            <Paragraph style={styles.subtitle}>
              Strengthen your family connections through better communication and shared experiences
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Let's get started!</Title>
              <Paragraph style={styles.description}>
                FamilyBond helps families:
              </Paragraph>
              <View style={styles.featureList}>
                <Text style={styles.feature}>✓ Track emotions and moods</Text>
                <Text style={styles.feature}>✓ Discover bonding activities</Text>
                <Text style={styles.feature}>✓ Improve communication</Text>
                <Text style={styles.feature}>✓ Build stronger relationships</Text>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={() => setStep(2)}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Get Started
          </Button>
        </ScrollView>
      </View>
    );
  }

  if (step === 2) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title style={styles.stepTitle}>Tell us about yourself</Title>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Your Name"
                value={userName}
                onChangeText={setUserName}
                mode="outlined"
                style={styles.input}
              />

              <Text style={styles.label}>I am a:</Text>
              <View style={styles.chipContainer}>
                <Chip
                  selected={userRole === 'parent'}
                  onPress={() => setUserRole('parent')}
                  style={styles.chip}
                >
                  Parent
                </Chip>
                <Chip
                  selected={userRole === 'child'}
                  onPress={() => setUserRole('child')}
                  style={styles.chip}
                >
                  Child
                </Chip>
                <Chip
                  selected={userRole === 'teen'}
                  onPress={() => setUserRole('teen')}
                  style={styles.chip}
                >
                  Teen
                </Chip>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.buttonRow}>
            <Button onPress={() => setStep(1)} style={styles.backButton}>
              Back
            </Button>
            <Button
              mode="contained"
              onPress={() => setStep(3)}
              disabled={!userName || !userRole}
              style={styles.nextButton}
            >
              Next
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (step === 3) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title style={styles.stepTitle}>Add Family Members</Title>
          <Paragraph style={styles.subtitle}>
            Add other family members who will use this app (optional)
          </Paragraph>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Family Member Name"
                value={memberName}
                onChangeText={setMemberName}
                mode="outlined"
                style={styles.input}
              />

              <Text style={styles.label}>Role:</Text>
              <View style={styles.chipContainer}>
                <Chip
                  selected={memberRole === 'parent'}
                  onPress={() => setMemberRole('parent')}
                  style={styles.chip}
                >
                  Parent
                </Chip>
                <Chip
                  selected={memberRole === 'child'}
                  onPress={() => setMemberRole('child')}
                  style={styles.chip}
                >
                  Child
                </Chip>
                <Chip
                  selected={memberRole === 'teen'}
                  onPress={() => setMemberRole('teen')}
                  style={styles.chip}
                >
                  Teen
                </Chip>
              </View>

              <Button
                mode="outlined"
                onPress={handleAddMember}
                disabled={!memberName || !memberRole}
                style={styles.addButton}
              >
                Add Member
              </Button>

              {familyMembers.length > 0 && (
                <View style={styles.membersList}>
                  <Text style={styles.membersTitle}>Family Members:</Text>
                  {familyMembers.map((member) => (
                    <Chip key={member.id} style={styles.memberChip}>
                      {member.name} ({member.role})
                    </Chip>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>

          <View style={styles.buttonRow}>
            <Button onPress={() => setStep(2)} style={styles.backButton}>
              Back
            </Button>
            <Button
              mode="contained"
              onPress={handleComplete}
              style={styles.nextButton}
            >
              Complete Setup
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  description: {
    marginTop: 10,
    marginBottom: 10,
  },
  featureList: {
    marginTop: 10,
  },
  feature: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  button: {
    marginTop: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    marginTop: 10,
  },
  membersList: {
    marginTop: 20,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberChip: {
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
});

export default OnboardingScreen;

import React, { useContext, useState } from 'react';
import { Button, Input, Layout, Text, Radio, RadioGroup } from '@ui-kitten/components';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Snackbar from 'react-native-snackbar';

const SignUpScreen = ({ navigation }) => {
  const { login, axiosInstance } = useContext(AuthContext);

  const [role, setRole] = useState(0); // 0: User, 1: Organizer
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const showSnackbar = (message, type = 'error') => {
    const backgroundColor = type === 'success' ? '#4caf50' : '#f44336'; // Green for success, Red for error
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor,
    });
  };

  const validateInputs = () => {
    if (!name || !userName || !email || !password1 || !password2) {
      showSnackbar('All fields are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showSnackbar('Enter a valid email.');
      return false;
    }
    if (password1 !== password2) {
      showSnackbar('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    const selectedRole = role === 0 ? 'customer' : 'organizer';

    try {
      const response = await axiosInstance.post('/auth/sign-up/', {
        name,
        username: userName,
        email,
        password: password1,
        role: selectedRole,
      });

      const data = response.data;

      if (response.status === 201) {
        await login(data.access_token, data.refresh_token, selectedRole); // Save tokens and navigate based on role
        showSnackbar('Sign up successful!', 'success');
        // navigation.navigate('Login')
      } else {
        showSnackbar('Unexpected response from the server.');
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      const errorMessage = error.response?.data?.error || 'Sign up failed. Please try again.';
      showSnackbar(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <Text category="h1">Sign Up</Text>
      <Input
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        keyboardType="default"
      />
      <Input
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="User Name"
        keyboardType="default"
      />
      <Input
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        style={styles.input}
        value={password1}
        onChangeText={setPassword1}
        placeholder="Password"
        secureTextEntry
      />
      <Input
        style={styles.input}
        value={password2}
        onChangeText={setPassword2}
        placeholder="Confirm Password"
        secureTextEntry
      />

      <Text category="h6" style={styles.roleText}>Sign up as:</Text>
      <RadioGroup
        selectedIndex={role}
        onChange={(index) => setRole(index)}
        style={styles.radioGroup}
      >
        <Radio>Attendee (User)</Radio>
        <Radio>Event Organizer</Radio>
      </RadioGroup>

      <Button style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Button
          style={styles.loginButton}
          appearance="ghost"
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Button>
      </View>

      <Button
        appearance="ghost"
        onPress={() => navigation.navigate('Terms And Conditions')}
      >
        Terms And Conditions
      </Button>
      </ScrollView>
    </Layout>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
  roleText: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  radioGroup: {
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
  },
  loginButton: {
    paddingHorizontal: 0,
    marginLeft: 1,
  },
});

export default SignUpScreen;
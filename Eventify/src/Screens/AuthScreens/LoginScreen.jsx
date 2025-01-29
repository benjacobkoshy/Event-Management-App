import React, { useState, useContext } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login, axiosInstance } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email || !password) {
      Snackbar.show({
        text: 'All fields are required.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login/', {
        email,
        password,
      });

      const data = response.data;
      console.log(data)
      if (response.status === 200) {
        await login(data.access_token, data.refresh_token, data.role); // Save token and user role in context
        Snackbar.show({
          text: 'Login successful!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      Snackbar.show({
        text: error.response?.data?.error || 'Login failed. Check your credentials.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category="h1">Login</Text>
      <Input
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email / User Name"
        // keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Button
          style={styles.signupButton}
          appearance="ghost"
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign up
        </Button>
      </View>
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
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    fontSize: 16,
  },
  signupButton: {
    paddingHorizontal: 0,
    marginLeft: 1,
  },
});

export default LoginScreen;
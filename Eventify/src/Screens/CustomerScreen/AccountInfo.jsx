import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Layout,
  Text,
  Input,
  Radio,
  RadioGroup,
  Datepicker,
} from '@ui-kitten/components';
import { AuthContext } from '../../context/AuthContext';
import Snackbar from 'react-native-snackbar';

export default function AccountInfo() {
  const { axiosInstance } = useContext(AuthContext);

  const [details, setDetails] = useState({
    name: '',
    username: '',
    email: '',
    address: '',
    phone: '',
    place: '',
    pin: '',
    dob: null,
    gender: '',
  });

  const [selectedGender, setSelectedGender] = useState(null);

  // Fetch user data from the backend on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/auth/user-info/');
        if (response.status === 200) {
          const data = response.data;
          setDetails({
            name: data.name,
            username: data.username,
            email: data.email,
            address: data.address || '',
            phone: data.phone || '',
            place: data.place || '',
            pin: data.pin || '',
            dob: data.dob ? new Date(data.dob) : null,
            gender: data.gender || '',
          });

          setSelectedGender(data.gender === 'Male' ? 0 : 1);
        }
      } catch (error) {
        Snackbar.show({
          text: 'Failed to load user details.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#f44336',
        });
      }
    };

    fetchUserDetails();
  }, [axiosInstance]);

  // Update state when inputs are changed
  const handleInputChange = (field, value) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Save user details to backend
  const saveDetails = async () => {
    if(details.address == '' || details.pin == '' || details.dob == '' || details.gender == '' || details.place == '' || details.phone == ''){
      Snackbar.show({
        text: 'Fields cannot be empty.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#f44336',
      });
      return false;
    }
    try {
      const response = await axiosInstance.post('auth/user-info/', {
        address: details.address,
        phone: details.phone,
        place: details.place,
        pin: details.pin,
        dob: details.dob ? details.dob.toISOString().split('T')[0] : null, // Format date for backend
        gender: details.gender,
      });

      if (response.status === 200) {
        Snackbar.show({
          text: 'Details updated successfully.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4caf50',
        });
      } else {
        Snackbar.show({
          text: 'Failed to update details.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#f44336',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: 'An unexpected error occurred.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#f44336',
      });
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category="h2" style={styles.title}>
        Your Details
      </Text>

      <ScrollView>
        <Text>Name</Text>
        <Input value={details.name} editable={false} style={styles.input} />

        <Text>User Name</Text>
        <Input value={details.username} editable={false} style={styles.input} />

        <Text>Email</Text>
        <Input value={details.email} editable={false} style={styles.input} />

        <Text>Address</Text>
        <Input
          value={details.address}
          placeholder="Address"
          onChangeText={(value) => handleInputChange('address', value)}
          style={styles.input}
        />

        <Text>Phone Number</Text>
        <Input
          value={details.phone}
          placeholder="Phone Number"
          onChangeText={(value) => handleInputChange('phone', value)}
          style={styles.input}
        />

        <Text>Place</Text>
        <Input
          value={details.place}
          placeholder="Place"
          onChangeText={(value) => handleInputChange('place', value)}
          style={styles.input}
        />

        <Text>Pin</Text>
        <Input
          value={details.pin}
          placeholder="Pin"
          onChangeText={(value) => handleInputChange('pin', value)}
          style={styles.input}
        />

        <Text>D.O.B</Text>
        <Datepicker
          date={details.dob}
          placeholder="Pick Date"
          onSelect={(date) => handleInputChange('dob', date)}
          style={styles.input}
        />

        <Text>Gender</Text>
        <RadioGroup
          selectedIndex={selectedGender}
          onChange={(index) => {
            const gender = index === 0 ? 'Male' : 'Female';
            handleInputChange('gender', gender);
            setSelectedGender(index);
          }}
          style={styles.radioGroup}
        >
          <Radio>Male</Radio>
          <Radio>Female</Radio>
        </RadioGroup>

        <TouchableOpacity style={styles.saveButton} onPress={saveDetails}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginVertical: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

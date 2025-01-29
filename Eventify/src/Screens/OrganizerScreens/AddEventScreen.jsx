import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Layout, Text, Input } from '@ui-kitten/components';
import { AuthContext } from '../../context/AuthContext';
import Snackbar from 'react-native-snackbar';

export default function AddEventScreen({ navigation }) {

  const { axiosInstance } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [tags, setTags] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [eventImage, setEventImage] = useState(null);

  const submitEvent = async () => {
    try {
      const eventData = {
        name: name,
        description: description,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        venue: venue,
        city: city,
        zip_code: zipCode,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        ticket_price: ticketPrice,
        max_attendees: maxAttendees,
        tickets_left: maxAttendees,
        tags: tags,
        cancellation_policy: cancellationPolicy,
        image_url: null // Send image URL if available
      };

      // console.log(eventData); // Check the data being sent

      const response = await axiosInstance.post('/events/create/', eventData);

      if (response.status === 201) {
        Snackbar.show({
          text: 'Event submitted successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4caf50',
        });
        navigation.navigate('Dashboard Screen')
      } else {
        Snackbar.show({
          text: 'Failed to submit event',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#f44336',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: 'Error submitting event',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#f44336',
      });
    }
  };





  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('Image picker error:', response.errorMessage);
        } else {
          const { uri } = response.assets[0];
          setEventImage(uri);
        }
      }
    );
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <Text style={styles.title}>Add Event</Text> */}

        {/* Event Details */}
        <Text style={styles.label}>Event Name</Text>
        <Input
          style={styles.input}
          placeholder="Enter event name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description</Text>
        <Input
          style={[styles.input, styles.textArea]}
          placeholder="Enter event description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Start Date */}
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
          <Text>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* End Date */}
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
          <Text>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        {/* Other Inputs */}
        <Text style={styles.label}>Venue</Text>
        <Input
          style={styles.input}
          placeholder="Enter venue name"
          value={venue}
          onChangeText={setVenue}
        />

        <Text style={styles.label}>City</Text>
        <Input
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Zip Code</Text>
        <Input
          style={styles.input}
          placeholder="Enter  zip code"
          value={zipCode}
          onChangeText={setZipCode}
        />

        <Text style={styles.label}>Contact Email</Text>
        <Input
          style={styles.input}
          placeholder="Enter contact email"
          value={contactEmail}
          onChangeText={setContactEmail}
        />

        <Text style={styles.label}>Contact Phone</Text>
        <Input
          style={styles.input}
          placeholder="Enter contact phone"
          value={contactPhone}
          onChangeText={setContactPhone}
        />

        <Text style={styles.label}>Ticket Price</Text>
        <Input
          style={styles.input}
          placeholder="Enter ticket price"
          value={ticketPrice}
          onChangeText={setTicketPrice}
        />

        <Text style={styles.label}>Max Attendees</Text>
        <Input
          style={styles.input}
          placeholder="Enter max attendees"
          value={maxAttendees}
          onChangeText={setMaxAttendees}
        />

        <Text style={styles.label}>Start Time</Text>
        <Input
          style={styles.input}
          placeholder="Enter start time"
          value={startTime}
          onChangeText={setStartTime}
        />

        <Text style={styles.label}>End Time</Text>
        <Input
          style={styles.input}
          placeholder="Enter end time"
          value={endTime}
          onChangeText={setEndTime}
        />

        <Text style={styles.label}>Cancellation Policy</Text>
        <Input
          style={[styles.input, styles.textArea]}
          placeholder="Enter cancellation policy"
          multiline
          numberOfLines={2}
          value={cancellationPolicy}
          onChangeText={setCancellationPolicy}
        />

        <Text style={styles.label}>Tags</Text>
        <Input
          style={[styles.input, styles.textArea]}
          placeholder="Enter tags"
          value={tags}
          onChangeText={setTags}
        />


        <Text style={styles.label}>Event Image</Text>
        {eventImage && (
          <Image source={{ uri: eventImage }} style={styles.imagePreview} />
        )}
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>
            {eventImage ? 'Change Image' : 'Upload Image'}
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={submitEvent}>
          <Text style={styles.buttonText}>Save Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

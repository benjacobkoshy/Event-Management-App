import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { AuthContext } from '../../context/AuthContext';

export default function PaymentScreen({ navigation, route }) {
  const { axiosInstance } = useContext(AuthContext);
  const { tickets, tickets_price, eventId } = route.params;
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const [paymentId, setPaymentId] = useState(null);

  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  // 🔹 Fetch PaymentIntent Client Secret
  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await axiosInstance.post('events/create-payment-intent/', {
        amount: parseInt(tickets_price) * 100, // Convert to paise for INR
      });

      const intent = response.data;
      const { client_secret, id: paymentId } = intent;

      setPaymentId(paymentId); // Set paymentId state

      return { clientSecret: client_secret, paymentId };
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      return null;
    }
  };

  // 🔹 Initialize PaymentSheet
  const initializePaymentSheet = async () => {
    const { clientSecret, paymentId } = await fetchPaymentIntentClientSecret();
    console.log(clientSecret, paymentId)
    if (!clientSecret || !paymentId) {
      Alert.alert('Failed to initialize payment. Please try again.');
      return;
    }

    try {
      const { error } = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Meddy Store',
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert(`Failed to initialize payment: ${error.message}`);
      } else {
        console.log('Payment Sheet initialized successfully');
        await openPaymentSheet(paymentId); // Pass paymentId to openPaymentSheet
      }
    } catch (err) {
      console.error('Unhandled Error during initialization:', err.message);
      Alert.alert('Something went wrong while initializing payment. Please try again.');
    }
  };

  // 🔹 Open PaymentSheet and Handle Payment
  const openPaymentSheet = async (paymentId) => {
    try {
      const { error } = await stripe.presentPaymentSheet();
      if (error) {
        console.error('Payment Sheet Error:', error.message);
        Alert.alert(`Payment failed: ${error.message}`);
        navigation.navigate('Payment Status', { status: 'failed' });
      } else {
        console.log('Payment successful');
        // Assuming the status 'succeeded' means payment is complete
        const paymentStatus = 'succeeded'; // You can validate this via backend if necessary

        if (paymentStatus === 'succeeded') {
          navigation.navigate('Payment Status', {
            status: 'success',
            tickets: tickets,
            totalAmount: tickets_price,
            eventId: eventId
          });
        } else {
          navigation.navigate('Payment Status', { status: 'failed' });
        }
      }
    } catch (err) {
      console.error('Unhandled Error during payment:', err.message);
      Alert.alert('Something went wrong during payment. Please try again.');
      navigation.navigate('Payment Status', { status: 'failed' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Payment</Text>
      <Text style={styles.details}>Total Tickets: {tickets}</Text>
      <Text style={styles.details}>Total Price: ${tickets_price}</Text>

      <TouchableOpacity style={styles.button} onPress={initializePaymentSheet} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay Now</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

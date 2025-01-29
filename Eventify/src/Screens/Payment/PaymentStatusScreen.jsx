import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useContext } from 'react';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../../context/AuthContext';

export default function PaymentStatusScreen({ route, navigation }) {
  const { axiosInstance } = useContext(AuthContext);
  const { status, totalAmount, eventId, tickets } = route.params;  
  const backgroundColor = 
    status === 'success' ? '#1D8348' : 
    status === 'failed' ? '#C0392B' : 
    '#F39C12';

  useEffect(() => {
    if (status === 'success') {
      handlePaymentSuccess();
    } else {
      setTimeout(() => {
        navigation.replace('Event Details', { eventId: eventId }); // Navigate back to Home after failure
      }, 3000);
    }
  }, [status]);

  // 🔹 Send payment details to backend
  const handlePaymentSuccess = async () => {
    try {
      const response = await axiosInstance.post('events/save-booking/', {  // ✅ Change GET to POST
        event_id: eventId,
        amount_paid: totalAmount,
        payment_method: 'Stripe',
        tickets: tickets
      });

      if (response.status === 200) {
        console.log('Payment recorded successfully');
        setTimeout(() => {
          navigation.navigate('Event Details', { eventId: eventId }); // Navigate after success
        }, 3000);
      } else {
        console.error('Failed to save payment in DB');
        navigation.navigate('Event Details', { eventId: eventId });
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      navigation.navigate('Event Details', { eventId: eventId });
    }
};


  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {status === 'success' ? (
        <LottieView
          source={require('../../assets/payment_success.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      ) : (
        <LottieView
          source={require('../../assets/payment_failed.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      )}

      <Text style={styles.message}>
        {status === 'success' ? 'Payment Successful!' : 'Payment Failed!'}
      </Text>

      {status === 'success' ? (
        <Text style={styles.details}>Amount Paid: ${totalAmount}</Text>
      ) : (
        <Text style={styles.details}>Please try again.</Text>
      )}

      <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  details: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});

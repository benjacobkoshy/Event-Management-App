import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BookingScreen from '../../Screens/CustomerScreen/BookingScreen';
// import PaymentScreen from '../../Screens/Payment/PaymentScreen';

export default function BookingNavigation() {

    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
        <Stack.Screen name='Booking Screen' component={BookingScreen} 
            options={{
                headerShown: false
            }}
        />
        
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})
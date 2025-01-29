import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../Screens/AuthScreens/LoginScreen'
import SignUpScreen from '../Screens/AuthScreens/SignUpScreen'
import HomeScreen from '../Screens/CustomerScreen/HomeScreen'
import TermsAndCondition from '../Screens/AuthScreens/TermsAndCondition'


const Stack = createNativeStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator
        options={{
        
        }}
    >
        <Stack.Screen name='Login' component={LoginScreen} 
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen name='SignUp' component={SignUpScreen} 
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen name='Terms And Conditions' component={TermsAndCondition} 
            options={{
                headerShown: false
            }}
        />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})
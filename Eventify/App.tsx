import { StyleSheet, View } from 'react-native'
import React from 'react'
import { AuthProvider } from './src/context/AuthContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import RootNavigation from './src/Navigation/RootNavigation';

export default function App() {
  return (

      <AuthProvider>
        <StripeProvider publishableKey="public key">
          <RootNavigation />
        </StripeProvider>
        
      </AuthProvider>

  )
}

const styles = StyleSheet.create({})
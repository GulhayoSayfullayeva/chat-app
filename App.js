import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Start from "./components/Start";
import Chat from './components/Chat';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {initializeApp} from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import { useNetInfo } from '@react-native-community/netinfo';

// create navigator
const stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyCAe3x3j1KDRbEOe6iKQLB7627OtTrz5D4",
  authDomain: "shopping-list-644bf.firebaseapp.com",
  projectId: "shopping-list-644bf",
  storageBucket: "shopping-list-644bf.appspot.com",
  messagingSenderId: "427206698890",
  appId: "1:427206698890:web:60cbd3d2d62dd8dd5eca73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

export default function App() {
  const connectionStatus = useNetInfo();
  return (
    <NavigationContainer>
      <stack.Navigator
        initialRouteName='Start'
      >
        <stack.Screen
         name='Start'
         component={Start}
         />
        <stack.Screen
        name='Chat'
        > 
        {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </stack.Screen>
      </stack.Navigator>
    </NavigationContainer>
  )
}


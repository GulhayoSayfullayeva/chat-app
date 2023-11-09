import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Platform, KeyboardAvoidingView, Alert } from "react-native";
import { addDoc, collection, disableNetwork, enableNetwork, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, isConnected, db, storage}) => {
  const username = route.params.name;
  const color = route.params.color;
  const id = route.params.id;

  const [messages, setMessages] = useState([]);
  let message;
  // Title for the screen
  useEffect(() => {
    navigation.setOptions({ title: username });
    if (isConnected === true) {
      enableNetwork(db);
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      message = onSnapshot(q,
        async (documentSnapshot) => {
          let newMessages = [];
          documentSnapshot.forEach(doc => {
            newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) })
          });
          cashMessages(newMessages);
          setMessages(newMessages);
        })
    }
    else {
      Alert.alert('Connection lost');
      disableNetwork(db);
      loadCashedMessages();
    }



    return () => {
      if (message) message();
    }
  }, [isConnected]);
  // Function to send message
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  }
  // Function to change the background color of the messages
  const renderBubble = (props) => {
    return <Bubble {...props}
      wrapperStyle={{
        left: {
          backgroundColor: 'white',
        },
        right: {
          backgroundColor: 'green',
        }
      }}

    />;
  }

  // Function in order to hide input and send button for the chat when offline
  const renderInput = (props) => {
       if(isConnected) return <InputToolbar {...props} />;
       else return null;
  }
  // Function in order to customize the actions
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={id} {...props}/>;
  }

  const renderCustomView = (props) => {
    const {currentMessage} = props;
    if (currentMessage.location) {
      return (
        <MapView
        style={{width: 150,
          height: 100,
          borderRadius: 13,
          margin: 3}}
        region={{
          latitude: currentMessage.location.latitude,
          longitude: currentMessage.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      );
    }
    return null;
  }
  // Function to load messages from cashe if there is no connection
  const loadCashedMessages = async () => {
    const cashedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cashedMessages));
  }

  // Function to save messages into cashe when connection in on
  const cashMessages = async (messagestoCash) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagestoCash));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInput}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        user={{
          _id: id,
          name: username,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

}

);
export default Chat;
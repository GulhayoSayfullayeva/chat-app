import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { Platform, KeyboardAvoidingView } from "react-native";


const Chat = ({ route, navigation }) => {
  const username = route.params.name;
  const color = route.params.color;

  const [messages, setMessages] = useState([]);

  // Title for the screen
  useEffect(() => {
    navigation.setOptions({ title: username });
    setMessages([
      {
        _id: 1,
        text: 'Hello Developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React User',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'System message',
        createdAt: new Date(),
        system: true,
      },
    ])
  }, []);
  // Function to send message
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
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
  return (
    <View style={[styles.container, {backgroundColor: color}]}> 
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1
        }}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
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
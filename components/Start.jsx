
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Chat from './Chat';

const Start = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [background, setBackground] = useState('white');
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  return (
    // Background image for the whole screen
    <ImageBackground source={require("../assets/BackgroundImage.png")} style={styles.container}>


      <Text style={styles.title}>CHAT APP</Text>
      <View style={styles.content}>
        <TextInput
          placeholder='Your name'
          style={styles.input}
          onChangeText={(val) => setUsername(val)}
        />
        <Text style={styles.text}>Choose your background color:</Text>
        <View style={styles.colorlist}>
          {colors.map((color, index) => (
            <TouchableOpacity key={index} style={[styles.box, { backgroundColor: color }, background === color && styles.selected,]} onPress={() => setBackground(color)} />
          ))}
        </View>                                                           
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { name: username, color: background })}>
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>


      </View>

    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  content: {
    width: '88%',
    height: '44%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  input: {
    width: '88%',
    borderWidth: 1,
    padding: 15,
    margin: 10,
    borderColor: 'black',
    fontSize: 16,
    fontWeight: '600',
    color: '#757083',
    marginTop: 20,
  },
  colorlist: {
    flexDirection: 'row',
  },
  box: {
    width: 30,
    height: 30,
    margin: 10,
    borderRadius: 15,
  },
  button: {
    width: '88%',
    margin: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#757083',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 10,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 70,
  },
  selected: {
    borderWidth: 1,
    borderColor: 'red',
  },
});

export default Start;

import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";



const Chat = ({route, navigation}) => {
    const username = route.params.name;
    const color = route.params.color;
   // Title for the screen
    useEffect(() => {
        navigation.setOptions({title: username});
    }, []);
    return (
      <View style={[styles.container, {backgroundColor: color,}]}>
        <Text style={{color: 'white'}}>Hello {username}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

}

);
export default Chat;
import { TouchableOpacity, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, storage, onSend, userID }) => {

    const actionSheet = useActionSheet();
    // Generate reference to the image in order to upload
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) { //image processsed
                const imageURI = result.assets[0].uri;
                uploadAndSendImage(imageURI);
            }
            else {
                Alert.alert('Permission is not granted');
            }

        };
    }
    const takePhoto = async () => {
        let permisssions = await ImagePicker.requestCameraPermissionsAsync();
        if (permisssions.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert('Permission is denied');
        }
    }

    const uploadAndSendImage = async (image) => {
        const response = await fetch(image);
        const reference = generateReference(image);
        const blob = await response.blob();
        const newRef = ref(storage, reference);
        uploadBytes(newRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref);
            onSend({ image: imageURL });
        });
    }
    const sendLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if( permissions.granted ) {
            const location = await Location.getCurrentPositionAsync({});
            if ( location ){
                onSend ({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            }
            else Alert.alert('Error while fetching location');
        }
        else Alert.alert('Permission is denied');
    }
    const onActionpressed = () => {
        const options = ['Choose from Library', 'Take a photo', 'Send location', 'Cancel'];
        const cancelButtonIndex = options.entries - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        sendLocation();
                        return;
                    default:
                }
            },
        );
    };
    return (
        <TouchableOpacity style={styles.container} onPress={onActionpressed}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        width: 25,
        height: 25,
    },
    wrapper: {
        borderRadius: 10,
        flex: 1,
        borderColor: 'grey',
        borderWidth: 1,
    },
    iconText: {
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color: 'grey',
    },
});
export default CustomActions;

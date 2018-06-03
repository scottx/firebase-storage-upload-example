import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Constants, ImagePicker } from 'expo';
import { Constants, DocumentPicker } from 'expo';
import uuid from 'uuid';
import * as firebase from 'firebase';

console.disableYellowBox = true;

// const url = 'https://firebasestorage.googleapis.com/v0/b/blobtest-36ff6.appspot.com/o/Obsidian.jar?alt=media&token=93154b97-8bd9-46e3-a51f-67be47a4628a';

/* const firebaseConfig = {
  apiKey: 'AIzaSyAlZruO2T_JNOWn4ysfX6AryR6Dzm_VVaA',
  authDomain: 'blobtest-36ff6.firebaseapp.com',
  databaseURL: 'https://blobtest-36ff6.firebaseio.com',
  storageBucket: 'blobtest-36ff6.appspot.com',
  messagingSenderId: '506017999540',
}; */

const firebaseConfig = {
  // messagingSenderId: '506017999540',
  apiKey: "AIzaSyA_A3i0evsHTlXeXzX3XNAbvprh-w4VOMM",
  authDomain: "spotify2-c40cc.firebaseapp.com",
  databaseURL: "https://spotify2-c40cc.firebaseio.com/",
  storageBucket: "spotify2-c40cc.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  state = {
    music: null,
    uploading: false,
  };

  render() {
    let { music } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {music ? null : (
          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              textAlign: 'center',
              marginHorizontal: 15,
            }}>
            Example: Upload ImagePicker result
          </Text>
        )}

        <Button
          onPress={this._pickMusic}
          title="Pick an image from camera roll"
        />

        {/* <Button onPress={this._takePhoto} title="Take a photo" /> */}

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" />
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { music } = this.state;
    if (!music) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}>

        <Text
          onPress={this._copyToClipboard}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
          {music}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.music,
      title: 'Check out this photo',
      url: this.state.music,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.music);
    alert('Copied music URL to clipboard');
  };
/* 
  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };
 */
  _pickMusic = async () => {
    let pickerResult = await DocumentPicker.getDocumentAsync({
      type: 'audio/*'
    });

    this._handleMusicUploaded(pickerResult);
  };

  _handleMusicUploaded = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        console.log(pickerResult.uri);
        this.setState({ music: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());

  const snapshot = await ref.put(blob);
  return snapshot.downloadURL;
}

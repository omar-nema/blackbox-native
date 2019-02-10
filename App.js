import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, ActivityIndicator, AppRegistry} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
import Header from './assets/js/Header'
import HomeScreen from './assets/js/HomeScreen'
import AudioButtons from './assets/js/AudioButtons'
import ShareConfirmation from './assets/js/ShareConfirmation'
import AudioWidget from './assets/js/AudioWidget'
import aws_exports from './aws-exports';

import Amplify, { Storage }  from 'aws-amplify';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.recording = null;
    this.state = {
      pageState: 'intro',
      audioState: null, //init, pause, play, etc
      fontLoaded: false,
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    }
    // this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY;
  }


 componentDidMount() {
   (async () => {
    await Font.loadAsync({
      'KarlaRegular': require('./assets/fonts/Karla-Regular.ttf'),
      'KarlaBold': require('./assets/fonts/Karla-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
  })();
  this.askForPermissions();
 }

 askForPermissions = async () => {
   const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
   this.setState({
     haveRecordingPermissions: response.status === 'granted',
   });
  if (response.status != 'granted') {
    throw new Error('We cannot proceed without audio permissions! Please re-launch the application and grant permission.');
  }
 };

 //NAVIGATION FUNCTIONS
  navPageRecord = () => {
    this.setState({pageState: 'record', audioState: 'init'});
  }
  navPageConfirmation = () =>  {
    this.audioPlayToggle();
    this.setState({pageState: 'shareConfirmation'});
  }
  navPageListen = () => {
    this.stopAudio();
    this.setState({pageState: 'listen', audioState: 'init'})
  }
  navPageHome = () => {
    this.setState({pageState: 'intro'})
  }
  navPageBack = () => {
    if (this.state.pageState == 'record'){
      this.setState({pageState: 'intro'});
    } else if (this.state.pageState == 'shareConfirmation'){
      this.setState({pageState: 'record'});
    }
  }


  recordToggle = async () => {
    this.setState({isLoading: true});
    if (this.recording){ //PAUSE ME
      if (this.state.audioState == 'playing'){
        await this.recording.pauseAsync(); //pause
      }
      else { //resume
        await this.recording.startAsync();
        this.setState({
          isLoading: false,
          audioState: 'playing'
        });
      }
    } else { //INITIALIZE AND RECORD
      this.setState({isLoading: true});
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: true,
      });
      if (this.recording !== null) { //if in playback mode?
        this.recording.setOnRecordingStatusUpdate(null);
        this.recording = null;
      }
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(this.recordingSettings);

      this.recording = recording;
      await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the
      await recording.setOnRecordingStatusUpdate(this.updateTimer);
      this.setState({
        isLoading: false,
      });
    }
  }


  listenToggle = async () => {

    console.log('errmmmmm')

    Storage.list('public/uploaded')
      .then(result => console.log(result))
      .catch(err => console.log(err));

    // Storage.get('test.txt')
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err));
  }

   audioPlayToggle = async () => {

      if (this.state.pageState == 'record'){
        this.recordToggle();
      }
      else if (this.state.pageState == 'listen'){
        this.listenToggle();
      }

  }
  audioRestart = async () => {
    // this.setState({
    //   isLoading: true,
    // });
    await this.recording.stopAndUnloadAsync();
    this.recording = null;

  }

  //only for recoridng. pass prop for time
  updateTimer = status => {
    if (status.error) {
     console.log(`FATAL PLAYER ERROR: ${status.error}`);
   }
   if (status.canRecord) {
     this.setState({
       soundDuration: status.durationMillis,
       soundPosition: status.positionMillis,
       shouldPlay: status.shouldPlay,
       isPlaying: status.isPlaying,
       rate: status.rate,
       muted: status.isMuted,
       volume: status.volume,
       shouldCorrectPitch: status.shouldCorrectPitch,
       isPlaybackAllowed: true,
     });
     if (status.isRecording) {
       this.setState({
         audioState: 'playing'
       })
     } else {
       this.setState({
         audioState: 'paused'
       })
     }
   } else {
     this.setState({
        audioState: 'init'
        , soundDuration: null
        , soundPosition: null
        , isPlaybackAllowed: false
      });
   }
  }

   //needs to be revised
   audioReplay = () => {
     this.setState({audioState: 'init'})
   }

  //PAGE AND COMPONENT RENDER FUNCTIONS
  renderPageIntro = () => {
    if (this.state.pageState == 'intro'){
      return (
        <HomeScreen onTouch={this.navPageRecord}></HomeScreen>
      )
    }
  }

  stopAudio = async () => { //called on first share btn click
    if (this.recording){
      this.setState({isLoading: true});
      await this.recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: true,
      });
      const info =  await FileSystem.getInfoAsync(this.recording.getURI());
      await this.recording.setOnRecordingStatusUpdate(null);
      infoURI = info.uri;
      var fileName = infoURI.substr(infoURI.lastIndexOf('/') + 1);
      const response = await fetch(infoURI); //get the actual audio file
      console.log(response.status)
      const blob = await response.blob();
      await Storage.put(fileName, blob)
        // .then (result => console.log(result)) // {key: "test.txt"}
        .catch(err => console.log(err));
      this.setState({isLoading: false});
    }
  }

  renderPageShareConfirmation = () =>  {
    if (this.state.pageState == 'shareConfirmation'){
      return (
        <ShareConfirmation navPageHome={this.navPageHome} navPageListen={this.navPageListen}/>
      )
    }
  }

  renderCompAudioButtons = () =>  {
    if (this.state.pageState == 'record' || this.state.pageState == 'listen' ){
      return (
        <AudioButtons
        pageState={this.state.pageState}
        audioState={this.state.audioState}
        audioPlayToggle={this.audioPlayToggle}
        audioRestart={this.audioRestart}
        audioReplay={this.audioReplay}
        shareConfirmation={this.shareConfirmation}
        navPageHome={this.navPageHome} navPageConfirmation={this.navPageConfirmation}
        />
      )
    }
  }
  renderCompHeader = () => {
    if (this.state.pageState != 'intro'){
      return <Header navPageBack={this.navPageBack} pageState={this.state.pageState}></Header>;
    }
  }
  renderCompAudioWidget = () => {
    if (this.state.pageState == 'record' || this.state.pageState == 'listen'){
      return audioWidget = <AudioWidget pageState={this.state.pageState} audioState={this.state.audioState} soundDuration={this.state.soundDuration}/>;
    }
  }
  renderLoadingSpinner = () => {
    if (this.state.isLoading){
      return <View style={styles.spinnerHolder}>
        <ActivityIndicator animating={false} color='#656060' style={styles.spinner} size="large" />
      </View>
    }
  }

  render() {
    return (
      <View>
        {
          this.state.fontLoaded ? (
            <View style={styles.appContainer}>
              {this.renderLoadingSpinner()}
              <View style={styles.appHeader}>
                {this.renderCompHeader()}
              </View>
              <View style={styles.componentHolder}>
                {this.renderPageIntro()}
                {this.renderCompAudioButtons()}
                {this.renderPageShareConfirmation()}
              </View>
              <View style={styles.appFooter}>
                {this.renderCompAudioWidget()}
              </View>
            </View>
          ) : null
        }
      </View>
    );
  }
}

AppRegistry.registerComponent('App', () => App)

const styles = StyleSheet.create({
  appContainer : {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  componentHolder: {
    maxWidth: 500,
    width: '80%',
  },
  appFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  appHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  spinnerHolder: {
    position: 'absolute',
    top: '45%',
    zIndex: 500000,
  },
  spinner: {
    zIndex: 500000,
  },
});



//

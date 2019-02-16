import React from 'react';
import { Animated, StyleSheet, NativeModules, LayoutAnimation, Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, ActivityIndicator, AppRegistry} from 'react-native';
import Expo, {Haptic, Constants,  Asset, Audio, FileSystem, Font, Permissions } from 'expo';
import Header from './assets/js/Header';
// import DeviceInfo from 'react-native-device-info';
import HomeScreen from './assets/js/HomeScreen';
import AudioButtons from './assets/js/AudioButtons';
import ShareConfirmation from './assets/js/ShareConfirmation';
import AudioWidget from './assets/js/AudioWidget';
import aws_exports from './aws-exports';
import Amplify, { Storage, Auth}  from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);
import { api } from "./assets/services/dbServices.js";

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.recording = null;
    this.soundObject = null;
    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY;
    this.state = {
      pageState: 'intro',
      audioState: null, //init, pause, play, etc
      fontLoaded: false,
      haveRecordingPermissions: false,
      isLoading: false,
      soundPosition: null,
      soundDuration: null,
      fontLoaded: false,

    }
  };
 componentDidMount() {
   (async () => {
    await Font.loadAsync({
      'KarlaRegular': require('./assets/fonts/Karla-Regular.ttf'),
      'KarlaBold': require('./assets/fonts/Karla-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
  })();
  this.askForPermissions();
};
 askForPermissions = async () => {
   const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
   this.setState({
     haveRecordingPermissions: response.status === 'granted',
   });
  if (response.status != 'granted') {
    throw new Error('We cannot proceed without audio permissions! Please re-launch the application and grant permission.');
  }
 };

 animatePageTransition = () => {
   LayoutAnimation.easeInEaseOut();
 }


 //NAVIGATION FUNCTIONS
  navPageRecord = () => {
    this.animatePageTransition();
    this.setState({pageState: 'record', audioState: 'init'});
  }
  navPageConfirmation = () =>  {
    this.recordToggle();
    this.animatePageTransition();
    this.setState({pageState: 'shareConfirmation'});
  }
  navPageListen = () => {
    this.stopAudio();
    this.animatePageTransition();
    this.setState({pageState: 'listen', audioState: 'init', soundDuration: null, soundPosition: null})
  }
  navPageHome = async () => {
    if (this.recording){
       await this.recording.stopAndUnloadAsync();
       this.recording = null;
    }
    if (this.soundObject){
      this.soundObject.unloadAsync();
      this.soundObject = null;
    }
    this.animatePageTransition();
    this.setState({pageState: 'intro'})
  }
  navPageBack = () => {
    if (this.state.pageState == 'record'){
      this.animatePageTransition();
      this.navPageHome();
    } else if (this.state.pageState == 'shareConfirmation'){
      this.animatePageTransition();
      this.setState({pageState: 'record'});
    }
  }

    //AUDIO FUNCTIONS!
  recordToggle = async () => {
    if (this.recording){ //PAUSE ME
      if (this.state.audioState == 'playing'){
        await this.recording.pauseAsync();
      }
      else { //resume
        await this.recording.startAsync();
        this.setState({
          isLoading: false,
        });
      }
    } else { //INITIALIZE AND RECORD
      //Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
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
      await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to
      await recording.setOnRecordingStatusUpdate(this.updateTimer);
      this.setState({
        isLoading: false,
      });
    }
  }



  listenToggle = async () => {
      if (this.soundObject){
        if (this.state.audioState == 'playing'){
          await this.soundObject.pauseAsync();
        } else {
          await this.soundObject.playAsync();
        }
      } else {
        //Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
        this.setState({
          isLoading: true,
        });
        //REQUEST AND PLAY RANDOM FILE
        const newSoundURL = await Storage.get('uploaded/torotester.mp3');
        // const unplayedList = await api.getRandomFile(Constants.deviceId);
        // const unplayedListItems  = unplayedList.Items;
        // const randIndex = Math.round(Math.random()*(unplayedListItems.length - 1));
        // const randFileKey = unplayedListItems[randIndex].fileId;
        // const randFilePath = 'public/uploaded/' + randFileKey;
        ///const newSoundURL = await Storage.get(randFilePath);
        const soundObject = new Audio.Sound();
        this.soundObject = soundObject;
        soundObject.setOnPlaybackStatusUpdate(this.updateTimer);
        await soundObject.loadAsync({uri: newSoundURL}, this.updateTimer)
        await soundObject.playAsync();

        //LOG THAT FILE WAS ACCESSED
        // await api.logAccessedFile(randFileKey, Constants.installationId)
        // this.setState({isLoading: false})
      }
    }
   audioPlayToggle = async () => {
     ////Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
      if (this.state.pageState == 'record'){
        this.recordToggle();
      }
      else if (this.state.pageState == 'listen'){
        this.listenToggle();
      }
  }

  stopAudio = async () => {
    if (this.recording){ //note, no loading spinner. happens in background
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
      const fileWithoutPath = infoURI.substr(infoURI.lastIndexOf('/') + 1);
      var filePath = 'uploaded/' + fileWithoutPath;
      const response = await fetch(infoURI); //get the actual audio file
      const blob = await response.blob();
      await Storage.put(filePath, blob)
      .then(result => {
           // console.log(result)
      })
      .catch(err => console.log(err));
      // this.recording = null;
      //
      // api.uploadFile(infoURI)

      // fetch(infoURI)
      // .then(response => response.blob())
      // .then(Buffer => Storage.put(filePath, Buffer, {contentType: 'audio/x-caf'}))
      // .then(x => console.log('SAVED AUDIO', x) || x)
      // .catch(err => console.log("AUDIO UPLOAD ERROR", err));

        this.recording = null;

      //api.logAccessedFile(fileWithoutPath, Constants.installationId)

        //sound can play
        // const soundObject = new Audio.Sound();
        // this.soundObject = soundObject;
        // soundObject.setOnPlaybackStatusUpdate(this.updateTimer);
        // await soundObject.loadAsync({uri: '/uploaded/recording-9C1311BC-D15B-4405-9D20-631BFB5C487C.caf'}, this.updateTimer)
        // await soundObject.playAsync();



    }
  }
  audioReplay = async () => {
    ////Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
    await this.soundObject.setPositionAsync(0);
    await this.soundObject.pauseAsync();
    this.setState({audioState: 'init'});
  }
  audioRestart = async () => {
    ////Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
    await this.recording.stopAndUnloadAsync();
    this.recording = null;
  }
  updateTimer = status => {
    if (status.error) {
     console.log(`FATAL PLAYER ERROR: ${status.error}`);
   }
   if (status.canRecord) {
     this.setState({
       soundPosition: status.durationMillis,
       // shouldPlay: status.shouldPlay,
       // isPlaying: status.isPlaying,
       // rate: status.rate,
       // muted: status.isMuted,
       // volume: status.volume,
       // shouldCorrectPitch: status.shouldCorrectPitch,
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
   }
   else if (status.isLoaded){
     this.setState({
       soundDuration: status.durationMillis,
       soundPosition: status.positionMillis,
       // isPlaying: status.isPlaying,
       // rate: status.rate,
       // muted: status.isMuted,
       // volume: status.volume,
       // shouldCorrectPitch: status.shouldCorrectPitch,
     })
     if (status.isPlaying) {
       this.setState({
         audioState: 'playing',
       })
     }
     else if (status.isPlaying == false && status.positionMillis > 0) {
       this.setState({audioState: 'paused'})
     }
   }
   else { //when things are unloaded this resets timer n stuff
     this.setState({
        audioState: 'init'
        , soundDuration: null
        , soundPosition: null
      });
   }
  }

  //PAGE AND COMPONENT RENDER FUNCTIONS
  renderPageIntro = () => {
    if (this.state.pageState == 'intro'){
      return (
        <HomeScreen onTouch={this.navPageRecord}></HomeScreen>
      )
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
        navPageHome={this.navPageHome}
        navPageConfirmation={this.navPageConfirmation}
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
      return audioWidget = <AudioWidget pageState={this.state.pageState} audioState={this.state.audioState} soundPosition={this.state.soundPosition}/>;
    }
  }
  renderLoadingSpinner = () => {
    if (this.state.isLoading){
      return <View style={styles.spinnerHolder}>
        <ActivityIndicator animating={true} color='#656060' style={styles.spinner} size="large" />
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

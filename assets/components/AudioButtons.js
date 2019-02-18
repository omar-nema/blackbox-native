import React from 'react';
import { Animated, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
// import { AppText }  from '../assets/components/nested/AppText';
import { ButtonAudio }  from './nested/ButtonAudio';

class AudioButtons extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      pageOpacity: new Animated.Value(1.0),
    }
  }

  getPauseButtonText = () => {
    if (this.props.pageState == 'record' && this.props.audioState == 'init'){
      return 'Record';
    } else if  (this.props.pageState == 'listen' && (this.props.audioState == 'init' || this.props.audioState == 'complete')){
      return 'Listen'
    }
    else if (this.props.audioState == 'playing'){
      return 'Pause';
    } else if (this.props.audioState == 'paused'){
      return 'Resume';
    }
  }
  getShareButtonText = () => {
    if (this.props.pageState == 'record'){
        return 'Share'
    } else if (this.props.pageState == 'listen'){
        return 'Replay'
    }
  }
  getShareButtonFunction = () => {
    if (this.props.pageState == 'record'){
        return this.props.navPageConfirmation;
    } else if (this.props.pageState == 'listen'){
        return this.props.audioReplay;
    }
  }
  getRestartButtonText = () => {
    if (this.props.pageState == 'record'){
        return 'Restart'
    } else if (this.props.pageState == 'listen'){
        return 'Exit'
    }
  }
  getRestartButtonFunction = () => {
    if (this.props.pageState == 'record'){
        return this.props.audioRestart;
    } else if (this.props.pageState == 'listen'){
        return this.props.navPageHome;
    }
  }
  getLoadingInd = () => {
    if (this.props.isLoading == true){
      Animated.timing(
        this.state.pageOpacity, {toValue: 0.6, duration: 100}
      ).start();
      return {opacity: this.state.pageOpacity};
    }
    else {
      Animated.timing(
        this.state.pageOpacity, {toValue: 1.0, duration: 100}
      ).start();
      return {opacity: this.state.pageOpacity};
    }
  }

  render(){
    return (
      <View>
        <Animated.View style={this.getLoadingInd()}>
          <ButtonAudio onTouch={this.props.audioPlayToggle} buttonStyle={this.getPauseButtonText()} audioState={this.props.audioState}>
            {this.getPauseButtonText()}
          </ButtonAudio>
          <ButtonAudio onTouch={this.getShareButtonFunction()} buttonStyle={this.getShareButtonText()} audioState={this.props.audioState}>
            {this.getShareButtonText()}
          </ButtonAudio>
          <ButtonAudio onTouch={this.getRestartButtonFunction()} buttonStyle={this.getRestartButtonText()} audioState={this.props.audioState}>
            {this.getRestartButtonText()}
          </ButtonAudio>
        </Animated.View>
      </View>
    )
  }
}


export default AudioButtons;

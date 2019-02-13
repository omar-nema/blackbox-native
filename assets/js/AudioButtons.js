import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
// import { AppText }  from '../styleComponents/AppText';
import { ButtonAudio }  from '../styleComponents/ButtonAudio';

class AudioButtons extends React.Component {
  getPauseButtonText = () => {
    if (this.props.pageState == 'record' && this.props.audioState == 'init'){
      return 'Record';
    } else if  (this.props.pageState == 'listen' && this.props.audioState == 'init'){
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

  render(){
    return (
      <View>
        <ButtonAudio animate={true} onTouch={this.props.audioPlayToggle} buttonStyle={this.getPauseButtonText()} audioState={this.props.audioState}>
          {this.getPauseButtonText()}
        </ButtonAudio>
        <ButtonAudio onTouch={this.getShareButtonFunction()} buttonStyle={this.getShareButtonText()} audioState={this.props.audioState}>
          {this.getShareButtonText()}
        </ButtonAudio>
        <ButtonAudio onTouch={this.getRestartButtonFunction()} buttonStyle={this.getRestartButtonText()} audioState={this.props.audioState}>
          {this.getRestartButtonText()}
        </ButtonAudio>
      </View>

    )
  }
}

export default AudioButtons;

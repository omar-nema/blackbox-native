import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { colors }  from '../components/Variables';

class AudioWidget extends React.Component {
    getAudioStateText = () => {
      if (this.props.audioState == 'playing' && this.props.pageState == 'record'){
        return ['Recording', styles.textAudioStateRecording];
      } else if (this.props.audioState == 'playing' && this.props.pageState == 'listen'){
        return ['Listening', styles.textAudioStateListening];
      } else if (this.props.audioState == 'paused'){
        return ['Paused', styles.textAudioStatePaused];
      } else {
        return ['Not playing', styles.textAudioStateNotPlaying];
      }
    }

    getAudioTime = () => {
      if (this.props.soundPosition && this.props.audioState != 'complete'){
        return Math.round(this.props.soundPosition/1000) + ' seconds';
      } else {
        return '0 seconds'
      }

    }

  render() {
    return (
        <View style={styles.widgetContainer}>
          <View style={styles.widgetCentered}>
            <Text style={[styles.textWidget, this.getAudioStateText()[1]]}>
              {this.getAudioStateText()[0]}
            </Text>
            <Text style={[styles.textWidget, styles.textAudioTimer]}>
              {this.getAudioTime()}
            </Text>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({

  widgetContainer: {
    backgroundColor: '#0E0E0E',
    borderTopWidth: 1,
    borderColor: colors.grayBorder,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  }
  ,widgetCentered: { //same as componentHolder
    justifyContent: 'space-between',
    maxWidth: 500,
    width: '80%',
    flexDirection: 'row',
  }
  ,textWidget: {
    fontSize: 22,
    fontFamily: 'KarlaRegular',
  }
  ,textAudioStateNotPlaying: {
    color: colors.gray,
  },
  textAudioStatePaused: {
    color: colors.yellow,
  },
  textAudioStateRecording: {
    color: colors.green,
  },
  textAudioStateListening: {
    color: colors.green,
  },
  textAudioTimer: {
    color: colors.gray,
    opacity: .7,
  }
})

export default AudioWidget;

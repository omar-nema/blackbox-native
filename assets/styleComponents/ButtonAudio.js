import React from 'react';
import { Animated, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import { colors }  from '../styleComponents/Variables';

export class ButtonAudio extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      animateButtonScale: new Animated.Value(1.15),
      disabled: false,
    }
  }

  getButtonStylesGeneral = () => {
    if (this.props.buttonStyle == 'Record' || this.props.buttonStyle == 'Listen'){
      return [[styles.buttonCore, styles.buttonGreen], [styles.buttonText, styles.buttonGreenText]];
    }
    else if (this.props.buttonStyle == 'Pause' || this.props.buttonStyle == 'Resume' ){
      return [[styles.buttonCore, styles.buttonYellow], [styles.buttonText, styles.buttonYellowText]];
    } else if (this.props.buttonStyle == 'Share' || this.props.buttonStyle == 'Replay'){
      return [[styles.buttonCore, styles.buttonGreen], [styles.buttonText, styles.buttonGreenText]];
    } else if (this.props.buttonStyle == 'Restart' || this.props.buttonStyle == 'Exit'){
      return [[styles.buttonCore, styles.buttonRed], [styles.buttonText, styles.buttonRedText]];
    }
  }


  getButtonStylesState = () => {
    if (this.props.audioState == 'init'){
        if (this.props.buttonStyle == 'Record' || this.props.buttonStyle == 'Listen'){
          this.state.disabled = false;
          return styles.buttonHighlight
        } else {
          this.state.disabled = true;
          return styles.buttonDisabled;
        }
    } else if (this.props.audioState == 'playing'){
      if (this.props.animate){
        Animated.timing(
          this.state.animateButtonScale, {toValue: 1.0, duration: 200}
        ).start();
        return {transform: [{scaleX: this.state.animateButtonScale}, {scaleY: this.state.animateButtonScale}]};
      } else {
        this.state.disabled = false;
        return styles.buttonEnabled;
      }

    }
  }
  //should i be setting the styles as states instead
  render() {
    return (
      <Animated.View style={this.getButtonStylesState()}>
        <TouchableOpacity disabled={this.state.disabled} style={this.getButtonStylesGeneral()[0]} onPress={this.props.onTouch}>
          <Text style = {this.getButtonStylesGeneral()[1]}>
            {this.props.children}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
//react-native bug with changing opacity directly on button component
const styles = StyleSheet.create({
  buttonCore: {
    borderColor: '#73DDC8',
    borderWidth: 1,
    color: '#73DDC8',
    marginBottom: 20,
    borderWidth: 1,
    textAlign: 'center',
    backgroundColor: '#141414',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    opacity: 1,
    backgroundColor: colors.darkBackground,
  },
  // test: {
  //   transform: [
  //     { scaleX: this.props.animateButtonScale },
  //     { scaleY: 1.15 },
  //   ],
  // },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'KarlaRegular',
  },
  buttonHighlight: {
    transform: [
      { scaleX: 1.15 },
      { scaleY: 1.15 },
    ],
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonEnabled: {
    opacity: 0.9,
  },
  buttonGreen: {
    borderColor: colors.green,
  },
  buttonGreenText: {
    color: colors.green,
  },
  buttonYellow: {
    borderColor: colors.yellow,
  },
  buttonYellowText: {
    color: colors.yellow,
  },
  buttonRed: {
    borderColor: colors.red,
  },
  buttonRedText: {
    color: colors.red,
  },

})

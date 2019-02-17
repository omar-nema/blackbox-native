import React from 'react';
import {Animated, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import { colors }  from '../components/Variables';

export class ButtonAudio extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      animateButtonScale: new Animated.Value(1.15),
      animateButtonOpacity: new Animated.Value(0.3),
      animateButtonOpacityTop: new Animated.Value(1.0),
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


  animationTopShrink = () => {
    Animated.timing(
      this.state.animateButtonScale, {toValue: 1.0, duration: 300},
      this.state.animateButtonOpacityTop, {toValue: 1.0, duration: 300}
    ).start();
    return {opacity: this.state.animateButtonOpacityTop, transform: [{scaleX: this.state.animateButtonScale}, {scaleY: this.state.animateButtonScale}]};
  }
  animationTopExpand = () => {
    this.state.disabled = false;
     Animated.timing(
      this.state.animateButtonScale, {toValue: 1.15, duration: 300},
      this.state.animateButtonOpacityTop, {toValue: 1.0, duration: 300}
    ).start();
    return {opacity: this.state.animateButtonOpacityTop, transform: [{scaleX: this.state.animateButtonScale}, {scaleY: this.state.animateButtonScale}]};
  }
  animationTopDisable = () => {
    Animated.timing(
      this.state.animateButtonOpacityTop, {toValue: 0.3, duration: 300}
    ).start();
    this.state.disabled = true;
    return {opacity: this.state.animateButtonOpacityTop};
  }
  animationBottomEnable = () => {
    this.state.disabled = false;
    Animated.timing(
      this.state.animateButtonOpacity, {toValue: 0.9, duration: 300}
    ).start();
    return {opacity: this.state.animateButtonOpacity};
  }
  animationBottomDisable = () => {
    Animated.timing(
      this.state.animateButtonOpacity, {toValue: 0.3, duration: 300}
    ).start();
    this.state.disabled = true;
    return {opacity: this.state.animateButtonOpacity};
  }


  //better way to abstract ==
  //animateButtonOpacity
  //

  getButtonStylesState = () => {
    if (this.props.audioState == 'init'){
        if (this.props.buttonStyle == 'Record' || this.props.buttonStyle == 'Listen'){
          return this.animationTopExpand();
        } else {
          return this.animationBottomDisable();
        }
    }
    else if (this.props.audioState == 'playing'){
      if (this.props.buttonStyle == 'Record' || this.props.buttonStyle == 'Listen'){ ///CHANGE
        return this.animationTopShrink();
      } else {
        return this.animationBottomEnable();
      }
    }
    else if (this.props.audioState = 'complete'){
      if (this.props.buttonStyle == 'Listen'){
        return this.animationTopDisable();
      } else {
        return this.animationBottomEnable();
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

import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { Dialog }  from '../components/Dialog';
import { AppText }  from '../components/AppText';

class HomeScreen extends React.Component {


  render() {
    return (
      <View>
        <Dialog>
        'Blackbox' is another way of talking. Send a voice recording, and receive one back. Each recording is unique, and will only be played once.
        </Dialog>
        <ButtonStartExperience onTouch={this.props.onTouch}/>
      </View>
    );
  }
}

class ButtonStartExperience extends React.Component {
  render() {
    return (
      <TouchableOpacity underlayColor="white" onPress={this.props.onTouch}>
        <View style={styles.dialogActions}>
          <AppText>
            <Text style={styles.buttonBegin}>Start an exchange</Text>
          </AppText>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  dialogText: {
    color: '#9C9A9A',
    fontSize: 22,
  },
  dialogActions: {
    display: 'flex',
    borderColor: '#73DDC8',
    borderWidth: 1,
    textAlign: 'center',
    padding: 20,
  },
  buttonBegin: {
    color: '#73DDC8',
    textAlign: 'center',
    fontSize: 24,
  },
});


export default HomeScreen;

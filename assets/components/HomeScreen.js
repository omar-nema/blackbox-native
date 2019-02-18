import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { Dialog }  from './nested/Dialog';
import { AppText }  from './nested/AppText';
import { colors }  from './nested/Variables';

class HomeScreen extends React.Component {


  render() {
    return (
      <View>
        <Dialog>
        'Blackbox' is another way of talking.{"\n"}{"\n"}
        Send a voice recording, and receive one back. Each recording is unique, and will only be played once.
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
    color: colors.gray,
    fontSize: 22,
  },
  dialogActions: {
    display: 'flex',
    borderColor: colors.green,
    borderWidth: 1,
    textAlign: 'center',
    padding: 20,
    backgroundColor: colors.darkBackground,
  },
  buttonBegin: {
    color: colors.green,
    textAlign: 'center',
    fontSize: 24,
  },
});


export default HomeScreen;

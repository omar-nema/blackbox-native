import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { AppText }  from '../styleComponents/AppText';
import { colors }  from '../styleComponents/Variables';
import { Dialog }  from '../styleComponents/Dialog';

class ShareConfirmation extends React.Component {
  render() {
    return (
      <View>
        <Dialog>
        Confirm that you would like to share your recording. {"\n"}{"\n"}In exchange, you will receive an anonymous recording.
        </Dialog>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={this.props.navPageHome} style={styles.buttonCancel}>
            <Text style={[styles.buttonText,styles.textCancel]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.navPageListen} style={styles.buttonShare}>
            <Text style={[styles.buttonText,styles.textShare]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonHolder: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  }
  , buttonCancel: {
    borderColor: colors.gray,
    borderWidth: 1,
    backgroundColor: colors.darkbackground,
    padding: 20,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'KarlaRegular',
  },
  textCancel: {
    color: colors.gray,
  },
  buttonShare: {
    borderColor: colors.green,
    borderWidth: 1,
    backgroundColor: colors.darkbackground,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 60,
    paddingRight: 60,
    display: 'flex',
    // marginLeft: 10,
  }
  , textShare: {
    color: colors.green,
  }
})


export default ShareConfirmation;

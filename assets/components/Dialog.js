import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppText }  from '../components/AppText';
import { colors }  from '../components/Variables';

export class Dialog extends React.Component {
  render() {
    return (
      <View style={[styles.dialogContainer]}>
        <AppText>
          {this.props.children}
        </AppText>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dialogContainer: {
    borderWidth: .5,
    borderColor: '#9C9A9A',
    padding: 20,
    marginBottom: 30,
    borderRadius: 2,
    display: 'flex',
    fontSize: 20,
    padding: 20,
  },
});

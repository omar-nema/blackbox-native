import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export class AppText extends React.Component {
  render() {
    return (
      <Text style={{fontSize: 22, fontFamily: 'KarlaRegular', color: '#9C9A9A'}}>{this.props.children}</Text>
    );
  }
}

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Constants, Svg } from 'expo';

class Logo extends React.Component {

  render() {
    return (
      <View style={styles.container}>
      
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: '100%',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
  }
})


export default Logo;

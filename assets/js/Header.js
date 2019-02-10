import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { colors }  from '../styleComponents/Variables';
import { AppText }  from '../styleComponents/AppText';

class Header extends React.Component {

  //record, arrow, listen
  getBreadcrumbStyle = () => {
    if (this.props.pageState == 'record'){
      return [styles.active, styles.neutral, styles.neutral];
    } else if (this.props.pageState == 'listen'){
      return [styles.neutral, styles.neutral, styles.active];
    } else if (this.props.pageState == 'shareConfirmation'){
      return [styles.active, styles.active, styles.neutral];
    } else {
      return [styles.disabled, styles.disabled, styles.disabled];
    }
  };
  //
  renderBackButton = () => {
    let backText = '< back';
    if (this.props.pageState != 'listen'){
      return <TouchableOpacity onPress={this.props.navPageBack}><Text style={styles.textBack}>{backText}</Text></TouchableOpacity>;
    }
  }

  render(){
    let navChar = '> '
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerCentered}>
          <View style={styles.breadCrumbs}>
            <Text style={[styles.breadcrumbText, this.getBreadcrumbStyle()[0]]}>record</Text>
            <Text style={[styles.breadcrumbText,this.getBreadcrumbStyle()[1]]}>{navChar}</Text>
            <Text style={[styles.breadcrumbText,this.getBreadcrumbStyle()[2]]}>listen</Text>
          </View>
          <View style={styles.buttonObligatory}>
            {this.renderBackButton()}
          </View>
        </View>
      </View>
    )
  }
}

styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  }
  // ,buttonObligatory: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   backgroundColor: 'blue',
  // }
  ,headerCentered: {
    justifyContent: 'space-between',
    maxWidth: 500,
    width: '80%',
    flexDirection: 'row',
  },
  breadCrumbs: {
    display: 'flex',
    flexDirection: 'row',
  },
  breadcrumbText: {
    fontSize: 20,
    fontFamily: 'KarlaRegular',
    paddingRight: 10,
  },
  active: {
    color: 'white',
    opacity: 1,
  },
  neutral: {
    color: colors.gray,
    opacity: 0.8,
  },
  disabled: {
    display: 'none',
  },
  textBack: {
    color: colors.gray,
    fontSize: 20,
    fontFamily: 'KarlaRegular'
  }
})
//



// <div className='header'>
//   <div className='header-inner-container'>
//     <div className='header-content '>
//       <div className={this.getRecordClass()}>record</div>
//       <div className={this.getArrowClass()}>{navChar}</div>
//       <div className={this.getListenClass()}>listen</div>
//     </div>
//     {this.renderBackButton()}
//   </div>
// </div>

export default Header;

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  vue: {
    flex: 1
  }
});

class Vue extends Component {
  render() {
    return (
      <View style={styles.vue}>
        <Text> bachacha </Text>
      </View>
    )
  }
}

export default Vue;
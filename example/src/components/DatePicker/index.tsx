/**
 * title
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';

interface IState {
}

export default class DatePicker extends Component<IDatePickerProps, IState> {

  constructor(props: IDatePickerProps) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <SafeAreaView>
        <Text>DatePciker</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
});

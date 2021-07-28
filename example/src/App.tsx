/**
 * title
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';

interface IProps {
}

interface IState {
}

export default class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <SafeAreaView>
        <Text>App</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
});

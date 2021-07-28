import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Button, ImageBackground, SafeAreaView } from 'react-native';
import { layoutStyles } from './styles';
import { Picker } from './components';

interface IProps {
}

interface IState {
  visible: boolean;
  value: number[]
}

export default class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: true,
      value: [1],
    }
  }

  open = () => this.setState({ visible: true })

  onChange = (value) => {
    console.log("🚀 ~ file: App.tsx ~ line 27 ~ App ~ value", value)
    this.setState({ value: value[1] })
  }

  render() {
    const { visible, value } = this.state;
    return (
      <View style={layoutStyles.centralContainer}>
        <StatusBar />
        <Picker
          visible={visible}
          mode='selector'
          range={[[1, 2, 3, 4]]}
          value={value}
          onChange={this.onChange}
          renderPickerTop={() => <View style={{ height: 20, backgroundColor: 'red' }}><Text>renderPickerTop</Text></View>}
        // renderPickerBottom={() => <View style={{ height: 40, backgroundColor: 'red' }}><Text>renderPickerBottom</Text></View>}
        />
        <Text>App</Text>
        <Button title="open" onPress={this.open} color='red' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

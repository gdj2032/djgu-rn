import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Button, ImageBackground, SafeAreaView } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { layoutStyles, mixins } from './styles';
import { Picker, RotationCircleView } from './components';

const ParaData = [
  [
    {
      "name": "2015",
      "id": 11
    },
    {
      "name": "2016",
      "id": 12
    },
  ],
  [
    {
      "name": "july",
      "id": 201
    },
    {
      "name": "August",
      "id": 202
    }
  ],
  [
    {
      "name": "1st",
      "id": 2101
    }
  ]
]

interface IProps {
}

interface IState {
  visible: boolean;
  value: number[]
  range: number[][];
}

export default class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: false,
      // value: [1, 11],
      value: [0],
      range: [[1, 2, 3, 4], [1, 2, 3, 4]],
    }
  }

  open = () => this.setState({ visible: true })

  onChange = (val) => {
    console.log("🚀 ~ file: App.tsx ~ line 27 ~ App ~ value", val)
    // const { value } = this.state;
    // const v1 = val[0] === 0 ? val[1] : value[0];
    // const v2 = val[0] === 1 ? val[1] : value[1];
    // this.setState({ value: [v1, v2] })
    // this.setState({ value: [val[1]] })
    this.setState({ range: [[1, 2, 3, 4], [7, 8, 9, 0]] })
  }

  render() {
    const { visible, value, range } = this.state;
    return (
      <View style={layoutStyles.centralContainer}>
        <Picker
          visible={visible}
          mode='selector'
          range={[[1, 2, 3, 4], [7, 8, 9, 0]]}
          value={value}
          onChange={this.onChange}
          renderPickerTop={() => <View style={{ height: 20, backgroundColor: 'red' }}><Text>renderPickerTop</Text></View>}
          renderPickerBottom={() => <View style={{ height: 40, backgroundColor: 'red' }}><Text>renderPickerBottom</Text></View>}
        />
        <Button title="open" onPress={this.open} color='red' />
        {/* <RNPicker
          mode='dialog'
          style={{ height: 100, width: 150 }}
        >
          <RNPicker.Item label='11111' value='1'></RNPicker.Item>
          <RNPicker.Item label='22222' value='2'></RNPicker.Item>
        </RNPicker> */}
        {/* <RotationCircleView /> */}
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

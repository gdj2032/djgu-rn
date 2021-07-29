import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Button, ImageBackground, SafeAreaView } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { layoutStyles, mixins } from './styles';
import { Picker, RotationCircleView } from './components';

interface IProps {
}

interface IState {
  visible: boolean;
  value: string[];
  range: number[][];
}

export default class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: true,
      // value: [1, 11],
      value: ['2'],
      range: [[1, 2, 3, 4], [1, 2, 3, 4]],
    }
  }

  open = () => this.setState({ visible: true })

  onChange = (val) => {
    console.log('🚀 ~ file: App.tsx ~ line 31 ~ App ~ val', val)
    this.setState({ value: [val[1]] })
  }

  render() {
    const { visible, value, range } = this.state;
    return (
      <View style={layoutStyles.centralContainer}>
        <Picker
          visible={visible}
          data={[[{ id: '1', name: '浙江省' }, { id: '2', name: '江苏省' }, { id: '3', name: '上海市' }]]}
          value={value}
          onChange={this.onChange}
          head={() => <View style={{ height: 20, backgroundColor: 'red' }}><Text>head</Text></View>}
          foot={() => <View style={{ height: 40, backgroundColor: 'red' }}><Text>foot</Text></View>}
          height={mixins.zoom(200)}
        />
        <Button title='open' onPress={this.open} color='red' />
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
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

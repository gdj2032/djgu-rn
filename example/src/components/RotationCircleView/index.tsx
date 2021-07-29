/**
 * title
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Svg } from 'react-native-svg';
import { mixins } from '../../styles';
import Wedge from '../Wedge';

const OUT_CIRCLE_SIZE = mixins.zoom(300); //外圈圆的直径
const OUT_CIRCLE_SIZE_RADIUS = OUT_CIRCLE_SIZE / 2; //半径

const IN_CIRCLE_SIZE = mixins.zoom(150); //内圈圆的直径
const IN_CIRCLE_SIZE_RADIUS = IN_CIRCLE_SIZE / 2; //内圈圆的直径

const top_left = (OUT_CIRCLE_SIZE - IN_CIRCLE_SIZE) / 2;

interface IListInfo {
  id: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  value: string;
  position: string;
}

interface IProps {
}

interface IState {
  current: number;
  rotation1: number;
  rotation2: number;
}
export default class RotationCircleView extends Component<IProps, IState> {

  spinValue;

  constructor(props: IProps) {
    super(props)
    this.state = {
      current: 1,
      rotation1: 0,
      rotation2: 0,
    };
    this.spinValue = new Animated.Value(0)
  }

  onSelect = (item: IListInfo) => {
    const { current, rotation2 } = this.state;
    if (item.id === current) return;
    const r1 = rotation2;
    let r2 = rotation2;
    const num = item.id - current;
    if (num === 1) {
      // 顺时针转120
      r2 += 120;
    } else if (num === 2) {
      r2 += 240;
    } else if (num === -1) {
      r2 += 240;
    } else if (num === -2) {
      r2 += 120;
    }
    this.setState({ current: item.id, rotation1: r1, rotation2: r2 })
    this.spin(r2)
  }

  spin = (rotation2: number) => {
    this.spinValue.setValue(0)
    Animated.timing(this.spinValue, {
      toValue: 1, // 最终值 为1，这里表示最大旋转 360度
      duration: rotation2 === 120 ? 100 : 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  render() {
    const { current, rotation1, rotation2 } = this.state;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: [`${rotation1}deg`, `${rotation2}deg`] //输出值
    })
    const list: IListInfo[] = [
      {
        id: 1,
        startAngle: -60,
        endAngle: 60,
        fill: '#ffddff',
        value: '定时1',
        position: 'top',
      },
      {
        id: 2,
        startAngle: 180,
        endAngle: -60,
        fill: '#ccff44',
        value: '定数2',
        position: 'left_bottom',
      },
      {
        id: 3,
        startAngle: 60,
        endAngle: 180,
        fill: '#0044ff',
        value: '自由3',
        position: 'right_bottom',
      },
    ];
    return (
      <View style={[styles.containers]}>
        <Animated.View style={[{ transform: [{ rotate: spin }] }]}>
          <Svg width={OUT_CIRCLE_SIZE} height={OUT_CIRCLE_SIZE}>
            {
              list.map(e => {
                return (
                  <Wedge
                    key={e.id}
                    radius={OUT_CIRCLE_SIZE_RADIUS}
                    cx={OUT_CIRCLE_SIZE_RADIUS}
                    cy={OUT_CIRCLE_SIZE_RADIUS}
                    {...e}
                    onPress={() => this.onSelect(e)}
                    fontStyle={{ color: e.id === current ? 'red' : '', size: e.id === current ? 20 : 14 }}
                  />
                )
              })
            }
          </Svg>
        </Animated.View>
        <View style={styles.inCircleView}>
          <Text>内圈</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containers: {
    width: OUT_CIRCLE_SIZE,
    height: OUT_CIRCLE_SIZE,
    backgroundColor: 'pink',
    borderRadius: OUT_CIRCLE_SIZE_RADIUS,
    overflow: 'hidden'
  },
  inCircleView: {
    position: 'absolute',
    top: top_left,
    left: top_left,
    backgroundColor: 'white',
    borderRadius: IN_CIRCLE_SIZE_RADIUS,
    width: IN_CIRCLE_SIZE,
    height: IN_CIRCLE_SIZE,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

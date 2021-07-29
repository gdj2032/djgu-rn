/**
 * 扇形/圆形
 */
import React, { Component } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Path, Text, G, FontWeight } from 'react-native-svg';

type TYPE_POSITION = 'top' | 'left_bottom' | 'right_bottom';

interface IProps {
  radius: number, // 圆弧半径
  startAngle: number, // 开始角度
  endAngle: number, // 结束角度
  cx: number, // 圆心的X
  cy: number, // 圆心的Y
  fill?: string; //颜色
  clockwise?: boolean;
  onPress?: (e?: GestureResponderEvent) => void;
  value?: string;
  fontStyle?: {
    size?: string | number;
    color?: string;
    fontWeight?: FontWeight;
  };
  /**
   * 文字位置
   *
   * @type {TYPE_POSITION}
   * @memberof IProps
   */
  position?: TYPE_POSITION | string;
  valueRotation?: number;
}

interface IState {
  path: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export default class Wedge extends Component<IProps, IState> {

  static defaultProps = {
    originX: 0,
    originY: 0,
    fill: 'black',
    clockwise: true,
    fontStyle: {
      size: 20,
      color: 'black',
    },
    position: 'top',
  }

  constructor(props: IProps) {
    super(props)
    this.state = {
      path: '',
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    }
  }

  componentDidMount() {
    this.initSvg()
  }

  /**
   * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
   * rx ry 是椭圆的两个半轴的长度。
   * x-axis-rotation 是椭圆相对于坐标系的旋转角度，角度数而非弧度数。
   * large-arc-flag 是标记绘制大弧(1)还是小弧(0)部分。
   * sweep-flag 是标记向顺时针(1)还是逆时针(0)方向绘制。
   * x y 是圆弧终点的坐标。
   */

  //angle圆心角度 获取弧长
  arcLen = (angle: number) => angle * Math.PI * this.props.radius / 180;

  initSvg() {
    const { radius, startAngle: sa, endAngle: ea, cx, cy, clockwise } = this.props;
    let [x1, y1, x2, y2, sweepFlag] = [0, 0, 0, 0, 1];

    const startAngle = (sa / 180) * Math.PI;
    const endAngle = (ea / 180) * Math.PI;

    if (clockwise) {
      //顺时针
      x1 = cx + (radius * Math.sin(startAngle))
      y1 = cy - (radius * Math.cos(startAngle))
      x2 = cx + (radius * Math.sin(endAngle))
      y2 = cy - (radius * Math.cos(endAngle))
    } else {
      //逆时针
      sweepFlag = 0;
      x1 = cx + (radius * Math.sin(endAngle))
      y1 = cy - (radius * Math.cos(endAngle))
      x2 = cx + (radius * Math.sin(startAngle))
      y2 = cy - (radius * Math.cos(startAngle))
    }

    let big = 0; //对应path圆弧属性A中的large-arc-flag
    if (endAngle - startAngle > Math.PI) big = 1;

    const d = `M ${cx},${cy} L ${x1}, ${y1} A ${radius},${radius} 0 ${big} ${sweepFlag} ${x2}, ${y2} Z`
    this.setState({ path: d, x1, x2, y1, y2 })
  }

  getTextXY = (x1: number, x2: number, y1: number, y2: number, pos: TYPE_POSITION | string = 'top') => {
    let x = 0;
    let y
    if (pos === 'top') {
      x = (x1 + x2) / 2;
      y = (y1 + y2) / 4;
    } else if (pos === 'left_bottom') {
      x = x1 + (x2 - x1) * 0.8;
      y = y1 + (y2 - y1) * 0.4;
    } else if (pos === 'right_bottom') {
      x = x1 + (x2 - x1) * 0.2;
      y = y1 + (y2 - y1) * 0.6;
    }
    return { x, y };
  }

  render() {
    const { fill, onPress, value, fontStyle, position, valueRotation } = this.props;
    const { path, x1, x2, y1, y2 } = this.state;
    const { x, y } = this.getTextXY(x1, x2, y1, y2, position)
    return (
      <G>
        <Path fill={fill} d={path} onPress={onPress} />
        <Text
          fill={fontStyle?.color || 'black'}
          fontSize={fontStyle?.size || 20}
          fontWeight={fontStyle?.fontWeight}
          x={x}
          y={y}
          textAnchor='middle'
          // transform={{ rotation: 360 }}
          // rotate={[120]}
        >
          {value}
        </Text>
      </G>
    )
  }
}

/**
 * 通用选择器
 */
import React, { Component, ReactNode } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, LayoutChangeEvent, ScrollView } from 'react-native';
import { mixins } from '../../styles';
import ActionSheet from '../ActionSheet';
import PickerItem from './PickerItem';

type PICKER_MODE = 'selector' | 'multiSelector';

interface IPickerProps {
  /**
  * 是否显示选择器
  *
  * @type {boolean}
  * @memberof IPickerProps
  */
  visible: boolean;
  /**
   * 选择器的模式
   * selector 单列
   * multiSelector 多列
   *
   * @type {PICKER_MODE}
   * @memberof IPickerProps
   */
  mode: PICKER_MODE;
  /**
   * 列改变时
   * number 单列
   * number[] 多列 第几列第几个
   *
   * @memberof IPickerProps
   */
  onChange: (num: number[]) => void;
  /**
   * 下标从 0 开始
   * number 单列
   * number[] 多列 第几列第几个
   *
   * @default (0|[0,0,...])
   * @type {str_num}
   * @memberof IPickerProps
   */
  value: number[];
  /**
   * 二维数组
   *
   * @type {(Array<string[]> | Array<number[]> | Array<Object[]>)}
   * @memberof IPickerProps
   */
  range: Array<string[]> | Array<number[]> | Array<Object[]>;
  /**
   * 当 range 是一个 Object Array 时
   * 通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   *
   * @type {string}
   * @memberof IPickerProps
   */
  rangeKey?: string;
  /**
   * 是否禁用
   *
   * @default false
   * @type {boolean}
   * @memberof IPickerProps
   */
  disabled?: boolean;
  /**
   * 自定义picker上面显示的内容
   *
   * @memberof IPickerProps
   */
  renderPickerTop?: () => ReactNode;
  /**
   * 自定义picker下面显示的内容
   *
   * @memberof IPickerProps
   */
  renderPickerBottom?: () => ReactNode;
  /**
   * picker组件高度 不包括topView和bottomView
   *
   * @default mixins.zoom(300)
   * @type {number}
   * @memberof IPickerProps
   */
  height: number;
}

interface IState {
  visible: boolean;
}

export default class Picker extends Component<IPickerProps, IState> {

  static defaultProps: IPickerProps = {
    visible: false,
    range: [],
    value: [],
    onChange: (num: number[]) => {},
    mode: 'selector',
    height: mixins.zoom(270),
  }

  private flatListRef: FlatList | null | undefined;
  private itemHeight = mixins.zoom(30);


  constructor(props: IPickerProps) {
    super(props)
    this.state = {
      visible: this.props.visible,
    }
  }

  componentDidMount() {
    this.scroll(this.props.visible)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.visible !== nextProps.visible) {
      this.setState({ visible: nextProps.visible })
      this.scroll(nextProps.visible)
    }
  }

  scroll = (visible) => {
    if (!visible) return;
    this.flatListRef?.scrollToIndex({ animated: true, index: 0 })
  }

  getItem = (size: 'small' | 'big') => {
    const { range, value } = this.props;
    if (range.length == 0) {
      return false;
    }
    return range.map((item, i) => {
      return (
        <View key={i} style={{ height: this.itemHeight, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: size == 'big' ? mixins.zoom(24) : mixins.zoom(16), color: size == 'big' ? '#4a4a4a' : '#a0a0a0', backgroundColor: 'rgba(0,0,0,0)' }}>
            {value ? item[value[i]] : item}
          </Text>
        </View>
      )
    })
  }

  render() {
    const { mode, onChange, value, range, rangeKey, disabled, renderPickerTop, renderPickerBottom, height } = this.props;
    const { visible } = this.state;
    return (
      <ActionSheet
        visible={visible}
      >
        <TouchableOpacity style={styles.outView} activeOpacity={1} onPress={(e) => e.stopPropagation()} >
          <View>
            {renderPickerTop && renderPickerTop()}
          </View>
          <View style={[styles.pickerView, { height }]}>
            {
              range.map((e, i) => {
                return (
                  <PickerItem
                    key={i}
                    itemHeight={this.itemHeight}
                    height={height}
                    data={e}
                    value={value}
                    index={i}
                    onChange={(idx) => onChange([i, idx])}
                  />
                )
              })
            }
          </View>
          <View>
            {renderPickerBottom && renderPickerBottom()}
          </View>
        </TouchableOpacity>
      </ActionSheet>
    )
  }
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  outView: {
    backgroundColor: 'white'
  },
  pickerView: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
});

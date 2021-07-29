/**
 * 通用选择器
 */
import React, { Component, ReactNode } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { mixins } from '../../styles';
import ActionSheet from '../ActionSheet';
import PickerItem from './PickerItem';
interface IIDName {
  id: string;
  name: string;
}

interface IProps {
  /**
  * 是否显示选择器
  *
  * @type {boolean}
  * @memberof IProps
  */
  visible: boolean;
  /**
   * 列改变时
   * number 单列
   * number[] 多列 第几列第几个
   *
   * @memberof IProps
   */
  onChange: (num: (number | string)[]) => void;
  /**
   * string[] 第几列的id标签
   * 默认全部取第一行
   *
   * @default (['1','1',...])
   * @type {string}
   * @memberof IProps
   */
  value: string[];
  /**
   * 二维数组
   *
   * @type {(Array<string[]> | Array<number[]> | Array<Object[]>)}
   * @memberof IProps
   */
  data: IIDName[][];
  /**
   * 是否禁用
   *
   * @default false
   * @type {boolean}
   * @memberof IProps
   */
  disabled?: boolean;
  /**
   * 自定义picker上面显示的内容
   *
   * @memberof IProps
   */
  head?: () => ReactNode;
  /**
   * 自定义picker下面显示的内容
   *
   * @memberof IProps
   */
  foot?: () => ReactNode;
  /**
   * picker组件高度 不包括topView和bottomView
   *
   * @default mixins.zoom(300)
   * @type {number}
   * @memberof IProps
   */
  height: number;
}

interface IState {
  visible: boolean;
}

export default class Picker extends Component<IProps, IState> {

  static defaultProps: IProps = {
    visible: false,
    data: [],
    value: [],
    onChange: () => {},
    height: mixins.zoom(270),
  }

  private itemHeight = mixins.zoom(30);


  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: this.props.visible,
    }
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (nextProps.visible !== prevState.visible) {
      return { ...nextProps }
    }
    return null;
  }

  render() {
    const { onChange, value, data, disabled, head, foot, height } = this.props;
    const { visible } = this.state;
    return (
      <ActionSheet
        visible={visible}
      >
        <View style={styles.outView} >
          <View>
            {head && head()}
          </View>
          <View style={[styles.pickerView, { height }]}>
            {
              data.map((e, i) => {
                return (
                  <PickerItem
                    key={JSON.stringify(e)}
                    itemHeight={this.itemHeight}
                    height={height}
                    data={e}
                    value={value[i]}
                    col={i}
                    onRowChange={(id) => onChange([i, id])}
                  />
                )
              })
            }
          </View>
          <View>
            {foot && foot()}
          </View>
        </View>
      </ActionSheet>
    )
  }
}

const styles = StyleSheet.create({
  outView: {
    backgroundColor: 'white'
  },
  pickerView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

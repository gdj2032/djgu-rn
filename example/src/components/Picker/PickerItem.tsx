/**
 * title
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { mixins } from '../../styles';

interface IProps {
  itemHeight: number;
  height: number;
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
   * 数组
   *
   * @type {(string[] | number[] | Object[])}
   * @memberof IPickerProps
   */
  data: string[] | number[] | Object[];
  index: number;
  onChange: (idx: number) => void;
}

interface IState {
  data: string[] | number[] | Object[];
}

export default class PickerItem extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      data: this.props.data,
    }
  }

  itemHeight = this.props.itemHeight;
  _scrollView1: ScrollView | null | undefined;
  _scrollView2: ScrollView | null | undefined;
  fixInterval;
  onScrollCount: number = 0;

  componentDidMount() {
    if (this.props.value.length > 0) {
      this._selectTo(this.props.value, this.props.index);
    }
  }

  _onScrollEndDrag = (e) => {
    let y = e.nativeEvent.contentOffset.y;
    let onScrollEndDragCount = this.onScrollCount;
    let start = Date.now();
    if (this.fixInterval) {
      clearInterval(this.fixInterval);
    }
    this.fixInterval = setInterval(() => this._timeFix(start, y, onScrollEndDragCount), 10);
  }

  _timeFix = (start, y, onScrollEndDragCount) => {
    let now = Date.now();
    let end = 200;
    if (now - start > end) {
      clearInterval(this.fixInterval);
      if (onScrollEndDragCount == this.onScrollCount) {
        this._onScrollEnd(y);
      }
    }
  }

  _onMomentumScrollEnd = (e) => {
    let y = e.nativeEvent.contentOffset.y;
    this._onScrollEnd(y);
  }

  _onScroll = (e) => {
    this.onScrollCount++;
    console.log('scroll');
    let y = e.nativeEvent.contentOffset.y;
    if (this._scrollView2) {
      this._scrollView2.scrollTo({ y: y, animated: false });
    }
  }


  _onScrollEnd = (y) => {
    let y1 = y - (y % this.itemHeight);
    if (y % this.itemHeight > this.itemHeight / 2) { y1 = y1 + this.itemHeight; }
    let index = y1 / this.itemHeight;
    if (this._scrollView1) {
      this._scrollView1.scrollTo({ y: y1, animated: false });
    }
    if (this.props.onChange) {
      this.props.onChange(index);
    }
  }

  _selectTo = (value, index) => {
    let y = value[index] * this.itemHeight;
    if (this._scrollView1) {
      this._scrollView1.scrollTo({ y, animated: false });
    }
  }

  getItem = (size: 'small' | 'big') => {
    const { data, value, index } = this.props;
    if (data.length == 0) {
      return false;
    }
    return data.map((item, i) => {
      return (
        <View key={i} style={{ height: this.itemHeight, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: size == 'big' ? mixins.zoom(24) : mixins.zoom(16), color: size == 'big' ? '#4a4a4a' : '#a0a0a0', backgroundColor: 'rgba(0,0,0,0)' }}>
            {item}
          </Text>
        </View>
      )
    })
  }

  render() {
    const { height } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: height, backgroundColor: 'pink' }}>
          <ScrollView
            bounces={false}
            onScrollEndDrag={(e) => { this._onScrollEndDrag(e) }}
            onMomentumScrollEnd={(e) => { this._onMomentumScrollEnd(e) }}
            onScroll={(e) => { this._onScroll(e) }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            ref={c => this._scrollView1 = c}
          >
            <View style={{ height: height * 4 / 9 }} />
            {this.getItem('small')}
            <View style={{ height: height * 4 / 9 }} />
          </ScrollView>
        </View>
        <View style={{ height: this.itemHeight, marginTop: -(height * 5 / 9), backgroundColor: 'white' }} pointerEvents='none' >
          <View style={{ height: mixins.zoom(1), backgroundColor: '#a2a2a2' }} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={c => this._scrollView2 = c}
          >
            {this.getItem('big')}
          </ScrollView>
          <View style={{ height: mixins.zoom(1), backgroundColor: '#a2a2a2' }} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});

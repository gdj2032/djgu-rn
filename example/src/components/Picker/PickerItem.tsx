import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
} from 'react-native';
import { mixins } from '../../styles';

interface IProps {
  data: number[]
  name: str_num;
  onRowChange: (index: number) => void;
  selectTo: number;
  itemHeight: number;
  height: number;
  index: number;
}

interface IState {
  data: number[]
}

export default class PickerItem extends Component<IProps, IState> {

  onScrollCount: number;
  fixInterval;
  scrollViewRef1: ScrollView | null | undefined;
  scrollViewRef2: ScrollView | null | undefined;
  itemHeight: number;
  height: number;

  static defaultProps = {
    height: mixins.zoom(300),
    itemHeight: mixins.zoom(30),
  }

  constructor(props: IProps) {
    super(props);
    this.onScrollCount = 0;
    this.itemHeight = this.props.itemHeight;
    this.height = this.props.height;
    this.state = {
      data: this.props.data
    };
  }

  setDataSource(data) {
    if (this.scrollViewRef1) {
      this.scrollViewRef1.scrollTo({ y: 0, animated: true });
    }
    this.setState({ data: data });
  }

  getItem(size) {
    const { data } = this.state;
    if (data.length == 0) {
      return false;
    }
    return data.map((item, i) => {
      return (
        <View key={i} style={{ width: '100%', height: this.itemHeight, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: size == 'big' ? mixins.zoom(22) : mixins.zoom(16), color: size == 'big' ? '#4a4a4a' : '#a0a0a0', backgroundColor: 'rgba(0,0,0,0)' }}>
            {item}
          </Text>
        </View>
      )
    })
  }

  _onScrollEndDrag(e) {
    let y = e.nativeEvent.contentOffset.y;
    let onScrollEndDragCount = this.onScrollCount;
    let start = Date.now();
    if (this.fixInterval) {
      clearInterval(this.fixInterval);
    }
    this.fixInterval = setInterval(() => this._timeFix(start, y, onScrollEndDragCount), 10);
  }

  _timeFix(start, y, onScrollEndDragCount) {
    let now = Date.now();
    let end = 200;
    if (now - start > end) {
      clearInterval(this.fixInterval);
      if (onScrollEndDragCount == this.onScrollCount) {
        this._onScrollEnd(y);
      }
    }
  }

  _onMomentumScrollEnd(e) {
    let y = e.nativeEvent.contentOffset.y;
    this._onScrollEnd(y);
  }

  _onScroll(e) {
    this.onScrollCount++;
    let y = e.nativeEvent.contentOffset.y;
    if (this.scrollViewRef2) {
      this.scrollViewRef2.scrollTo({ y: y, animated: false });
    }
  }

  _onScrollEnd(y) {
    let y1 = y - (y % this.itemHeight);
    if (y % this.itemHeight > (this.itemHeight / 2)) { y1 = y1 + this.itemHeight; }
    let index = y1 / this.itemHeight;
    if (this.scrollViewRef1) {
      this.scrollViewRef1.scrollTo({ y: y1, animated: true });
    }
    if (this.props.onRowChange) {
      this.props.onRowChange(index);
    }
  }

  _selectTo(index) {
    let y = index * this.itemHeight;
    if (this.scrollViewRef1) {
      this.scrollViewRef1.scrollTo({ y, animated: true });
    }
  }

  componentDidMount() {
    if (this.props.selectTo) {
      this._selectTo(this.props.selectTo);
    }
  }

  render() {
    const { height, itemHeight } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: height, backgroundColor: '#ffffff' }}>
          <ScrollView
            bounces={false}
            onScrollEndDrag={(e) => { this._onScrollEndDrag(e) }}
            onMomentumScrollEnd={(e) => { this._onMomentumScrollEnd(e) }}
            onScroll={(e) => { this._onScroll(e) }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            ref={c => this.scrollViewRef1 = c}
          >
            <View style={{ height: (height - this.itemHeight) / 2 }} />
            {this.getItem('small')}
            <View style={{ height: (height - this.itemHeight) / 2 }} />
          </ScrollView>
        </View>
        <View style={{ height: itemHeight, marginTop: -(height + this.itemHeight) * 0.5, backgroundColor: '#ffffff' }} pointerEvents='none' >
          <View style={{ height: mixins.zoom(1), backgroundColor: '#a2a2a2' }} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={c => this.scrollViewRef2 = c}
          >
            {this.getItem('big')}
          </ScrollView>
          <View style={{ height: mixins.zoom(1), backgroundColor: '#a2a2a2' }} />
        </View>
        <View style={{ height: (height - this.itemHeight) / 2 }} pointerEvents='none' />
      </View>
    )
  }
}
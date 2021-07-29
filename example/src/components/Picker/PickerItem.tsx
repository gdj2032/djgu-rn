import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { mixins } from '../../styles';

type TYPE_SIZE = 'big' | 'small';

interface IIDName {
  id: string;
  name: string;
}

interface IProps {
  data: IIDName[]
  value: string;
  onRowChange: (id: string) => void;
  itemHeight: number;
  height: number;
  col: number;
}

interface IState {
  value: string;
}

export default class PickerItem extends Component<IProps, IState> {

  onScrollCount: number;
  fixInterval;
  scrollViewRef1: ScrollView | null | undefined;
  scrollViewRef2: ScrollView | null | undefined;
  itemHeight: number;
  height: number;
  timeout;
  isPressItem: boolean;

  static defaultProps = {
    height: mixins.zoom(300),
    itemHeight: mixins.zoom(30),
  }

  constructor(props: IProps) {
    super(props);
    this.onScrollCount = 0;
    this.itemHeight = this.props.itemHeight;
    this.height = this.props.height;
    this.isPressItem = false;
    this.state = {
      value: this.props.value
    };
  }

  getItem = (size: TYPE_SIZE) => {
    const { data } = this.props;
    if (data.length === 0) {
      return false;
    }
    return data.map((item) => {
      return (
        <TouchableOpacity key={item.id} style={{ width: '100%', height: this.itemHeight, justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => this.onPressItem(item)} >
          <Text style={{ fontSize: size === 'big' ? mixins.zoom(22) : mixins.zoom(16), color: size === 'big' ? '#4a4a4a' : '#a0a0a0', backgroundColor: 'rgba(0,0,0,0)' }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )
    })
  }

  onPressItem = (item: IIDName) => {
    this.isPressItem = true;
    const { data } = this.props;
    const { value } = this.state;
    if (value === item.id) return;
    const ids = data.map(e => e.id);
    const curIdx = ids.indexOf(item.id);
    this._selectTo(curIdx, true, true)
    if (this.props.onRowChange) {
      this.props.onRowChange(item.id);
    }
    this.isPressItem = false;
  }

  onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.isPressItem) return;
    const y = e.nativeEvent.contentOffset.y;
    const onScrollEndDragCount = this.onScrollCount;
    const start = Date.now();
    if (this.fixInterval) {
      clearInterval(this.fixInterval);
    }
    this.fixInterval = setInterval(() => this._timeFix(start, y, onScrollEndDragCount), 10);
  }

  _timeFix(start: number, y: number, onScrollEndDragCount: number) {
    const now = Date.now();
    const end = 200;
    if (now - start > end) {
      clearInterval(this.fixInterval);
      if (onScrollEndDragCount === this.onScrollCount) {
        this.onScrollEnd(y);
      }
    }
  }

  onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    this.onScrollEnd(y);
  }

  onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.isPressItem) return;
    this.onScrollCount++;
    const y = e.nativeEvent.contentOffset.y;
    if (this.scrollViewRef2) {
      this.scrollViewRef2.scrollTo({ y: y, animated: false });
    }
  }

  onScrollEnd = (y: number) => {
    if (this.isPressItem) return;
    let y1 = y - (y % this.itemHeight);
    if (y % this.itemHeight > (this.itemHeight / 2)) { y1 = y1 + this.itemHeight; }
    const index = y1 / this.itemHeight;
    if (this.scrollViewRef1) {
      this.scrollViewRef1.scrollTo({ y: y1, animated: true });
    }
    const { data } = this.props;
    const id = data.find((e, idx) => idx === index)?.id;
    if (this.props.onRowChange && id) {
      this.props.onRowChange(id);
    }
  }

  _selectTo = (index: number, s1?: boolean, s2?: boolean) => {
    const y = index * this.itemHeight;
    this.timeout = setTimeout(() => {
      if (this.scrollViewRef1 && this.scrollViewRef2) {
        this.scrollViewRef1.scrollTo({ y: y, animated: s1 });
        this.scrollViewRef2.scrollTo({ y: y, animated: s2 });
      }
    }, 1);
  }

  componentDidMount() {
    const { data, value } = this.props;
    if (this.props.value) {
      this._selectTo(data.map(e => e.id).indexOf(value))
    }
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (nextProps.value !== prevState.value) {
      return { ...nextProps }
    }
    return null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { height, itemHeight } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: height, backgroundColor: '#ffffff' }}>
          <ScrollView
            bounces={false}
            onScrollEndDrag={(e) => this.onScrollEndDrag(e)}
            onMomentumScrollEnd={(e) => this.onMomentumScrollEnd(e)}
            onScroll={(e) => this.onScroll(e)}
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

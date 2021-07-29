/**
 * 活动指示器
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Animated, Easing, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

interface IProps {
  /**
  * 是否显示选择器
  *
  * @type {boolean}
  * @memberof IProps
  */
  visible: boolean;
}

interface IState {
  visible: boolean;
  height: number,
}

export default class ActionSheet extends Component<IProps, IState> {

  static defaultProps: IProps = {
    visible: false,
  }

  sliderValue;
  viewRef: View | null | undefined;

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: this.props.visible,
      height: -1000,
    }
    this.sliderValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.init()
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (nextProps.visible !== prevState.visible) {
      return { ...nextProps }
    }
    return null;
  }

  init = async () => {
    const viewRes = await this.getViewHeightByRef(this.viewRef);
    this.setState({ height: viewRes.height })
    this.animatedStart(this.props.visible)
  }

  animatedStart = (visible) => {
    if (!visible) return;
    Animated.timing(this.sliderValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  animatedClose = () => {
    Animated.timing(this.sliderValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  timeout1;
  getViewHeightByRef = (ref: View | null | undefined) => {
    return new Promise<IMeasureConfig>((rej) => {
      if (ref) {
        this.timeout1 = setTimeout(() => {
          ref.measure((x, y, width, height, pageX, pageY) => {
            clearTimeout(this.timeout1)
            rej({ x, y, width, height, pageX, pageY })
          })
        }, 1);
      } else {
        rej({ x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0 })
      }
    });
  }

  close = () => {
    this.animatedClose();
    setTimeout(() => {
      this.setState({ visible: false });
    }, 400);
  }

  render() {
    const { children } = this.props;
    const { visible, height } = this.state;
    const slider = this.sliderValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: [height, 0] //输出值
    })
    return (
      <Modal
        animated={true}
        animationType='fade'
        visible={visible}
        transparent={true}
      >
        <TouchableOpacity style={styles.modalView} activeOpacity={1} onPress={this.close} />
        <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: [{ translateY: slider }] }}>
          <View style={styles.outView} ref={c => this.viewRef = c} onTouchStart={(e) => e.stopPropagation()} >
            {children}
          </View>
        </Animated.View>
      </Modal>
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
  },
});

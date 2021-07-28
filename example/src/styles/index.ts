import { ViewStyle } from 'react-native';

export { default as themes } from './themes';
export { mixins, scale, DEVICE_HEIGHT, DEVICE_WIDTH } from './mixins';

export const layoutStyles: {[key: string]: ViewStyle} = {
  fullContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  centralContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const HEADER_HEIGHT = 44;

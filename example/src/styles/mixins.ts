import { Dimensions } from 'react-native';

const dimensions = Dimensions.get('window');
const designWidth = 750 / 2;
const designHeight = 1334 / 2;
export const DEVICE_WIDTH = dimensions.width;
export const DEVICE_HEIGHT = dimensions.height;

export const scale = Math.min(
  DEVICE_HEIGHT / designHeight,
  DEVICE_WIDTH / designWidth,
);

function assignValueToDirection(
  top: number,
  right: number = top,
  bottom: number = top,
  left: number = right,
  property: 'margin' | 'padding',
) {
  const styles = {};
  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;
  return styles;
}

export const mixins = {
  margin: (top, right, bottom, left) =>
    assignValueToDirection(top, right, bottom, left, 'margin'),
  padding: (top, right, bottom, left) =>
    assignValueToDirection(top, right, bottom, left, 'padding'),
  fontSize: size => size * scale,
  zoom: size => size * scale,
};

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const defaultBaseWidth = 720;
const defaultBaseHeight = 1280;

const horizontalScale = (size: number): number =>
  (width / defaultBaseWidth) * size;

const verticalScale = (size: number): number =>
  (height / defaultBaseHeight) * size;

const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };

import Svg, { Path } from 'react-native-svg';

type CategoryDeleteIconProps = {
  size?: number;
  color?: string;
};

// Tabler "x" 아이콘(outline, https://tabler.io/icons/icon/x)을 그대로 사용.
// Ionicons에는 동일한 모양이 없어 공식 SVG path를 그대로 옮겨와 렌더링
export function CategoryDeleteIcon({ size = 24, color = '#000000' }: CategoryDeleteIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6l-12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

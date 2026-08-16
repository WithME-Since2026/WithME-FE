import Svg, { Path } from 'react-native-svg';

type CategoryEditIconProps = {
  size?: number;
  color?: string;
};

// Tabler "pencil" 아이콘(outline, https://tabler.io/icons/icon/pencil)을 그대로 사용.
// Ionicons에는 동일한 모양이 없어 공식 SVG path를 그대로 옮겨와 렌더링
export function CategoryEditIcon({ size = 24, color = '#000000' }: CategoryEditIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.5 6.5l4 4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

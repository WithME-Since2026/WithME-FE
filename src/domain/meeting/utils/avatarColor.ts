const AVATAR_COLORS = ['#F0714F', '#4A90FA', '#34A776', '#9B59B6'];

export function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

const AVATAR_COLORS = ['#F0714F', '#4A90FA', '#34A776', '#9B59B6'];

export function getAvatarColor(memberId: number) {
  return AVATAR_COLORS[Math.abs(memberId) % AVATAR_COLORS.length];
}

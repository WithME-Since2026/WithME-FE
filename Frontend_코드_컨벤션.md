# ✅ FrontEnd Convention

## HTTP Method

- `GET`: 데이터 조회
- `POST`: 데이터 생성
- `PATCH`: 데이터 일부 수정
- `DELETE`: 데이터 삭제
- `PUT`: 가급적 사용 X

---

## 1. 프로젝트 구조

```text
src
  ┣ app
  ┃  ┣ providers
  ┃  ┣ routes        // React
  ┃  ┗ navigation    // React Native
  ┣ common
  ┃  ┣ api
  ┃  ┣ components
  ┃  ┣ constants
  ┃  ┣ hooks
  ┃  ┣ styles
  ┃  ┣ types
  ┃  ┣ utils
  ┃  ┗ storage
  ┣ domain
  ┃  ┣ auth
  ┃  ┃  ┣ api
  ┃  ┃  ┣ components
  ┃  ┃  ┣ hooks
  ┃  ┃  ┣ screens     // React Native
  ┃  ┃  ┣ pages       // React
  ┃  ┃  ┣ store
  ┃  ┃  ┗ types
  ┃  ┗ user
  ┃     ┣ api
  ┃     ┣ components
  ┃     ┣ hooks
  ┃     ┣ screens
  ┃     ┣ pages
  ┃     ┣ store
  ┃     ┗ types
  ┗ assets
     ┣ images
     ┣ icons
     ┗ fonts
```

- `common`: 전역 공통 코드
- `domain`: 도메인별 기능 코드
- `api`: 서버 통신 함수
- `hooks`: React Query, mutation, 비즈니스 로직 연결
- `types`: Request / Response 타입
- `components`: 해당 도메인 내부 UI
- `pages`: React Web 화면
- `screens`: React Native 화면

```text
Page / Screen
  → Hook
    → API
      → apiClient
```

---

## 2. 네이밍 컨벤션

| 구분 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | `PascalCase` | `UserProfileCard` |
| Page | `PascalCase + Page` | `LoginPage` |
| Screen | `PascalCase + Screen` | `LoginScreen` |
| 함수 | `camelCase` | `getUserProfile()` |
| 이벤트 함수 | `handle + 동작` | `handleSubmit()` |
| Props 함수 | `on + 동작` | `onPress`, `onClose` |
| 변수 | `camelCase` | `userId`, `productList` |
| 배열 | 복수형 | `users`, `products` |
| 상수 | `UPPER_SNAKE_CASE` | `ACCESS_TOKEN_KEY` |
| 타입 | `PascalCase` | `UserProfileResponse` |
| API 파일 | `camelCase + Api` | `userApi.ts` |
| Hook 파일 | `use + PascalCase` | `useUserProfileQuery.ts` |

### 함수명 기준

```typescript
// 생성
createProduct();
registerUser();

// 조회
getUserProfile();
getProductList();

// 수정
updateUserProfile();

// 삭제
deleteProduct();
```

---

## 3. 코드 스타일

- TypeScript 사용
- `any` 사용 금지
- 함수형 컴포넌트 사용
- 중괄호 `{}` 항상 사용
- 중첩 삼항 연산자 사용 금지
- 컴포넌트에서 API 직접 호출 금지
- 한 파일에 하나의 주요 컴포넌트 작성
- 너무 길어지면 컴포넌트 / hook / util로 분리

```typescript
// Good
if (isLoading) {
  return <LoadingView />;
}

if (!profile) {
  return <EmptyView message="프로필 정보가 없습니다." />;
}

return <UserProfileCard profile={profile} />;
```

```typescript
// Bad
return isLoading ? <LoadingView /> : !profile ? <EmptyView /> : <UserProfileCard />;
```

---

## 4. Import 순서

```typescript
// 1. React / React Native
import { useState } from 'react';
import { View, Text } from 'react-native';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';

// 3. common
import { Button } from '@/common/components/Button';

// 4. domain
import { getUserProfile } from '@/domain/user/api/userApi';

// 5. relative
import { styles } from './UserProfileScreen.styles';
```

---

## 5. TypeScript 규칙

- Request 타입: `Request` 접미사
- Response 타입: `Response` 접미사
- Props 타입: `컴포넌트명 + Props`
- 서버 응답 필드명은 임의 변경하지 않음
- 서버에서 `null` 가능하면 타입에 명시

```typescript
export type UpdateProfileRequest = {
  nickname: string;
  residence: string;
  introduction?: string;
};

export type UserProfileResponse = {
  userId: number;
  nickname: string;
  residence: string;
  introduction: string | null;
};

type UserProfileCardProps = {
  profile: UserProfileResponse;
  onEditPress: () => void;
};
```

---

## 6. API 설계 규칙

백엔드 응답 규격에 맞춰 공통 타입 사용.

```typescript
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
};
```

```typescript
// domain/user/api/userApi.ts

export async function getUserProfile() {
  const response = await apiClient.get<ApiResponse<UserProfileResponse>>(
    '/users/me/profile',
  );

  return response.data.data;
}
```

- API 호출은 `domain/{domain}/api`에서만 작성
- 컴포넌트에서 `apiClient` 직접 사용 금지
- 서버 에러 메시지는 `message` 우선 사용
- 토큰 재발급은 interceptor 또는 auth 로직에서만 처리

---

## 7. React Query 규칙

```typescript
export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
};
```

```typescript
export function useUserProfileQuery() {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: getUserProfile,
  });
}
```

- 서버 상태는 React Query 사용
- 서버 데이터를 Zustand에 중복 저장하지 않음
- mutation 성공 시 관련 query invalidate
- query key는 도메인별로 관리

---

## 8. 상태 관리 기준

| 상태 | 사용 |
|------|------|
| input 값 | `useState` |
| modal open 여부 | `useState` |
| 서버 데이터 | `React Query` |
| 로그인 상태 | `Zustand` |
| 전역 UI 상태 | `Zustand` |
| 토큰 | `tokenManager` / secure storage |

---

## 9. React Native 규칙

- 화면 컴포넌트는 `Screen` 접미사 사용
- `TouchableOpacity`보다 `Pressable` 우선 사용
- 긴 목록은 `ScrollView`보다 `FlatList` 사용
- `keyExtractor` 필수
- 인라인 스타일 최소화
- 색상, 간격, 폰트는 `theme` 기준 사용

```typescript
<FlatList
  data={products}
  keyExtractor={(item) => String(item.productId)}
  renderItem={({ item }) => <ProductCard product={item} />}
/>
```

---

## 10. React Web 규칙

- 화면 컴포넌트는 `Page` 접미사 사용
- route 단위 컴포넌트는 `pages`에 위치
- 공통 레이아웃은 `app` 또는 `common/components`에 위치
- DOM 직접 접근 지양
- 스타일 방식은 프로젝트 시작 시 하나로 통일

```text
CSS Modules / styled-components / Tailwind 중 하나로 통일
```

---

## 11. 에러 / 로딩 / 빈 화면 처리

공통 컴포넌트 사용.

```text
LoadingView
ErrorView
EmptyView
```

```typescript
if (isLoading) {
  return <LoadingView />;
}

if (isError) {
  return <ErrorView message="정보를 불러오지 못했습니다." />;
}

if (!products.length) {
  return <EmptyView message="상품이 없습니다." />;
}
```

---

## 12. 토큰 관리

- 토큰은 컴포넌트에서 직접 접근 금지
- `tokenManager` 또는 auth store에서만 관리
- 로그아웃 시 token, auth store, query cache 초기화
- 401 발생 시 토큰 재발급 또는 로그인 화면 이동

```text
common/api/tokenManager.ts
domain/auth/api/authApi.ts
domain/auth/store/authStore.ts
```

---

## 13. 코드 자동 정렬

### 필수

- ESLint
- Prettier
- TypeScript type check

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  }
}
```

### 단축키

- Windows: `Shift + Alt + F`
- Mac: `Shift + Option + F`

---

## 14. 주석

- 당연한 주석 작성 금지
- 복잡한 로직에만 한 줄 설명
- TODO는 이유를 함께 작성
- 임시 코드는 PR 전 제거

```typescript
// refresh token 만료 시 로그인 화면으로 이동
clearAuthAndRedirectToLogin();

// TODO: 백엔드 API 확정 후 endpoint 수정
```

## 15. AI

- .claude와 같은 AI 파일 깃허브에 포함 금지

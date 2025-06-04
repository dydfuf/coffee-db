# Coffee DB

Coffee DB는 Next.js 기반의 애플리케이션으로 커피 원두 정보를 탐색하고 관리할 수 있습니다. TypeScript와 Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)를 사용하며 데이터는 Supabase에 저장됩니다.

## Technology Stack

- **Next.js 14** App Router
- **React 18** 및 **TypeScript**
- **Tailwind CSS** 및 **shadcn/ui**
- **Supabase** PostgreSQL 데이터베이스와 인증
- **Cloudflare** 이미지 호스팅

## Features

- 국가와 노트 필터로 커피 목록 조회
- 커피 상세 페이지
- 이미지에서 커피 정보를 추출하는 AI 추천 폼
- Supabase 인증과 세션 미들웨어
- 다크 모드 지원 반응형 디자인

## Project Structure

```
app/                Next.js app router 페이지
  api/              API 라우트
  auth/             Supabase 인증 확인
  coffee/           커피 목록/상세/추천 페이지
  login/            로그인 폼과 액션
components/         공용 UI 컴포넌트
constants/          사이트 설정 및 노트 매핑
schema/             커피 데이터용 Zod 스키마
utils/              Supabase 클라이언트 등 헬퍼
```

## Architecture

애플리케이션은 `app/` 아래에 Next.js App Router를 사용합니다. 서버 컴포넌트는 `utils`의 클라이언트를 통해 Supabase에서 데이터를 가져옵니다. 인증은 `middleware.ts`에서 동기화하며, `app/api/chat`과 같은 API 라우트가 AI 추천 워크플로우를 처리합니다. 데이터베이스 타입은 Supabase에서 생성되어 타입 안전성을 제공합니다.

## Getting Started

1. `pnpm install`로 의존성을 설치합니다.
2. Supabase와 Cloudflare용 환경 변수를 설정합니다.
3. `pnpm dev`를 실행하고 `http://localhost:3000`을 엽니다.

## Data

커피 데이터는 Supabase의 `coffee-info` 테이블에 저장됩니다. 생성된 타입은 `database-generated.types.ts`에 있으며, 공통 쿼리는 `utils/api.ts`에 있습니다.

## AI Suggestion

`app/coffee/suggestion` 페이지에서 사용자는 커피 봉투 이미지를 업로드할 수 있습니다. `/api/chat`은 `coffeeSchema`를 사용하여 이미지를 OpenAI로 처리하고 추천 폼을 미리 채웁니다.

## License

MIT

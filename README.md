# Variable Documentation Extension

VSCode extension that provides variable documentation tooltips with workspace usage information.

## Features

- **Variable Documentation**: Shows descriptions from `info_doc/var-doc.json` when hovering over variables
- **Usage Tracking**: Displays all locations where the variable is used in the workspace
- **Multi-Language Support**: Works with TypeScript, JavaScript, and Vue files
- **Real-time Updates**: Automatically reloads when documentation file changes
- **Configurable**: Customizable settings for path, search limits, and features

## Installation

1. Package the extension:
   ```bash
   npm install
   npm run compile
   npm run package
   ```

2. Install the generated `.vsix` file in VSCode:
   - Open VSCode
   - Go to Extensions view (Ctrl+Shift+X)
   - Click "..." menu → "Install from VSIX..."
   - Select the generated `.vsix` file

## Setup

1. Create `info_doc` folder in your project root
2. Create `var-doc.json` file with variable documentation:

```json
{
  "userId": "사용자의 고유 ID입니다.",
  "productList": "상품 목록 배열입니다.",
  "apiKey": "API 호출을 위한 인증 키입니다."
}
```

## Usage

1. Open a TypeScript, JavaScript, or Vue file
2. Hover over any variable name
3. If the variable is documented in `var-doc.json`, a tooltip will appear showing:
   - Variable description
   - List of files and line numbers where the variable is used
   - Clickable links to navigate to usage locations

## Configuration

The extension can be configured in VSCode settings:

- `varExtension.docPath`: Path to the variable documentation file (default: "info_doc/var-doc.json")
- `varExtension.enableWorkspaceSearch`: Enable workspace-wide usage search (default: true)
- `varExtension.maxSearchResults`: Maximum number of usage results to show (default: 50)

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Lint code
npm run lint

# Package extension
npm run package
```

### Testing

Press `F5` in VSCode to launch the extension in a new Extension Development Host window.

## Project Structure

```
var-extension/
├── src/
│   └── extension.ts          # Main extension logic
├── info_doc/
│   └── var-doc.json         # Variable documentation
├── package.json             # Extension manifest
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT



# korean manual

# VarExtension 사용법

VSCode에서 변수 설명을 tooltip으로 보여주는 확장 프로그램 사용 가이드

## 📋 개요

이 확장 프로그램은 코딩 중 변수에 마우스를 올리면 해당 변수의 설명과 사용 위치를 tooltip으로 보여줍니다.

## 🚀 설치 및 설정

### 1. 확장 프로그램 설치
- VSCode Extensions에서 설치하거나
- `.vsix` 파일을 직접 설치

### 2. 변수 문서 파일 준비
프로젝트 루트에 `info_doc` 폴더를 생성하고 `var-doc.json` 파일을 만듭니다.

```json
{
  "userId": "사용자의 고유 ID입니다.",
  "productList": "상품 목록 배열입니다.",
  "apiKey": "API 호출을 위한 인증 키입니다.",
  "userProfile": "사용자 프로필 정보 객체입니다."
}
```

## 💡 사용 방법

### 1. 기본 사용법
1. `.ts`, `.js`, `.vue` 파일을 엽니다
2. 코드에서 변수 이름에 마우스를 올립니다
3. tooltip에서 변수 설명을 확인합니다

### 2. tooltip 내용
- **변수 설명**: `var-doc.json`에서 가져온 설명
- **사용 위치**: 현재 워크스페이스에서 해당 변수가 사용된 파일과 라인 번호
- **파일 링크**: 클릭하면 해당 파일의 해당 라인으로 이동

## 📁 프로젝트 구조 예시

```
your-project/
├── info_doc/
│   └── var-doc.json          # 변수 설명 문서
├── src/
│   ├── components/
│   │   └── UserList.vue      # Vue 컴포넌트
│   ├── utils/
│   │   └── api.ts           # API 유틸리티
│   └── types/
│       └── user.ts          # 타입 정의
└── package.json
```

## 🔧 설정 옵션

### VSCode 설정에서 커스터마이징 가능한 항목들:

- **문서 파일 경로**: `info_doc` 폴더 위치 변경
- **지원 파일 타입**: 추가 파일 확장자 지원
- **검색 최적화**: 대용량 프로젝트 성능 설정

## 📝 사용 예시

### 예시 1: TypeScript 파일
```typescript
// user.ts
const userId = "user123";  // 마우스 오버 시 tooltip 표시
const productList = [];    // 마우스 오버 시 tooltip 표시
```

### 예시 2: Vue 컴포넌트
```vue
<template>
  <div>{{ userId }}</div>  <!-- 마우스 오버 시 tooltip 표시 -->
</template>

<script>
export default {
  data() {
    return {
      userId: '',           // 마우스 오버 시 tooltip 표시
      productList: []       // 마우스 오버 시 tooltip 표시
    }
  }
}
</script>
```

## 🎯 활용 팁

1. **팀 협업**: 팀원들이 변수 의미를 쉽게 파악할 수 있습니다
2. **문서화**: 코드 주석 대신 중앙화된 변수 문서 관리
3. **코드 리뷰**: 변수 사용 위치를 빠르게 확인하여 효율적인 리뷰
4. **리팩토링**: 변수 사용 위치를 한눈에 파악하여 안전한 리팩토링
=> 변수 전체의 설명을 하나하나 작성하기 보다는 작성하다 헷갈리는 변수에 한해서 따로 기록하는 용도로 사용하시는게 좋습니다.

## ⚠️ 주의사항

- `info_doc/var-doc.json` 파일이 없으면 변수 설명이 표시되지 않습니다
- 대용량 프로젝트에서는 검색 성능에 영향을 줄 수 있습니다
- JSON 파일 형식이 올바르지 않으면 확장이 작동하지 않을 수 있습니다

## 🔄 업데이트

변수 문서를 수정한 후에는:
1. `var-doc.json` 파일을 저장
2. VSCode를 다시 로드하거나 확장을 다시 활성화

## 🐛 문제 해결

### 확장이 작동하지 않을 때:
1. `info_doc/var-doc.json` 파일 존재 확인
2. JSON 형식 유효성 검사
3. 지원되는 파일 타입인지 확인 (`.ts`, `.js`, `.vue`)
4. VSCode 개발자 콘솔에서 오류 메시지 확인
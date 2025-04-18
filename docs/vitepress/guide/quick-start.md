# 빠르게 시작하기

## 설치하기

### 미리 준비해주세요

- [Node.js](https://nodejs.org)
- 자바스크립트 코드를 작성할 텍스트 에디터.
  [VSCode](https://code.visualstudio.com/)를 추천합니다.
- [TypeScript](https://www.typescriptlang.org/)(선택). 코드 자동완성과 정적 타입
  검사로 코드를 안전하고 빠르게 작성할 수 있습니다.

::: code-group

```sh [npm]
npm install https://github.com/horang-corp/ypm
```

```sh [pnpm]
pnpm add https://github.com/horang-corp/ypm
```

:::

## Ypm 객체 만들기

### Node.js

```typescript
import Ypm from "ypm";
import * as fs from "fs";

const ypm = new Ypm({ fs: fs });
```

### 브라우저

브라우저 환경에서는 node:fs 인터페이스를 구현하는 브라우저 파일시스템
라이브러리를 이용해서 ypm을 사용할 수 있습니다.
[memfs](https://www.npmjs.com/package/memfs)를 추천합니다.

::: code-group

```sh [npm]
npm install memfs
```

```sh [pnpm]
pnpm add memfs
```

:::

```typescript
import Ypm from "ypm";
import { memfs } from "memfs";

const fs = memfs().fs;
const ypm = new Ypm({ fs: fs });
```

::: tip

`workingDir`를 설정해 현재 위치가 아닌 서브 디렉토리에서 작업을 진행할 수
있습니다.

```typescript
const ypm = new Ypm({
	fs: fs,
	workingDir: "./나의_첫_약속_프로젝트", // [!code focus]
});
```

:::

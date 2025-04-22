# ypm이 무엇인가요?

ypm은 [약속 프로그래밍 언어](https://dalbit-yaksok.postica.app/)를 위한 패키지
매니저입니다.

## 톺아보기

```sh
npm install https://github.com/horang-corp/ypm
```

```typescript
import Ypm from "ypm";
import * as fs from "fs";

const ypm = new Ypm({ fs: fs });

// 약속 프로젝트 초기화하기
await ypm.init({ package_name: "나의_첫_약속_프로젝트" });
// 의존성 추가하기
await ypm.add({ git_url: "https://github.com/horang-corp/ys-calculator" });
// 의존성 제거하기
await ypm.remove({ package_name: "계산기" });
// 약속프로젝트.yaml 파일의 의존성을 동기화하기
await ypm.sync();
```

## 지원 환경

ypm은 로컬 개발환경과 호랑 서비스에서의 동작을 보장하기 위해 아래 플랫폼의
지원을 목표로 합니다.

- **Node.js**

  Node.js의 fs api를 이용해서 ypm을 사용할 수 있습니다.
- **브라우저**

  [memfs](https://www.npmjs.com/package/memfs)나
  [zenfs](https://www.npmjs.com/package/@zenfs/core)등
  [nodejs의 fs](https://nodejs.org/api/fs.html) 인터페이스를 구현하는 브라우저
  파일시스템 라이브러리를 이용해서 ypm을 사용할 수 있습니다.
- **CLI(지원 예정)**

  js환경이 아닌 곳에서도 cli를 통해 ypm을 사용할 수 있습니다.

## 달빛 약속과의 호환성

[달빛 약속](https://github.com/rycont/dalbit-yaksok)은 현재 cli를 통한 코드
실행과 파일에 작성된 코드의 실행을 지원하지 않습니다. 때문에 현재 ypm을 통해
설치한 패키지는 별도의 파일 작업을 통해 약속 런타임에 주입해주어야 합니다.

앞으로 ypm은 달빛 약속과 매끄럽게 연동되어 동작할 수 있도록 협업하며 개발될
계획입니다. 현재 ypm은 달빛약속과 분리되어 개발되고 있지만
[deno](https://deno.com/)나 [go](https://go.dev/) 런타임과 같이 언어 사용의
편의성을 높이고 단순하게 하기 위해 통합될 것을 고려하여 제작되고 있습니다.

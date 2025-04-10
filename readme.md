# ypm - Yaksok Package Manager

ypm은 약속 패키지들을 관리할 수 있는 패키지 매니저 입니다.

## 설치

```bash
npm install https://github.com/horang-corp/ypm
```

## 사용법

### nodejs 환경에서

```ts
import Ypm from "ypm";
import fs from "fs";

const ypm = new Ypm({
	fs: fs,
});

await ypm.add({ git_url: "https://github.com/horang-corp/ypm" });
```

### 브라우저 환경에서

In-memory 파일 시스템 라이브러리인 [memfs](https://github.com/streamich/memfs)와
함께 사용 가능합니다.

```bash
npm install memfs
```

```ts
import Ypm from "ypm";
import { memfs } from "memfs";
import { toTreeSync } from "memfs/lib/print";

const { fs } = memfs();
const ypm = new Ypm({ fs: fs });
await ypm.add({ git_url: "https://github.com/horang-corp/ypm" });

console.log(toTreeSync(fs));
```

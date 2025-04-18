# 약속 프로젝트 생성하기

약속 패키지를 설치하기 위해선 먼저 약속 프로젝트를 생성해야합니다. `Ypm.init`
메소드를 사용해 약속 프로젝트를 생성할 수 있습니다.

::: code-group

```typescript [Node.js]{9}
import Ypm from "ypm";
import * as fs from "fs";

const ypm = new Ypm({
	fs: fs,
	workingDir: "./나의_첫_약속_프로젝트",
});

await ypm.init({ package_name: "나의_첫_약속_프로젝트" });
```

```typescript [브라우저]{10}
import Ypm from "ypm";
import { memfs } from "memfs";

const fs = memfs().fs;
const ypm = new Ypm({
	fs: fs,
	workingDir: "./나의_첫_약속_프로젝트",
});

await ypm.init({ package_name: "나의_첫_약속_프로젝트" });
```

:::

ypm은 아래와 같은 파일들을 만들 것입니다.

```
.
├── 소스               // 프로젝트의 소스 코드가 들어가는 폴더
│   └── 시작.ys        // 프로젝트의 시작점
├── .gitignore        // git이 무시해야 할 정보들을 담은 파일
├── readme.md         // 프로젝트를 설명하는 문서
└── 약속프로젝트.yaml    // 프로젝트의 메타데이터를 담은 파일
```

## 프로젝트 구조

### 약속프로젝트.yaml

`약속프로젝트.yaml`은 약속 프로젝트의 메타데이터를 담고 있는 파일입니다.

```yaml
이름: 나의_첫_약속_프로젝트 # 이 패키지의 이름은 무엇인가요?
설명: 약속 프로젝트 입니다. # 이 패키지는 어떤 패키지인가요?
만든이: 홍길동 # 이 패키지를 만든 사람은 누구인가요?

의존성:
#   패키지 이름: git 주소
```

`약속프로젝트.yaml`은 의존성을 정의하거나, 패키지의 이름, 설명, 저자를
명시하는데에 사용됩니다. 이 파일을 직접 수정하거나 `Ypm.add`, `Ypm.remove`
메소드를 사용해 패키지를 관리할 수 있습니다.

### .gitignore

`.gitignore`는 git에 포함되어서는 안되는 정보들을 명시한 파일입니다.

```
/의존성
```

`/의존성` 폴더는 `Ypm.add`로 설치한 패키지들이 들어가는 폴더입니다. 이는 git
저장소에 올라가지 않는 것이 좋기 때문에 `.gitignore`파일에 추가하여 `/의존성`
폴더를 무시하도록 설정합니다.

### readme.md

`readme.md`는 약속 프로젝트를 설명하는 마크다운 문서입니다.

### ./소스/시작.ys

`./소스/시작.ys`은 패키지의 시작점이 되는 약속 파일입니다.

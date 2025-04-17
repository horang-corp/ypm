"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entrypoint_1 = require("./entrypoint");
const path_1 = __importDefault(require("path"));
class Ypm {
    getEntrypoint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._entrypoint) {
                this._entrypoint = yield entrypoint_1.Entrypoint.load({
                    dir: this.workingDir,
                    fs: this.fs,
                });
            }
            return this._entrypoint;
        });
    }
    constructor({ workingDir, fs, }) {
        this._entrypoint = null;
        this.fs = fs;
        this.workingDir = workingDir;
    }
    initWorkingDir(package_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const ysproject_yaml_path = path_1.default.join(this.workingDir, "ysproject.yaml");
            try {
                yield this.fs.promises.stat(ysproject_yaml_path);
                return;
            }
            catch (_) {
            }
            yield this.fs.promises.writeFile(path_1.default.join(this.workingDir, ".gitignore"), "의존성");
            yield this.fs.promises.writeFile(path_1.default.join(this.workingDir, "readme.md"), `# ${package_name}
새로운 약속 프로젝트.

## 시작하기

약속 프로젝트 개발을 할 때 도움을 받을 수 있는 곳이에요.

- [약속 문법책](https://codebook.horang.it/)
- [달빛약속 공식 문서 - 시작하기](https://dalbit-yaksok.postica.app/language/1.%20%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.html)
- [한글 프로그래밍 교육 플랫폼 호랑](https://app.horang.it)
`);
            yield this.fs.promises.writeFile(path_1.default.join(this.workingDir, "약속프로젝트.yaml"), `이름: ${package_name} # 이 패키지의 이름은 무엇인가요?
# 설명: 두 개의 숫자를 더하는 계산기입니다. # 이 패키지는 어떤 패키지인가요?
# 만든이: 홍길동 # 이 패키지를 만든 사람은 누구인가요?


의존성:
    # 패키지 이름: git 주소
`);
            yield this.fs.promises.mkdir(path_1.default.join(this.workingDir, "소스"));
            yield this.fs.promises.writeFile(path_1.default.join(this.workingDir, "소스", "시작.ys"), `약속, (숫자1) 더하기 (숫자2)
				숫자1 + 숫자2 반환하기
		
		`);
        });
    }
    init(_a) {
        return __awaiter(this, arguments, void 0, function* ({ package_name, }) {
            yield this.initWorkingDir(package_name);
        });
    }
    add(_a) {
        return __awaiter(this, arguments, void 0, function* ({ git_url, }) {
            const entrypoint = yield this.getEntrypoint();
            yield entrypoint.add({ git_url });
        });
    }
    remove(_a) {
        return __awaiter(this, arguments, void 0, function* ({ package_name, }) {
            const entrypoint = yield this.getEntrypoint();
            yield entrypoint.remove({ package_name });
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const entrypoint = yield this.getEntrypoint();
            yield entrypoint.sync();
        });
    }
}
exports.default = Ypm;

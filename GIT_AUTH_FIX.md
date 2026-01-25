# Git 인증 문제 해결 가이드

## 🚨 현재 문제
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/kwpark0047/opencode260124.git/'
```

## 🔧 해결 방안 (쉬운 순서대로)

### 방법 1: GitHub Personal Access Token 사용 (권장)

#### 1단계: GitHub PAT 생성
1. GitHub 로그인 → [Settings](https://github.com/settings)
2. 왼쪽 메뉴 → [Developer settings](https://github.com/settings/tokens)
3. [Generate new token] → [Generate new token (classic)]
4. 설정:
   - **Note**: "Vercel Deployment"
   - **Expiration**: 90 days
   - **Scopes**: `repo` (체크)
5. [Generate token] 클릭
6. 생성된 토큰 복사 (⚠️ 한 번만 보임!)

#### 2단계: Git remote 업데이트
```bash
# 현재 remote 제거
git remote remove origin

# 새 remote 추가 (토큰으로 교체)
git remote add origin https://YOUR_TOKEN@github.com/kwpark0047/opencode260124.git
```

#### 3단계: Push 실행
```bash
git add .
git commit -m "Fix: Git authentication with PAT"
git push origin main
```

### 방법 2: SSH 키 설정

#### 1단계: SSH 키 생성
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# 엔터 3번 누르기 (기본값 사용)
```

#### 2단계: SSH 퍼블릭 키 복사
```bash
cat ~/.ssh/id_ed25519.pub
# 출력된 내용 모두 복사
```

#### 3단계: GitHub에 SSH 키 등록
1. GitHub → Settings → [SSH and GPG keys](https://github.com/settings/keys)
2. [New SSH key] 클릭
3. 복사한 퍼블릭 키 붙여넣기
4. [Add SSH key] 클릭

#### 4단계: Git remote를 SSH로 변경
```bash
git remote set-url origin git@github.com:kwpark0047/opencode260124.git
git push origin main
```

### 방법 3: Git Credential Helper (Windows)

```bash
# Git Credential Helper 설정
git config --global credential.helper manager-core

# 그리고 일반 username/password로 인증
git push origin main
# 팝업에서 GitHub 로그인 정보 입력
```

## 🎯 즉시 해결 (방법 1 추천)

### 빠른 해결 스크립트
```bash
# 1. PAT를 환경변수로 설정
export GITHUB_TOKEN="your_personal_access_token_here"

# 2. remote 업데이트
git remote set-url origin https://${GITHUB_TOKEN}@github.com/kwpark0047/opencode260124.git

# 3. Push 실행
git push origin main
```

## 📋 체크리스트

### 사전 확인
- [ ] GitHub 계정 로그인 가능
- [ ] 저장소 접근 권한 있음
- [ ] PAT 생성 완료 (또는 SSH 키 설정)

### 실행 후 확인
- [ ] Git push 성공
- [ ] Vercel에서 자동 배포 시작
- [ ] 배포 URL 접속 가능

## 🔒 보안 주의사항

### PAT (Personal Access Token)
- ⚠️ **절대 공개 금지**: .gitignore에 추가
- ✅ **만료일 설정**: 90일로 설정
- 🔄 **정기적 갱신**: 만료 전에 새 토큰 생성

### SSH 키
- 🔐 **프라이빗 키 보호**: 절대 공개하지 않음
- 📱 **안전한 저장**: 홈 디렉토리에만 보관
- 🔄 **주기적 확인**: 키가 유효한지 확인

## 🆘 도움이 필요할 때

### GitHub 공식 문서
- [PAT 가이드](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [SSH 키 가이드](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

### Vercel 공식 문서
- [Git 연동 가이드](https://vercel.com/docs/concepts/git)

---

## 🎉 해결 완료 후

성공적으로 push가 완료되면:

1. **Vercel에서 자동 배포 시작** (2-3분 소요)
2. **배포 URL 생성**: `https://small-business-tracker.vercel.app`
3. **모든 설정 적용됨**: vercel.json, 환경변수, rewrites

**문제가 해결되면 알려주세요! 추가 지원이 필요하면 즉시 도와드리겠습니다.** 🚀
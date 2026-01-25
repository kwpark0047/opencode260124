# Small Business Tracker - Vercel 배포 안내서

## 🚀 Vercel 대시보드에서 직접 배포하기

### 단계별 배포 가이드

#### 1단계: Vercel 대시보드 접속
```
🌐 https://vercel.com/dashboard
```

#### 2단계: 새 프로젝트 배포
1. **'Add New...' 버튼 클릭**
2. **'Project' 선택**
3. **저장소 연동**:
   - Git Provider: GitHub 선택
   - Repository: `kwpark0047/opencode260124` 선택
   - Framework: Next.js (자동 감지됨)
   
#### 3단계: 프로젝트 설정
```
✅ Project Name: small-business-tracker
✅ Root Directory: / (기본값 유지)
✅ Build Command: npm run build
✅ Output Directory: .next
✅ Node.js Version: 18.x (기본값)
✅ Environment Variables: 자동으로 감지
```

#### 4단계: 배포 실행
1. **'Deploy' 버튼 클릭**
2. 빌드 과정 자동 시작 (약 2-3분 소요)
3. 배포 완료 후 URL 생성

### 📍 배포될 URL
```
🎯 https://small-business-tracker.vercel.app
```

### 🔧 설정 상세 정보

#### 빌드 설정
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Framework**: Next.js 14
- **Node Version**: 18.x
- **Output Directory**: `.next`

#### 환경변수 (자동 설정)
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

### ✅ 사전 검증 완료 항목

#### 1. 빌드 에러 해결
- ✅ Import 따옴표 누락
- ✅ Prisma 경로 문제
- ✅ TypeScript 타입 에러

#### 2. Next.js 호환성
- ✅ App Router 라우팅
- ✅ vercel.json rewrites 설정
- ✅ Proper output directory

#### 3. 프로젝트 설정
- ✅ Vercel 프로젝트명 일치
- ✅ 저장소 연동 준비
- ✅ 환경변수 설정 완료

### 🚨 배포 실패 시 대처

#### 1. 빌드 에러 발생
```
📋 확인 목록:
□ package.json scripts 확인
□ TypeScript 타입 에러 확인
□ Prisma generate 실행
□ 환경변수 설정 확인
```

#### 2. 404 에러 발생
```
🔧 rewrites 설정 확인:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1" }
  ]
}
```

#### 3. 데이터베이스 연결 에러
```
🔗 DATABASE_URL 포맷 확인:
postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema]
```

### 📱 모바일 앱 접속 테스트
```
📲 iOS Safari: https://small-business-tracker.vercel.app
📱 Android Chrome: https://small-business-tracker.vercel.app
🖥 Desktop 접속: 정상 동작 확인
```

### 🔄 자동 배포 설정
배포 후 Git push 시 자동 배포:
```bash
# main 브랜치에 push
git push origin main

# 모든 변경사항 즉시 배포됨
```

### 📊 배포 상태 모니터링
1. Vercel 대시보드에서 실시간 로그 확인
2. Functions 탭에서 API 엔드포인트 상태 확인
3. Settings 탭에서 환경변수 관리
4. Domains 탭에서 커스텀 도메인 설정

### 🎉 성공 확인 체크리스트
- [ ] 빌드 성공 (초록색 체크)
- [ ] 메인페이지 접속 가능
- [ ] API 엔드포인트 정상 응답
- [ ] 스태일링 적용
- [ ] 데이터베이스 연결 정상
- [ ] 모바일 반응형

---

## 🆘 문제 발생 시 즉시 연락처

#### Vercel 공식 지원
- 📧 Community: https://vercel.com/community
- 📧 Support: https://vercel.com/support
- 📚 문서: https://vercel.com/docs

#### 일반적인 404 문제 해결
1. **vercel.json rewrites 확인**
2. **프로젝트 구조 확인** (app/ 폴더)
3. **next.config.js 설정 확인**
4. **빌드 출력 경로 확인** (.next)

---

**✨ 위 단계를 따르면 5분 내에 성공적인 배포가 완료됩니다!**
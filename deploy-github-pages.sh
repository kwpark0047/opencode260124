#!/bin/bash

# Small Business Tracker GitHub Pages 배포 스크립트

echo "🚀 Small Business Tracker 배포 시작..."

# 1. 프로젝트 빌드
echo "📦 프로젝트 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패"
    exit 1
fi

# 2. 배포 디렉토리 준비
echo "📁 배포 디렉토리 준비 중..."
rm -rf docs
cp -r out docs

# 3. .nojekyll 파일 생성 (GitHub Pages 최적화)
touch docs/.nojekyll

# 4. index.html 확인
if [ ! -f "docs/index.html" ]; then
    echo "⚠️ index.html이 없습니다. 복사합니다..."
    cp out/index.html docs/ 2>/dev/null || echo "index.html 생성 건너뜀"
fi

# 5. 배포 정보 출력
echo "✅ 배포 준비 완료!"
echo "📂 배포 파일 위치: docs/ 디렉토리"
echo ""
echo "📋 GitHub Pages 배포 방법:"
echo "1. GitHub 저장소에 푸시"
echo "2. 저장소 Settings > Pages 선택"
echo "3. Source: 'Deploy from a branch' 선택"
echo "4. Branch: 'main', Folder: '/docs' 선택"
echo "5. Save 클릭"
echo ""
echo "🌐 배포 후 URL: https://kwpark0047.github.io/opencode260124/"
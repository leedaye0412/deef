import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. ESM 환경 설정 (이전과 동일)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 설정 ---
const INPUT_DIR = path.join(__dirname, 'public', 'images', 'original');
const OUTPUT_BASE_DIR = path.join(__dirname, 'public', 'images', 'webp'); // 최상위 출력 폴더
const QUALITY = 85;
const SIZES = [
  { name: 'mobile', width: 480 },
  { name: 'tablet', width: 800 },
  { name: 'desktop', width: 1440 },
];
// ------------

// 출력 기본 폴더 생성 (이전과 동일)
if (!fs.existsSync(OUTPUT_BASE_DIR)) {
  fs.mkdirSync(OUTPUT_BASE_DIR, { recursive: true });
}

try {
  const files = fs.readdirSync(INPUT_DIR, {
    recursive: true,
    withFileTypes: false,
  });

  files.forEach((file) => {
    const filePath = path.join(INPUT_DIR, file);

    // 폴더 경로는 건너뛰기
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }

    const fileExt = path.extname(file).toLowerCase();

    // 파일 이름과 확장자 제외한 순수 이름 추출
    const baseName = path.basename(file, fileExt);

    // ✨ 핵심 수정: INPUT_DIR을 기준으로 상대 경로를 추출합니다.
    // 예: file = '1/project-img.jpg' 일 때, relativeDir = '1'
    const relativePath = path.dirname(file);

    // 최종 출력 폴더를 설정합니다. 예: OUTPUT_BASE_DIR/1
    const OUTPUT_DIR = path.join(OUTPUT_BASE_DIR, relativePath);

    // 해당 하위 폴더가 없으면 생성
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
      SIZES.forEach((size) => {
        // 출력 파일명 예: '1/project-img-mobile.webp'
        const outputPath = path.join(OUTPUT_DIR, `${baseName}-${size.name}.webp`);

        sharp(filePath)
          .resize(size.width, null)
          .webp({ quality: QUALITY })
          .toFile(outputPath, (err, info) => {
            if (err) {
              console.error(`[오류] ${file} (${size.name}) 변환 실패:`, err);
            } else {
              console.log(
                `[성공] ${file} -> ${relativePath}/${baseName}-${size.name}.webp, 크기: ${(info.size / 1024).toFixed(2)} KB`,
              );
            }
          });
      });
    }
  });
} catch (err) {
  console.error('[치명적 오류] 원본 폴더를 읽는 중 오류 발생:', err);
}

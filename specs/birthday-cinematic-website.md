---
title: Birthday Cinematic Website
status: brainstorming
created: 2026-04-22
updated: 2026-04-22
refs.specs: []
refs.files:
  - public/opening.mp4
  - public/images/kiniem1.jpg
  - public/images/kiniem2.jpg
  - public/images/kiniem3.jpg
  - public/images/kiniem4.jpg
  - index.html
  - package.json
  - vite.config.js
---

## Intent

Xây dựng trang web chúc mừng sinh nhật dạng cinematic show bằng React 19 + Vite 8, dựa trên trang tham chiếu (vanilla JS + GSAP). Trang web bao gồm một trang Register giả (trông như hệ thống quản lý đồ án ĐH Sài Gòn) làm "bẫy" chuyển tiếp sang các scene sinh nhật chính với 7 scene đầy cảm xúc: Intro → Gate → Gallery (kỉ niệm + story) → Lucky Wheel → Teddy Bear → Letter → Finale.

## Decisions

1. **Single Page App, state-based scene switching** — Không dùng React Router. Register và Birthday page chuyển bằng state (`currentView: 'register' | 'birthday'`). Các scene birthday chuyển bằng `currentScene` state. Đơn giản, không cần thêm dependency.

2. **GSAP + Canvas cho animation** — Giới thiệu GSAP (đã có trong `node_modules` v3.15.0 nhưng chưa dùng) cho DOM animation (timeline, tween) trên các scene mới (Intro, Gate, Gallery effects, Letter, Finale). Canvas cho particle effects (sparkles, stars, fireworks, confetti). Pattern này dựa trên trang tham chiếu external (vanilla JS + GSAP + CDN), được adapt sang React qua refs và custom hooks.

3. **CSS: Tailwind + CSS Modules kết hợp** — Cần cài đặt và cấu hình Tailwind CSS v4 (dùng `@tailwindcss/vite` plugin cho Vite 8) trước khi bắt đầu. Tailwind cho layout, spacing, typography, responsive. CSS Modules cho complex animations, keyframes, và component-specific styles (effects, transitions).

4. **Scene Gallery: text sau ảnh** — Mỗi ảnh hiển thị trước với effects (glitter, parallax, bokeh, crystal, rainbow), sau đó ảnh mờ đi và câu chuyện xuất hiện dạng typing trên toàn màn hình, tương tự text-scene gốc nhưng với nội dung story cho mỗi ảnh.

5. **Lucky Wheel: lời chúc tượng trưng** — 8 ô trên vòng quay, mỗi ô là lời chúc mang tính biểu tượng (bình an, hạnh phúc, thành công, may mắn, tình yêu, sức khỏe, niềm vui, ước mơ). Dùng Canvas để vẽ và animate vòng quay.

6. **Letter Scene: phong bì mở ra** — Thay thế typing-text scene gốc bằng interaction: phong bì xuất hiện → user bấm → phong bì mở (flap animation) → lá thư trồi lên → chữ hiện dần trên thư. Nội dung placeholder, user điền sau.

7. **Register page: giao diện mặc định** — Form đăng ký đơn giản với header/logo giả của "Hệ thống quản lý đồ án — ĐH Sài Gòn". Tối giản, trông chân thực. Sau submit → chuyển sang birthday page.

## Scope

### Trong phạm vi
- Trang Register giả (form đơn giản, header trường ĐH)
- Intro Scene (video autoplay, fade transition)
- Gate Scene (portal animation + canvas stars)
- Gallery Scene (4 ảnh kỉ niệm, mỗi ảnh có effects + story text sau)
- Lucky Wheel Scene (vòng quay may mắn với 8 ô lời chúc)
- Teddy Bear Message Scene (gấu bông + lời chúc placeholder)
- Letter Scene (phong bì mở ra → lá thư → chữ hiện dần)
- Finale Scene (confetti + fireworks + Happy Birthday)
- Audio controls (nhạc nền)
- Responsive design (mobile-first)
- Smooth scene transitions (fade)

### Ngoài phạm vi
- Backend / API thật cho register
- Authentication thực tế
- Video editing / xử lý media
- Deploy / hosting

## Approach

**Complete rewrite** — Xây dựng lại toàn bộ từ blank (src/ đã bị xóa). Code cũ (scroll-based layout) sẽ không được tái sử dụng; kiến trúc mới là scene-based sequential flow.

**Bước 1: Setup** — Cài Tailwind CSS v4 (`@tailwindcss/vite` + `postcss`), cấu hình fonts (Great Vibes + Montserrat + Playfair Display từ trang gốc), setup `index.css` với `@import "tailwindcss"`.

**Bước 2: Core** — Xây dựng single-page React app với state machine: `currentView` (register | birthday) + `currentScene` (intro → gate → gallery → wheel → teddy → letter → finale). Mỗi scene là 1 React component, nhận `onComplete` callback. Fade transition giữa các scene.

**Bước 3: Animation layer** — GSAP (đã có v3.15.0) cho DOM animation qua refs. Canvas cho particle effects (stars, sparkles, fireworks, confetti). Logic animation tham khảo từ trang reference external, adapt sang React qua `useRef` + `useEffect`. Tổng cộng ~12 components, ~5 hooks, ~7 CSS Module files.

## Future Notes

- Nội dung placeholder (lời chúc gấu bông, lá thư, story cho mỗi ảnh) cần user điền
- Âm nhạc: trang reference dùng `<audio>` element cho nhạc nền; nếu dùng file mp3 thật thì cần `<audio>` element, nếu dùng Web Audio API synthesis thì dùng `AudioContext`
- Có thể thêm hiệu ứng sound khi vòng quay dừng, khi mở phong bì
- Có thể thêm nhiều ảnh kỉ niệm hơn trong tương lai
- Fonts cần reconcile: `index.html` hiện có Inter + Dancing Script, trang gốc dùng Great Vibes + Montserrat + Playfair Display

## Progress

All 7 scenes implemented:
- [x] RegisterPage
- [x] IntroScene
- [x] GateScene
- [x] GalleryScene (with auto-advance)
- [x] LuckyWheelScene
- [x] TeddyBearScene
- [x] LetterScene
- [x] FinaleScene

All scenes complete and integrated via App.jsx state machine.

## Review

<!-- Filled after implementation review -->

## Learnings

<!-- Filled after implementation is complete -->

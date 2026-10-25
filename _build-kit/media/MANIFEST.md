# Southwood media (pre-staged)

Public, no-login media from the live Wix site, pre-downloaded with `_build-kit/tools/fetch_media.py` on 2026-10-25 so the build can skip the slow download. `tools/fetch_media.py` remains only as a fallback. Do not merge this branch to main.

Paths: photos and logo in `_build-kit/media/img/`, videos and poster frames in `_build-kit/media/video/`.

## Processing notes

- Photos over 1 MB were re-encoded as progressive JPEG quality 82 (same pixel dimensions, EXIF stripped, orientation applied). Photos under 1 MB and the logo PNG are byte-identical to the Wix originals.
- All 8 videos were re-encoded: H.264 mp4, max 1280 wide, no audio (originals had AAC audio), yuv420p, faststart. CRF 33 for the 1080p-source and small 11 s clip, CRF 35 for the 720p-source clips. Frame rate and duration unchanged.
- Each video has a poster `.jpg` (frame at 1 s, max 1280 wide).
- Video file names are the Wix video ids; titles come from the intake sheet.

## Images

| File | Source URL | Dimensions | Size | Original size | Note |
|---|---|---|---|---|---|
| img/job-01.jpg | https://static.wixstatic.com/media/3c83c1_2e9c2bbbe2234fba876563c530d7e21b~mv2.jpg | 1080x1345 | 0.23 MB | 0.23 MB | unchanged |
| img/job-02.jpeg | https://static.wixstatic.com/media/3c83c1_627c4f07c2f14c7d9ffd49589773a7b0~mv2.jpeg | 1800x2400 | 0.59 MB | 2.30 MB | recompressed q82 |
| img/job-03.jpg | https://static.wixstatic.com/media/3c83c1_1fa5892f6bc043f28d58f19325ffd788~mv2.jpg | 4032x3024 | 0.99 MB | 0.99 MB | unchanged |
| img/job-04.jpg | https://static.wixstatic.com/media/3c83c1_6f9fe43786774fc2be92dfed698fd517~mv2.jpg | 1080x1350 | 0.25 MB | 0.25 MB | unchanged |
| img/job-05.jpg | https://static.wixstatic.com/media/3c83c1_d0224dea3506455f81eb3c8189fe39a6~mv2.jpg | 2400x1800 | 1.33 MB | 6.65 MB | recompressed q82 |
| img/job-06.jpg | https://static.wixstatic.com/media/3c83c1_5d9a5f999b2d4dd2bf7830e7f383d805~mv2.jpg | 1800x2400 | 1.14 MB | 6.06 MB | recompressed q82 |
| img/job-07.jpg | https://static.wixstatic.com/media/3c83c1_d931f72533174e87acf8cd34ce7574d7~mv2.jpg | 1800x2400 | 1.29 MB | 6.67 MB | recompressed q82 |
| img/job-08.jpg | https://static.wixstatic.com/media/3c83c1_9418c57685424a8c93159f52df0959c2~mv2.jpg | 1800x2400 | 1.17 MB | 6.06 MB | recompressed q82 |
| img/job-09.jpg | https://static.wixstatic.com/media/3c83c1_e7aa918afb9d4851bf38445742b25f58~mv2.jpg | 1800x2400 | 1.11 MB | 5.71 MB | recompressed q82 |
| img/job-10.jpg | https://static.wixstatic.com/media/3c83c1_f5f0594bf7c8468d80a5aa7bf38fe40d~mv2_d_3024_4032_s_4_2.jpg | 1800x2400 | 1.27 MB | 5.02 MB | recompressed q82 |
| img/job-11.jpg | https://static.wixstatic.com/media/3c83c1_1dddb3917d5840e496d8d96ab32f32f7~mv2_d_2448_3264_s_4_2.jpg | 1800x2400 | 0.53 MB | 2.06 MB | recompressed q82 |
| img/job-12.jpg | https://static.wixstatic.com/media/3c83c1_03fa806a9a90420c89afa13e578fba39~mv2.jpg | 1800x2400 | 1.05 MB | 5.69 MB | recompressed q82 |
| img/job-13.jpg | https://static.wixstatic.com/media/3c83c1_6d86cbac70ab40fdbdaa3f17e43a3e55~mv2.jpg | 1800x2400 | 1.43 MB | 7.65 MB | recompressed q82 |
| img/job-14.jpg | https://static.wixstatic.com/media/3c83c1_b4b2a13ad042424cb187bb6e1ba557f0~mv2.jpg | 1800x2400 | 1.61 MB | 8.37 MB | recompressed q82 |
| img/job-15.jpg | https://static.wixstatic.com/media/3c83c1_c2b4162583db472db90a081f6f73e4d4~mv2.jpg | 1800x2400 | 1.36 MB | 7.31 MB | recompressed q82 |
| img/job-16.jpg | https://static.wixstatic.com/media/3c83c1_1112bc0b1e914b2f98df82d8922185c3~mv2.jpg | 1800x2400 | 0.79 MB | 4.21 MB | recompressed q82 |
| img/job-17.jpg | https://static.wixstatic.com/media/3c83c1_36252c660331424b9af80e68db1f09af~mv2.jpg | 1800x2400 | 0.92 MB | 3.89 MB | recompressed q82 |
| img/job-18.jpg | https://static.wixstatic.com/media/3c83c1_00587f38a8da4ce9a1aa20f9f750671a~mv2.jpg | 1800x2400 | 1.01 MB | 5.44 MB | recompressed q82 |
| img/job-19.jpg | https://static.wixstatic.com/media/3c83c1_c53d3c4f44c74aa6aedd243c900180be~mv2.jpg | 1800x2400 | 1.33 MB | 6.87 MB | recompressed q82 |
| img/job-20.jpg | https://static.wixstatic.com/media/3c83c1_11ef158f66b043cf83a7c59c926ba0f1~mv2.jpg | 1800x2400 | 1.08 MB | 5.46 MB | recompressed q82 |
| img/job-21.jpg | https://static.wixstatic.com/media/3c83c1_217050962d6a4cdaa8c7d4ae4d733958~mv2.jpg | 1080x1345 | 0.13 MB | 0.13 MB | unchanged |
| img/job-22.jpg | https://static.wixstatic.com/media/3c83c1_63a378e18f4046ee9b4962501cedf882~mv2_d_4032_3021_s_4_2.jpg | 2400x1798 | 1.41 MB | 5.60 MB | recompressed q82 |
| img/job-23.jpg | https://static.wixstatic.com/media/3c83c1_521d7f140eb348c491db972cbdef26a3~mv2.jpg | 1280x1057 | 0.61 MB | 0.61 MB | unchanged |
| img/job-24.jpg | https://static.wixstatic.com/media/3c83c1_a386866881bb40dbbdc54239c93a40f5~mv2.jpg | 1080x809 | 0.31 MB | 0.31 MB | unchanged |
| img/logo.png | https://static.wixstatic.com/media/3c83c1_2dd6b54fec4a4f22ba800396d073c6ad~mv2.png | 2500x1738 | 0.15 MB | 0.15 MB | unchanged |

## Videos

| File | Title (intake sheet) | Source | Dimensions | Duration | Size | Original size | Poster |
|---|---|---|---|---|---|---|---|
| video/3c83c1_63d45f84021f4f5e987a453b0db6b870.mp4 | Backyard Ash Tree Removal (rigged down every piece with ropes) | Wix video 3c83c1_63d45f84021f4f5e987a453b0db6b870 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 44.2 s | 8.22 MB | 17.15 MB | video/3c83c1_63d45f84021f4f5e987a453b0db6b870.jpg |
| video/3c83c1_7728a2817d4543a58e124b4e15b443db.mp4 | Backyard Ash Removal In A Tight Spot | Wix video 3c83c1_7728a2817d4543a58e124b4e15b443db (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 91.8 s | 8.22 MB | 64.47 MB | video/3c83c1_7728a2817d4543a58e124b4e15b443db.jpg |
| video/3c83c1_90ffe750e1ce44cabce870926e1d8e37.mp4 | Staying Hydrated On The Job! (30ft up) | Wix video 3c83c1_90ffe750e1ce44cabce870926e1d8e37 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 10.9 s | 1.59 MB | 6.23 MB | video/3c83c1_90ffe750e1ce44cabce870926e1d8e37.jpg |
| video/3c83c1_a3dfdb48f5654a37be6e175335ce72f6.mp4 | Zipling Limbs (zipling the limbs away from the clients fence into the front yard) | Wix video 3c83c1_a3dfdb48f5654a37be6e175335ce72f6 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 59.9 s | 9.70 MB | 22.84 MB | video/3c83c1_a3dfdb48f5654a37be6e175335ce72f6.jpg |
| video/3c83c1_a946b9b1fdd24f95bdb3dd9966e2d879.mp4 | Zip Lining Ash Limbs | Wix video 3c83c1_a946b9b1fdd24f95bdb3dd9966e2d879 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 56.2 s | 3.91 MB | 40.97 MB | video/3c83c1_a946b9b1fdd24f95bdb3dd9966e2d879.jpg |
| video/3c83c1_d0ed2dc3969e4f39afab83deea0e4c56.mp4 | How much wood would a woodchuck chuck if a woodchuck could chuck wood? | Wix video 3c83c1_d0ed2dc3969e4f39afab83deea0e4c56 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 35.2 s | 1.39 MB | 10.77 MB | video/3c83c1_d0ed2dc3969e4f39afab83deea0e4c56.jpg |
| video/3c83c1_edf39517387148ddad4f7c2355990759.mp4 | Backyard Ash Tree Ground Drop | Wix video 3c83c1_edf39517387148ddad4f7c2355990759 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 14.9 s | 0.85 MB | 5.02 MB | video/3c83c1_edf39517387148ddad4f7c2355990759.jpg |
| video/3c83c1_fbd88a804d8d4014a99c822bb9064305.mp4 | Backyard Boxelder Tree Removal (drive to job then removal) | Wix video 3c83c1_fbd88a804d8d4014a99c822bb9064305 (playback HLS stream, caught from https://southwoodtreeservice.wixsite.com/southwood/videos) | 1280x720 | 123.2 s | 16.26 MB | 84.05 MB | video/3c83c1_fbd88a804d8d4014a99c822bb9064305.jpg |

## Totals

- Total on disk (before this manifest): 74.27 MB in 41 files (25 images incl. logo, 8 videos, 8 posters).
- Originals total was about 339 MB (99 MB photos, 240 MB video).
- Nothing was left out.

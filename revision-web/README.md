# RE:VISION – Kính cũ, Tầm nhìn mới

Website Next.js App Router cho dự án hỗ trợ kiểm tra thị lực và trao kính cho trẻ em tại Gia Lai.

## Chạy trên máy tính

Yêu cầu Node.js 22.13 trở lên. Từ thư mục gốc repo, dùng PowerShell:

```powershell
cd revision-web
npm.cmd install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm.cmd run dev
```

Trên PowerShell, gọi `npm.cmd` để chạy npm khi chính sách thực thi chặn `npm.ps1`.

Mở [localhost:3000](http://localhost:3000). Khởi động lại máy chủ sau khi sửa `.env.local`.

Để thiết bị khác tại trường mở website, chạy `npm.cmd run dev -- --hostname 0.0.0.0` và mở `http://<IP-máy-chủ>:3000` trong cùng mạng. Chỉ dùng chế độ phát triển trên mạng tin cậy. Khi vận hành với hồ sơ học sinh, dùng HTTPS. Chế độ SQLite lưu và đọc phiếu qua mạng nội bộ ngay cả khi máy chủ mất Internet.

## Lưu và xuất dữ liệu trên máy tính

Đặt `SUBMISSION_STORAGE=sqlite` trong `.env.local` để dùng cơ sở dữ liệu SQLite trên máy chạy website. Ứng dụng tạo `.data/revision.sqlite` khi đọc hoặc lưu phiếu lần đầu. Tắt và mở lại website vẫn giữ nguyên các phiếu đã lưu. Để sao lưu, dừng máy chủ rồi sao chép tệp SQLite đến nơi dành riêng cho ban tổ chức.

Mở [trang quản trị](http://localhost:3000/login), đăng nhập rồi bấm **Tải Excel** hoặc **Tải CSV**. Cả hai nút xuất toàn bộ phiếu, kể cả khi bảng đang lọc. Giữ các tệp xuất ở nơi riêng tư vì chúng chứa hồ sơ học sinh.

Khi chuyển sang `SUBMISSION_STORAGE=google-sheets`, ứng dụng đọc và ghi trực tiếp vào bảng tính đã cấu hình. Muốn chuyển các phiếu local, tải CSV trước khi đổi chế độ và nhập vào tab `Submissions` của bảng tính mới còn trống. Giữ ngày khám ở dạng văn bản ISO `YYYY-MM-DD`. Dữ liệu giữa hai nguồn được chuyển thủ công.

## Cấu hình Google Sheets

Chọn `SUBMISSION_STORAGE=google-sheets` để dùng nguồn này. Máy chủ cần Internet để đọc và ghi bảng tính.

1. Trong [Google Cloud Console](https://console.cloud.google.com/), tạo hoặc chọn dự án, rồi bật **Google Sheets API**.
2. Vào **IAM & Admin → Service Accounts**, tạo tài khoản dịch vụ. Trong **Keys**, tạo khóa JSON. Giữ file này ở nơi riêng tư.
3. Tạo một bảng tính riêng, đổi tên tab thành **Submissions**, rồi chia sẻ bảng tính với email tài khoản dịch vụ ở quyền **Editor**. Chỉ gửi quyền xem hoặc sửa cho các tài khoản ban tổ chức cần quyền truy cập.
4. Điền biến môi trường theo bảng dưới. Với private key, có thể giữ ký tự xuống dòng của PEM trong giá trị nhiều dòng hoặc dùng chuỗi `\n` trong giá trị.
5. Gửi một phiếu thử. Ứng dụng tự tạo hàng tiêu đề A1:R1 nếu còn trống. Giữ tên tab và cấu trúc cột, mỗi hàng từ hàng 2 là một phiếu.

| Biến môi trường | Giá trị |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` trong khóa JSON |
| `GOOGLE_PRIVATE_KEY` | `private_key` trong khóa JSON, gồm cả dòng BEGIN/END |
| `GOOGLE_SHEET_ID` | Đoạn giữa `/d/` và `/edit` trong URL bảng tính |
| `ADMIN_USERNAME` | Tên tài khoản ban tổ chức |
| `ADMIN_PASSWORD` | Mật khẩu dài, ngẫu nhiên, dành riêng cho website |
| `JWT_SECRET` | Bí mật ký phiên, ít nhất 32 byte và dành riêng cho website |

Tạo bí mật ngẫu nhiên bằng `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Nếu giá trị trong `.env.local` chứa dấu đô la, viết `\$` để Next.js giữ ký tự này. Mỗi phiên quản trị hết hạn sau 8 giờ. Đổi `JWT_SECRET` để thu hồi toàn bộ phiên hiện tại.

## Triển khai Vercel

1. Import repo vào Vercel, chọn preset **Next.js** và đặt **Root Directory** thành `revision-web`.
2. Chọn phiên bản Node.js 22 hoặc mới hơn. Đặt `SUBMISSION_STORAGE=google-sheets` và thêm sáu biến kết nối và đăng nhập trong **Settings → Environment Variables** cho môi trường cần dùng. Dùng bảng tính riêng cho các lần thử nếu cấu hình Preview.
3. Deploy. Các API dùng Node.js Functions. Edge Middleware kiểm tra phiên trên `/dashboard`. Trang và API quản trị cũng kiểm tra phiên trước khi truy xuất dữ liệu.
4. Trên tên miền HTTPS, kiểm tra một phiếu thử từ lúc điền đến lúc thấy đủ 18 cột trong Google Sheets. Đăng nhập, lọc phiếu và tải cả Excel lẫn CSV. Xóa bản ghi thử trước khi mở đợt sàng lọc.
5. Nếu cấu hình Vercel Firewall, đặt giới hạn yêu cầu phù hợp cho `POST /api/auth` và `POST /api/screening`.

`npm.cmd run typecheck` kiểm tra TypeScript. `npm.cmd run build` tạo bản production và `npm.cmd start` chạy bản build. Trong bảng điều khiển, KPI “Có dấu hiệu cần kiểm tra” đếm phiếu có ít nhất một dấu hiệu được chọn. Ngày khám mặc định và KPI hôm nay dùng múi giờ Việt Nam. Excel và CSV xuất toàn bộ phiếu.

Tài liệu tham khảo: [Google Sheets API](https://developers.google.com/workspace/sheets/api/quickstart), [Next.js Middleware](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware), [Biến môi trường Vercel](https://vercel.com/docs/environment-variables).

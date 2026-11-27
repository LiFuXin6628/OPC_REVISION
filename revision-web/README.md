# RE:VISION – SEE CLEARER - DREAM BIGGER

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

## Phân biệt các tệp môi trường

`.env.example` là mẫu liệt kê các tên biến và hướng dẫn điền. Next.js đọc các giá trị thật từ `.env.local` khi chạy trên máy. `.env.local` được Git bỏ qua để giữ riêng mật khẩu và khóa. Các giá trị trên máy cần được khai báo riêng trong dự án Vercel.

Đăng nhập cần đủ `ADMIN_USERNAME`, `ADMIN_PASSWORD` và `JWT_SECRET` có ít nhất 32 byte. Thông báo “Quản trị viên chưa được cấu hình” xuất hiện khi thiếu một trong ba giá trị này hoặc khóa ký quá ngắn. Nhật ký máy chủ cho biết tên biến chưa hợp lệ và giữ riêng giá trị của chúng.

Để sửa trên Vercel, mở đúng project → **Settings → Environment Variables**, thêm ba giá trị tương ứng trong `.env.local`, chọn môi trường **Production** cho tên miền chính và **Preview** nếu cần thử nhánh. Sau khi lưu, vào **Deployments → Redeploy** để tạo deployment mới. Giữ tên biến đúng như mẫu và giữ các giá trị ở phía máy chủ. Cấu hình **Root Directory** thành `revision-web`.

## Quyền truy cập phiếu sàng lọc

Quản trị viên đăng nhập qua `/login` để nhìn thấy mục **Sàng lọc** và **Quản lý** trên cả thanh điều hướng máy tính và menu điện thoại. Trang `/screening`, màn hình xác nhận và API gửi phiếu đều kiểm tra phiên quản trị. Khi phiên hết hạn, cần đăng nhập lại trước khi tiếp tục.

Để thiết bị khác tại trường mở website, chạy `npm.cmd run dev -- --hostname 0.0.0.0` và mở `http://<IP-máy-chủ>:3000` trong cùng mạng. Chỉ dùng chế độ phát triển trên mạng tin cậy. Khi vận hành với hồ sơ học sinh, dùng HTTPS. Chế độ SQLite lưu và đọc phiếu qua mạng nội bộ ngay cả khi máy chủ mất Internet.

## Lưu và xuất dữ liệu trên máy tính

Đặt `SUBMISSION_STORAGE=sqlite` trong `.env.local` để dùng cơ sở dữ liệu SQLite trên máy chạy website. Ứng dụng tạo `.data/revision.sqlite` khi đọc hoặc lưu phiếu lần đầu. Tắt và mở lại website vẫn giữ nguyên các phiếu đã lưu. Để sao lưu, dừng máy chủ rồi sao chép tệp SQLite đến nơi dành riêng cho ban tổ chức.

Mở [trang quản trị](http://localhost:3000/login), đăng nhập rồi bấm **Tải Excel** hoặc **Tải CSV**. Cả hai nút xuất toàn bộ phiếu, kể cả khi bảng đang lọc. Excel chia thành các tab YYYY-MM-DD theo ngày điền phiếu. CSV có một bảng, gồm cột ngày điền phiếu để lọc. Để xem đủ các tab trên Google Sheets khi dùng SQLite, tải Excel và mở tệp bằng Google Sheets trên Google Drive. Giữ các tệp xuất ở nơi riêng tư vì chúng chứa hồ sơ học sinh.

Khi chuyển sang `SUBMISSION_STORAGE=google-sheets`, ứng dụng đọc và ghi trực tiếp vào bảng tính đã cấu hình. Muốn chuyển các phiếu local, tải CSV trước khi đổi chế độ và nhập vào tab `Submissions` của bảng tính mới còn trống. Giữ ngày khám ở dạng văn bản ISO `YYYY-MM-DD`. Dữ liệu giữa hai nguồn được chuyển thủ công.

## Cấu hình Google Sheets

Chọn `SUBMISSION_STORAGE=google-sheets` để dùng nguồn này. Máy chủ cần Internet để đọc và ghi bảng tính.

1. Trong [Google Cloud Console](https://console.cloud.google.com/), tạo hoặc chọn dự án, rồi bật **Google Sheets API**.
2. Vào **IAM & Admin → Service Accounts**, tạo tài khoản dịch vụ. Trong **Keys**, tạo khóa JSON. Giữ file này ở nơi riêng tư.
3. Tạo một bảng tính riêng, rồi chia sẻ bảng tính với email tài khoản dịch vụ ở quyền **Editor**. Chỉ gửi quyền xem hoặc sửa cho các tài khoản ban tổ chức cần quyền truy cập.
4. Điền biến môi trường theo bảng dưới. Với private key, có thể giữ ký tự xuống dòng của PEM trong giá trị nhiều dòng hoặc dùng chuỗi `\n` trong giá trị.
5. Gửi một phiếu thử. Ứng dụng tự tạo tab theo ngày điền phiếu (YYYY-MM-DD), kèm 32 tiêu đề cột A:AF. Mỗi hàng từ hàng 2 là một phiếu. Các tab Submissions định dạng cũ tiếp tục được đọc và dữ liệu cũ sẽ được phân ngày theo thời gian nộp ở múi giờ Việt Nam.

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
3. Deploy. Các API dùng Node.js Functions. Edge Middleware kiểm tra phiên trên `/dashboard` và `/screening`. Trang và API quản trị cũng kiểm tra phiên trước khi truy xuất hoặc ghi dữ liệu. Cấu hình biến mới cần được áp dụng bằng một deployment mới.
4. Trên tên miền HTTPS, kiểm tra một phiếu thử từ lúc điền đến lúc thấy đủ 32 cột trong Google Sheets. Đăng nhập, lọc phiếu và tải cả Excel lẫn CSV. Xóa bản ghi thử trước khi mở đợt sàng lọc.
5. Nếu cấu hình Vercel Firewall, đặt giới hạn yêu cầu phù hợp cho `POST /api/auth` và `POST /api/screening`.

`npm.cmd run typecheck` kiểm tra TypeScript. `npm.cmd run build` tạo bản production và `npm.cmd start` chạy bản build. Trong bảng điều khiển, KPI “Có dấu hiệu cần kiểm tra” đếm phiếu có ít nhất một dấu hiệu được chọn. Mỗi lần khám là một phiếu. Các lần khám lại được giữ trong lịch sử và phân theo ngày điền phiếu. Phiếu cùng ngày nằm chung một tab. Ứng dụng giữ các phiếu có cùng tên vì học sinh có thể trùng tên. Ngày khám mặc định và KPI hôm nay dùng múi giờ Việt Nam. Excel và CSV xuất toàn bộ phiếu.

Tài liệu tham khảo: [Google Sheets API](https://developers.google.com/workspace/sheets/api/quickstart), [Next.js Middleware](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware), [Biến môi trường Vercel](https://vercel.com/docs/environment-variables).

## Các trường mới trong phiếu

Phiếu gồm trường học và ngày điền phiếu, cùng sáu thông số riêng cho mắt trái và mắt phải gồm thị lực không kính (/10), SPH (D), CYL (D), AXIS (độ), thị lực có kính (/10) và loại kính. Để trống thông số chưa đo. Thị lực nhập phần tử số từ 0 đến 10, AXIS nhập số nguyên từ 0 đến 180. SPH và CYL có thể là số âm hoặc dương. Các giá trị bằng 0 được lưu và xuất nguyên vẹn.

Trường học mặc định là **Trường TH&THCS Chư Đang Ya** và có thể chỉnh trong phiếu. Lớp gồm 1A, 1B, 1C đến 5A, 5B, 5C. Dữ liệu đã lưu với tên lớp cũ được giữ nguyên và vẫn có thể lọc, xem hoặc xuất.

Ngày điền phiếu quyết định tab xuất, còn ngày khám ghi nhận ngày thực hiện khám. Với dữ liệu cũ thiếu trường mới, phần thông số để trống và ngày điền phiếu được lấy từ thời gian nộp.

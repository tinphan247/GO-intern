# G-Scores - Hệ thống Tra cứu và Thống kê Điểm thi THPT Quốc gia 2024

**G-Scores** là một ứng dụng web chuyên nghiệp được xây dựng để tra cứu điểm thi cá nhân và phân tích, thống kê dữ liệu điểm thi THPT Quốc gia năm 2024 từ tập dữ liệu hơn 1 triệu thí sinh. Dự án được triển khai bằng **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Prisma ORM (v7)**, **PostgreSQL (Supabase)** và được đóng gói hoàn chỉnh bằng **Docker**.

---

## 🚀 Tính năng nổi bật

1. **Hiệu năng Seed dữ liệu đám mây vượt trội (Streaming CSV Parser):**
   - Đọc dữ liệu từ file CSV khổng lồ bằng cơ chế `ReadStream` dòng dữ liệu chạy tuần tự kết hợp thư viện `readline`.
   - Ghi dữ liệu hàng loạt (Bulk Insert) bằng `prisma.student.createMany` theo từng lô `10,000` dòng dữ liệu để tối ưu tốc độ chèn dữ liệu mà không sợ tràn bộ nhớ RAM.
   - Sử dụng cơ chế lọc trùng SBD và tính năng chống trùng khóa `skipDuplicates: true` của PostgreSQL để đảm bảo quá trình ghi dữ liệu diễn ra liên tục và an toàn.
   - Tính toán trước các chỉ số thống kê môn học (`SubjectStats`) trong quá trình seed để tối ưu tốc độ hiển thị biểu đồ trên giao diện chính.
2. **Tra cứu điểm thi theo Số báo danh (SBD):**
   - Hỗ trợ tra cứu điểm thi tức thời.
   - Tích hợp kiểm tra (validation) định dạng SBD 8 chữ số ở cả Frontend (ngăn chặn yêu cầu không hợp lệ ngay tại trình duyệt) và Backend (API Router `/api/students/[sbd]`).
   - Hiển thị bảng phân tích điểm thi trực quan kèm theo cảnh báo học tập nếu thí sinh có môn học dưới 4.0 điểm.
3. **Phổ điểm phân phối theo 4 cấp độ học lực (Grouped Bar Chart):**
   - Thống kê tỷ lệ học sinh theo 4 cấp độ học lực: **Giỏi (>= 8.0)**, **Khá (6.0 - 8.0)**, **Trung bình (4.0 - 6.0)**, **Yếu (< 4.0)**.
   - Hiển thị trực quan dưới dạng biểu đồ cột nhóm sắc nét thông qua thư viện `recharts`.
4. **Bảng xếp hạng Top 10 Thủ khoa Khối A (Toán, Vật lý, Hóa học):**
   - Sử dụng câu lệnh truy vấn thô (`$queryRaw`) được tối ưu hóa cao.
   - Tạo chỉ mục phức hợp (composite index) trên cơ sở dữ liệu `@@index([toan, vat_li, hoa_hoc])` giúp tốc độ lấy danh sách Top 10 hoàn thành trong chưa đầy 10ms trên tổng số hơn 1 triệu bản ghi.
5. **Giao diện Light Theme & Responsive chuyên nghiệp:**
   - Thiết kế giao diện sáng (Light Theme) tinh tế, hiện đại với phong cách phẳng (flat design) kết hợp bóng đổ nhẹ nhàng (`box-shadow`).
   - Khả năng tương thích hoàn hảo trên các loại màn hình khác nhau (Desktop, Tablet, Mobile) thông qua hệ thống Responsive CSS thuần.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** Next.js 16 (App Router), React 19, Recharts, Lucide Icons, Vanilla CSS thuần.
- **Backend:** Next.js API Routes (Route Handlers), Lập trình hướng đối tượng (OOP) với TypeScript.
- **Database & ORM:** PostgreSQL (Supabase/Neon), Prisma ORM (v7).
- **DevOps & Containerization:** Docker, Docker Compose.

---

## 📂 Cấu trúc thư mục chính

```text
├── dataset/                     # Chứa tệp dữ liệu gốc diem_thi_thpt_2024.csv
├── prisma/                      # Cấu hình Prisma ORM
│   ├── schema.prisma            # Định nghĩa các bảng cơ sở dữ liệu (Student, SubjectStats)
│   └── seed.ts                  # Logic đọc stream CSV và seed cơ sở dữ liệu
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # Các API Endpoint (students, stats, group-a)
│   │   ├── globals.css          # Giao diện CSS toàn cục (Light Theme)
│   │   ├── layout.tsx           # Layout chung của ứng dụng
│   │   └── page.tsx             # Giao diện chính Dashboard & Tra cứu
│   ├── lib/
│   │   └── db.ts                # Khởi tạo Prisma Client kết nối PostgreSQL
│   └── models/
│       └── subject.ts           # Kiến trúc lập trình hướng đối tượng (OOP ExamSubject)
├── prisma.config.ts             # File cấu hình của Prisma 7
├── Dockerfile                   # Cấu hình Docker build ứng dụng Next.js
└── docker-compose.yml           # Quản lý container chạy ứng dụng
```

---

## 📐 Thiết kế hướng đối tượng (OOP Design)

Để tuân thủ yêu cầu bắt buộc sử dụng **Lập trình hướng đối tượng (OOP)** để quản lý các môn học, mã nguồn đã triển khai cấu trúc class rõ ràng tại `src/models/subject.ts`:
- **`ExamSubject` (Abstract Class):** Chứa các phương thức dùng chung như kiểm tra tính hợp lệ của điểm thi (`isValidScore`) và xếp loại học lực (`classifyLevel`).
- **`StandardSubject`, `LiteratureSubject`, `ForeignLanguageSubject`:** Các lớp kế thừa từ lớp cha `ExamSubject`, cho phép mở rộng hoặc ghi đè (Override) phương thức riêng biệt cho từng môn cụ thể.
- **`SubjectRegistry`:** Class quản lý tập trung toàn bộ các thực thể môn học, giúp việc khởi tạo và ánh xạ từ mã môn học sang đối tượng OOP diễn ra thống nhất.

---

## 💻 Hướng dẫn chạy dự án Locally

### Điều kiện tiên quyết
- Cài đặt **Node.js** phiên bản `>= 18.0.0`
- Cài đặt **NPM** phiên bản `>= 9.0.0`

### Bước 1: Tải mã nguồn và cài đặt thư viện
```bash
# Clone dự án từ repository của bạn
git clone <repository-url>
cd webdev-intern-assignment-3-main

# Cài đặt toàn bộ các thư viện phụ thuộc
npm install
```

### Bước 2: Thiết lập biến môi trường
Tạo tệp `.env` tại thư mục gốc của dự án và điền thông tin kết nối database PostgreSQL đám mây (ví dụ sử dụng Supabase):
```env
DATABASE_URL="postgresql://postgres.[username]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

### Bước 3: Đồng bộ cơ sở dữ liệu và Seed dữ liệu gốc
Đảm bảo bạn đã đặt file dữ liệu gốc `diem_thi_thpt_2024.csv` vào bên trong thư mục `/dataset/` trước khi tiến hành seed.
```bash
# Tạo cấu trúc bảng dữ liệu trên Cloud qua Prisma
npx prisma db push

# Tiến hành seed dữ liệu từ file CSV lên Cloud (Mất khoảng 2-3 phút)
npx prisma db seed
```

### Bước 4: Khởi chạy môi trường phát triển (Development Server)
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### Bước 5: Build và khởi chạy môi trường Production
```bash
# Biên dịch và tối ưu hóa dự án
npm run build

# Khởi chạy server production
npm run start
```

---

## ☁️ Hướng dẫn triển khai lên Vercel

Dự án đã được tối ưu hóa hoàn toàn để triển khai lên **Vercel** chỉ với vài thao tác đơn giản:

1. **Kết nối mã nguồn:** Đẩy code mới nhất của bạn lên kho lưu trữ GitHub và import dự án vào Vercel.
2. **Cấu hình biến môi trường:** Trong giao diện cài đặt dự án trên Vercel (**Settings** -> **Environment Variables**), thêm biến môi trường sau:
   - **Key:** `DATABASE_URL`
   - **Value:** Điền đường dẫn kết nối PostgreSQL của Supabase giống như trong file `.env` local.
3. **Cơ chế tự động biên dịch:** Dự án đã được tích hợp tập lệnh tự động chạy `npx prisma generate` trong quá trình build của Vercel (thông qua lệnh `"build"` trong file `package.json`), bảo đảm Prisma Client luôn được cập nhật chính xác trên môi trường Serverless.

Sau khi thiết lập, Vercel sẽ tự động hoàn tất việc build và kích hoạt ứng dụng của bạn trực tuyến.

---

## 👨‍💻 Người thực hiện

- **Họ và tên:** [Tên của bạn]
- **Vị trí ứng tuyển:** Web Developer Intern - Golden Owl

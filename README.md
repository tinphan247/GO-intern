
**Demo Link:** [https://go-intern-bxmrldqs1-tinphan247s-projects.vercel.app]
---

##  Hướng Dẫn Chạy Dự Án Locally

### Điều kiện tiên quyết
- Cài đặt **Node.js** phiên bản `>= 18.0.0`
- Cài đặt **NPM** phiên bản `>= 9.0.0`

### Bước 1: Tải mã nguồn và cài đặt thư viện
```bash
# Clone dự án từ repository
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

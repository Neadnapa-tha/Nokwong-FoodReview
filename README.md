# Nokwong Food Review System

ระบบรีวิวร้านอาหารที่พัฒนาด้วย Node.js, Express.js และ MySQL สำหรับการจัดการข้อมูลร้านอาหาร การรีวิว และการจัดการผู้ดูแลระบบ

## 📋 คุณสมบัติหลัก

- **หน้าแรก (Homepage)**: แสดงรายการร้านอาหารที่มีการรีวิวแล้ว
- **ค้นหาร้านอาหาร**: ค้นหาตามชื่อร้าน ประเภท และคะแนน
- **เมนูอาหาร**: ค้นหาส่วนผสม (Ingredients) โดยใช้ API ภายนอก
- **ระบบ Admin**: จัดการข้อมูลร้านอาหาร ผู้ดูแลระบบ และ Audit Trail
- **ระบบสมาชิก**: ลงทะเบียนและเข้าสู่ระบบ

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน

### ขั้นตอนที่ 1: เตรียมไฟล์โปรเจค

1. ดาวน์โหลดไฟล์ `Nokwong-FoodReview.zip`
2. สร้างโฟลเดอร์ใหม่ชื่อ `project` (หรือชื่ออื่นตามต้องการ)
3. แตกไฟล์ zip และนำไฟล์ทั้งหมดจากโฟลเดอร์ `sec1_gr15_src` และ `sec1_gr15_ws_src` มาใส่ในโฟลเดอร์ `project`
4. เปิดโฟลเดอร์ `project` ด้วย Visual Studio Code

### ขั้นตอนที่ 2: ตั้งค่า Database

1. เปิดโปรแกรม **MySQL Workbench**
2. เปิดไฟล์ `sec1_gr15_database.sql`
3. รันคำสั่งทั้ง 8 ส่วนตามที่ comment ไว้ในไฟล์
4. จะได้ Database 1 ฐาน และ Tables 3 ตาราง:
   - **Admin**: เก็บข้อมูลผู้ดูแลระบบ
   - **AuditTrail**: เก็บประวัติการเข้าสู่ระบบ
   - **ManageContent**: เก็บข้อมูลร้านอาหาร

5. สร้าง Database User:
   - ไปที่ Server → User and Privileges → Add Account
   - กรอกข้อมูล:
     - **Login Name**: AdminNokwong
     - **Limit to Hosts Matching**: localhost
     - **Password**: AdminNokwong
   - ตั้งค่าสิทธิ์:
     - Schema Privileges → Add Entry → Selected schema → NokWongDB
     - เลือกสิทธิ์: SELECT, INSERT, UPDATE, DELETE, EXECUTE, SHOW VIEW

### ขั้นตอนที่ 3: ติดตั้ง Dependencies

เปิด Terminal ใน Visual Studio Code และรันคำสั่งต่อไปนี้:

```bash
# เริ่มต้นโปรเจค
npm init

# ติดตั้ง dependencies
npm install express
npm install nodemon
npm install dotenv
npm install mysql2
```

แก้ไขไฟล์ `package.json` โดยเพิ่มในส่วน scripts:

```json
{
  "scripts": {
    "start": "nodemon server.js"
  }
}
```

เริ่มต้นเซิร์ฟเวอร์:

```bash
npm start
```

### ขั้นตอนที่ 4: เข้าใช้งานระบบ

เปิด Google Chrome และไปที่ `http://localhost:3000`

## 🖥️ หน้าต่างและฟังก์ชันการใช้งาน

### หน้าหลัก (Homepage)
- **URL**: `http://localhost:3000/`
- แสดงรายการร้านอาหารที่มีการรีวิว
- สามารถกดปุ่ม "View" เพื่อดูรายละเอียดการรีวิว

### Navigation Bar
- **Home**: กลับสู่หน้าหลัก
- **Search Restaurant**: ค้นหาร้านอาหาร
- **Food Menu**: ค้นหาส่วนผสมอาหาร
- **AboutUs**: ข้อมูลทีมผู้พัฒนา
- **Login**: เข้าสู่ระบบ
- **Sign-up**: ลงทะเบียนสมาชิก

### ระบบค้นหา
- **URL**: `http://localhost:3000/Search`
- ค้นหาได้จาก 3 หมวดหมู่:
  - ชื่อร้านอาหาร
  - ประเภทร้าน (Drink, Food, Dessert)
  - คะแนนของร้าน

### Food Menu
- **URL**: `http://localhost:3000/RecipeMenu`
- ค้นหาส่วนผสมอาหาร (เช่น "Egg")
- ใช้ API ภายนอก
- กดที่ "Get Recipe" เพื่อดูรายละเอียด

### ระบบสมาชิก
- **Register**: `http://localhost:3000/Register`
- **Login**: `http://localhost:3000/login`

## 👨‍💼 ระบบ Admin

### เข้าสู่ระบบ Admin
- **URL**: `http://localhost:3000/admin/LoginAdmin`
- **ข้อมูลทดสอบ**:
  - Email: `neadnapa.tha@student.mahidol.ac.th`
  - Password: `6487069`

### Manage Admin
- **URL**: `http://localhost:3000/admin/manageadmin`
- ค้นหา Admin ได้จาก ID, Firstname, Job
- สามารถเพิ่ม, แก้ไข, ลบข้อมูล Admin

### Add Admin
- **URL**: `http://localhost:3000/admin/createAdmin`
- **ข้อมูลทดสอบ**:
  - Admin ID: 6487099
  - Job: Admin
  - Firstname: Kureyon
  - Lastname: Shinchan
  - Email: Kureyon@student.mahidol.ac.th
  - Username: Shinchan
  - Password: 99009

### Audit Trail
- **URL**: `http://localhost:3000/admin/audittrail`
- แสดงประวัติการเข้าสู่ระบบของ Admin

### Manage Content
- **URL**: `http://localhost:3000/admin/manageContent`
- จัดการข้อมูลร้านอาหาร
- ค้นหา, แก้ไข, ลบร้านอาหาร

### Add New Content
- **URL**: `http://localhost:3000/admin/createContent`
- เพิ่มร้านอาหารใหม่
- **ตัวอย่างข้อมูล**:
  - Restaurant ID: B_010
  - Restaurant Name: Hill Mare
  - Category: Food
  - Day: เปิดทุกวัน
  - Open: 16:00
  - Close: 24:00
  - Address: ขาสามมุข บางแสน ชลบุรี (ติดกับร้าน Red Temp)
  - Phone Number: 098-821-9918
  - Point: 4

## 🗄️ โครงสร้าง Database

### ตาราง Admin
- Admin_ID
- Firstname
- Surname
- Email
- Username
- Job_Titles
- Password

### ตาราง AuditTrail
- Admin_ID
- Firstname
- Login_Time

### ตาราง ManageContent
- Restaurant_ID
- Restaurant_Name
- Day
- Open
- Close
- Address
- Phone_No
- Point
- Category
- Content
- Pic1-Pic7

## 📁 โครงสร้างไฟล์

```
project/
├── server.js
├── package.json
├── .env
├── .hintrc
├── AboutUS.html
├── AuditTrail.html
├── createAdmin.html
├── createContent.html
├── EditAdmin.html
├── EditContent.html
├── Homepage.html
├── Login.html
├── LoginAdmin.html
├── manageAdmin.html
├── manageContent.html
├── RecipeMenu.html
├── Register.html
├── Review.html
├── Search.html
└── public/
    ├── AboutUs_CSS.css
    ├── admincss copy.css
    ├── admincss.css
    ├── admincssedit.css
    ├── contentcss.css
    ├── createContentcss.css
    ├── EditContentcss.css
    └── Home&Search.css
```

## 💡 เทคโนโลยีที่ใช้

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript
- **อื่นๆ**: 
  - nodemon สำหรับ development
  - dotenv สำหรับจัดการ environment variables
  - mysql2 สำหรับเชื่อมต่อ MySQL

## ⚠️ หมายเหตุ

- ใช้หน้าจอใหญ่เพื่อความชัดเจนของภาพและเนื้อหา
- ระบบจะบันทึกการเข้าสู่ระบบของ Admin ลงใน AuditTrail อัตโนมัติ
- ข้อมูลการรีวิวจะถูกดึงมาจาก Database
- Food Menu ใช้ API ภายนอกสำหรับข้อมูลส่วนผสม

## 🔧 การแก้ไขปัญหา

- หากไม่สามารถเชื่อมต่อ Database ได้ ให้ตรวจสอบการตั้งค่า User และ Password
- หาก npm start ไม่ทำงาน ให้ตรวจสอบการติดตั้ง dependencies
- หากหน้าเว็บไม่แสดงผล ให้ตรวจสอบว่าเซิร์ฟเวอร์ทำงานที่ port 3000

---

พัฒนาโดย: sec1_gr15 (ID: 023, 058, 069, 077)

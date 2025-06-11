const port = process.env.SERVER_PORT || 3000;

var path = require('path'); // เรียกใช้ path
var express = require("express"); // เรียกใช้ express
var mysql = require("mysql2"); // เรียกใช้ mysql
var router = express.Router(); // เรียกใช้ router

let app = express();


app.use(router);

// เชื่อม CSS 
app.use('/', express.static(__dirname + '/public'))
app.use('/admin', express.static(__dirname + '/public'))


router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'static')));

// อนุญาตให้สามารถ Fetch ขึ้นหน้า HTML ได้
router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// เชื่อม Datebase กับ ไฟล์ .env
const dotenv = require('dotenv');
dotenv.config();

// เชื่อม Database: Nokwong Database
let dbConn = mysql.createConnection({
    host: process.env.host,
    user: process.env.DB_user,
    password: process.env.DB_pass,
    database: process.env.DB_name,
});

// เช็คว่าเชื่อม Database รึยัง
dbConn.connect(function (err) {
    if (err) throw err;
    console.log('Database ' + process.env.DB_name + ' Connected!')
})


// ------------ สำหรับ User ------------ //

// หน้า Homepage
router.get("/", function (req, res) {
    console.log('Visit Homapage')
    res.sendFile(path.join(__dirname + '/Homepage.html'));
});

router.get("/homepage", function (req, res) {
    console.log('Visit Homapage')
    res.sendFile(path.join(__dirname + '/Homepage.html'));
});

// ส่วนของ Fetch สำหรับหน้า Homepage //
router.get('/RestaurantHomepage', function (req, res) {
    dbConn.query("SELECT * FROM ManageContent WHERE Category = 'Drink' LIMIT 6;", function (error, result) {
        if (error) throw error;
        res.json(result);
    })
});

router.get('/RestaurantHomepage2', function (req, res) {
    dbConn.query("SELECT * FROM ManageContent WHERE Category = 'Food' LIMIT 6;", function (error, result) {
        if (error) throw error;
        res.json(result);
    })
});

router.get('/RestaurantHomepage3', function (req, res) {
    dbConn.query("SELECT * FROM ManageContent WHERE Category = 'Dessert' LIMIT 6;", function (error, result) {
        if (error) throw error;
        res.json(result);
    })
});

// หน้า Search 
router.get("/search", function (req, res) {
    console.log('Visit Search')
    res.sendFile(path.join(__dirname + '/Search.html'));
});

router.get('/RestaurantName', function (req, res) {
    dbConn.query("SELECT * FROM ManageContent", function (error, result) {
        if (error) throw error;
        res.json(result);
    })
});

// เพื่อเอาไป Fetch สำหรับ หน้า Review //
router.get('/Find_Restaurant_Name/:Restaurant_Name', function (req, res) {
    let name = req.params.Restaurant_Name;
    if (!name) {
        return res.status(400).send({ error: true, message: "Please Give Me Restaurant Name Again" })
    }
    dbConn.query(("SELECT * FROM ManageContent WHERE Restaurant_Name  LIKE '%" + name + "%' || Category  LIKE '%" + name + "%' || Point LIKE '" + name + "%'"), function (error, results) {
        if (error) throw error;
        console.log(results)
        return res.json(results)
    });

});


// หน้า Review
router.get("/Review", (req, res) => {
    console.log("Review: ", req.query.name);
    res.sendFile(path.join(__dirname + "/Review.html"))
});


// หน้า Login
router.get("/login", function (req, res) {
    console.log('Visit Login for User')
    res.sendFile(path.join(__dirname + '/Login.html'));
});

// หน้า Register
router.get("/register", function (req, res) {
    console.log('Visit Register')
    res.sendFile(path.join(__dirname + '/Register.html'));
});

router.get("/LoginUser", function (req, res) {
    // res.sendFile(path.join(__dirname + '/login'));
    res.send(`<script>alert("Your Registration Successful Please login  "); window.location.href = "/login"; </script>`);
});

// หน้า AboutUs
router.get("/AboutUs", function (req, res) {
    console.log('Visit AboutUs')
    res.sendFile(path.join(__dirname + '/AboutUS.html'));
});

// หน้า Reciep Menu (API)
router.get("/recipemenu", function (req, res) {
    console.log('Visit Reciep Menu')
    res.sendFile(path.join(__dirname + '/RecipeMenu.html'));
});




// ------------ ส่วนของ Content ------------ //

// หน้า ManageContent
router.get("/admin/managecontent", function (req, res) {
    console.log('Visit Manage Content')
    res.sendFile(path.join(__dirname + '/manageContent.html'));
});

// หน้า CreateContent
router.get("/admin/createContent", function (req, res) {
    console.log('Visit Manage Content')
    res.sendFile(path.join(__dirname + '/createContent.html'));
});

// หน้า EditContent
router.get('/admin/updatReview', (req, res) => {
    console.log("Restaurant_id:", req.query.id)
    res.sendFile(path.join(__dirname + "/EditContent.html"))
});

// Function ต่าง ๆ สำหรับ Admin // 

// เรียกดูข้อมูล Review Content จาก ID
router.get('/revieww/:id', function (req, res) {
    let getid = req.params.id;
    dbConn.query('SELECT * FROM ManageContent WHERE Restaurant_ID=?', getid, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

// Delete ข้อมูล Review ร้านอาหาร
router.get('/dellreview/:rid', function (req, res) {
    let gitid = req.params.rid;
    //console.log(rid)
    dbConn.query('DELETE FROM ManageContent WHERE Restaurant_ID=?', [gitid], function (error, results) {
        if (error) throw error;
    });
});

// Update ข้อมูล ของ Review Content
router.post('/updateReview', function (req, res) {
    if (!req.body) {
        return res.status(400).send({ error: true, message: 'Please provide studentinformation to updatae database Please!!!' });
    }
    dbConn.query("UPDATE ManageContent SET Restaurant_ID=?, Restaurant_Name=?,Day=?, Open=?, Close=?, Address=?, Phone_No=?, Point=?, Category=?, Content=?, Pic1=?, Pic2=?, Pic3=?, Pic4=?, Pic5=?, Pic6=?, Pic7=? WHERE Restaurant_ID=?", [req.body.Restaurant_ID, req.body.Restaurant_Name, req.body.Day, req.body.Open, req.body.Close, req.body.Address, req.body.Phone_No, req.body.Point, req.body.Category, req.body.Content, req.body.Pic1, req.body.Pic2, req.body.Pic3, req.body.Pic4, req.body.Pic5, req.body.Pic6, req.body.Pic7, req.body.Restaurant_ID], function (err, result) {
        if (err) throw err;
        res.send(`<script>alert("${req.body.Restaurant_Name}'s information has been updated. "); window.location.href = "/admin/managecontent"; </script>`);
    });
})

/// สำหรับเพิ่มข้อมูล Review Content (Insert)
router.post("/AddContent", (req, res) => {
    dbConn.query("INSERT INTO NokWongDB.ManageContent SET ? ", req.body, function (error, results) {
        if (error) throw error;
        return res.send(`<script>alert(" Content ${req.body.Restaurant_Name} is Added "); window.location.href = "/admin/manageContent"; </script>`);
    });

    console.log(req.body)
});


// เพื่อเอาไป Fetch สำหรับหน้า ManageContent //
router.get('/reviews', function (req, res) {
    dbConn.query('SELECT * FROM managecontent', function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

// เพื่อเอาไป Fetch สำหรับ หน้า ManageContent //
router.get('/Find_Restaurant_allinfo/:Restaurant_Name', function (req, res) {
    let name = req.params.Restaurant_Name;
    if (!name) {
        return res.status(400).send({ error: true, message: "Please Give Me Restaurant Name Again" })
    }
    dbConn.query(("SELECT * FROM ManageContent WHERE Restaurant_Name  LIKE '%" + name + "%' || Category  LIKE '%" + name + "%' || Point LIKE '" + name + "%' || Restaurant_ID LIKE '" + name + "%'"), function (error, results) {
        if (error) throw error;
        console.log(results)
        return res.json(results)
    });

});

// ------------ ส่วนของ Admin ------------ //

// หน้า ManageAdmin
router.get("/admin/manageadmin", function (req, res) {
    console.log('Visit Manage Admin')
    res.sendFile(path.join(__dirname + '/manageAdmin.html'));
});

// หน้า UpdateAdmin
router.get("/admin/createAdmin", function (req, res) {
    console.log('Visit Manage Content')
    res.sendFile(path.join(__dirname + '/createAdmin.html'));
});

// หน้า EditAdmin
router.get("/admin/updateadmin", function (req, res) {
    console.log('Visit Manage Content')
    res.sendFile(path.join(__dirname + '/EditAdmin.html'));
});

// หน้า Login Admin
router.get("/admin/LoginAdmin", function (req, res) {
    console.log('Visit Login for Admin')
    res.sendFile(path.join(__dirname + '/LoginAdmin.html'));
});

// หน้า AuditTrail
router.get("/admin/audittrail", function (req, res) {
    console.log('Visit Login for Admin')
    res.sendFile(path.join(__dirname + '/AuditTrail.html'));
});


// Function ต่าง ๆ สำหรับ Admin //

// Insert ข้อมูล Admin //
router.post("/admin/AddAdmin", function (req, res) {

    dbConn.query("INSERT INTO Admin SET ? ", req.body, function (error, results) {
        if (error) throw error;
        return res.send(`<script>alert("Admin ${req.body.Firstname} has been Added "); window.location.href = "/admin/manageAdmin";</script>`);
    });
    console.log(req.body)
});

// Update ข้อมูล Admin //
router.post('/updateinfo', function (req, res) {
    let id = req.body.id;
    let job = req.body.job
    let fname = req.body.firstname
    let lname = req.body.lastname
    let mail = req.body.mail
    let user = req.body.username
    let pass = req.body.pass
    console.log(req.body)
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide studentinformation to updatae database Please!!!' });
    }
    dbConn.query("UPDATE Admin SET Admin_ID=?, Job_Titles=?,Firstname=?, Surname=?, Email=?, Username=?, Password=? WHERE Admin_ID=?", [id, job, fname, lname, mail, user, pass, id], function (err, result) {
        if (err) throw err;
        res.send(`<script>alert(" ${fname}'s information has been updated. "); window.location.href = "/admin/manageAdmin"; </script>`);
    });
})


// สำหรับการเข้าสู่ระบบของ Admin ซึ่งกำหนดให้ Username และ Password ถูกต้อง
router.post("/form-submit", function (req, res) {
    console.log("Request at /form-submit")
    const useremail = req.body.useremail;
    const pw = req.body.password;

    let sql = "SELECT * FROM Admin WHERE Email=" + "'" + useremail + "'";

    dbConn.query(sql, function (error, results) {
        console.log(req.body)

        if (results.length != 0) {
            if (results[0].Password == pw) {
                console.log(`${results.Firstname} welcome`)

                // ใส่ค่า DateTime เพื่อเก็บข้อมูล วัน - เวลา การเข้าสู่ระบบของแต่ละ User
                dbConn.query("INSERT INTO AuditTrail SET Admin_ID=? , Firstname =?, Login_Time =?", [results[0].Admin_ID, results[0].Firstname, Date_Time()])
                res.send(`<script>alert("Hi Admin ${results[0].Firstname}  "); window.location.href = "/admin/manageadmin";</script>`);
                console.log(results)
            }

            else {
                res.send(`<script>alert("${results[0].Firstname} Please enter the correct password. "); window.location.href = "/admin/LoginAdmin"; </script>`);

            }

        } else {
            res.send(`<script>alert(" Please enter the correct email and password. "); window.location.href = "/admin/LoginAdmin"; </script>`);
        }
    });
});

// สำหรับแปลงค่า Date เพื่อให้ตรงกับ Syntax DateTime ของ MySql2 สำหรับการ Login
function Date_Time() {
    var date = new Date();
    el_down = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
    return el_down
    // References: https://www.geeksforgeeks.org/how-to-convert-javascript-datetime-to-mysql-datetime/ 
}

// เพื่อเอาไป Fetch สำหรับ ลบ(DELETE) Admin
router.get('/admin/delladmin/:id', function (req, res) {
    let getid = req.params.id;
    dbConn.query('DELETE FROM admin WHERE Admin_ID=?', getid, function (error, results) {
        if (error) throw error;
    });
});

// เพื่อเอาไป Fetch สำหรับเรียกดู Admin ทั้งหมด
router.get("/adminall", function (req, res) {
    dbConn.query("SELECT * FROM admin", function (error, result) {
        if (error) throw error;
        res.json(result);
    })
})

//เพื่อเอาไป Fetch สำหรับ แก้ไข Admin
router.get('/adminn/:id', function (req, res) {
    let getid = req.params.id;
    dbConn.query('SELECT * FROM admin WHERE Admin_ID=?', getid, function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

//เพื่อเอาไป Fetch สำหรับค้นหา Admin 
router.get('/getadmin/:id', function (req, res) {
    let getid = req.params.id;
    if (!getid) {
        return res.status(400).send({ error: true, message: "Plase Give Information" })
    }
    dbConn.query(("SELECT * FROM Admin WHERE Admin_ID  LIKE '%" + getid + "%' || Firstname  LIKE '%" + getid + "%' || JOB_Titles  LIKE '%" + getid + "%'"), function (error, results) {
        if (error) throw error;
        console.log(results)
        return res.json(results)
    });
});

// เพื่อเอาไป Fetch สำหรับเรียกดู Audit Trail ทั้งหมด
router.get('/allaudittrail', function (req, res) {
    dbConn.query(("SELECT * FROM AuditTrail"), function (error, results) {
        if (error) throw error;
        console.log(results)
        return res.json(results)
    });
});



// ------------ ส่วนของ POST MAN ------------ //

// ------ POSTMAN ADMIN ------ //

// Testing Select All Admins (Search)
// method: get
// URL: localhost:3000/admin
router.get('/AllAdmins', function (req, res) {
    dbConn.query('SELECT * FROM admin', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Admin List.' });

    });
});

// Testing Select Admin by ID (Search)
// method: get
// URL: localhost:3000/admin/:id
// ----- Example 1 -----
// localhost:3000/admin/1
// ----- Example 2 -----
// localhost:3000/admin/2
router.get('/adminon/:id', function (req, res) {
    let Admin_ID = req.params.id;
    if (!Admin_ID) {
        return res.status(400).send({ error: true, message: 'Please provide admin id.' });
    }
    dbConn.query('SELECT * FROM admin where Admin_ID=?', Admin_ID, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Admin retrieved' });
    });
});

// Testing Create Admin (Insert)
// method: post
// URL: localhost:3000/createadmin
// body: raw JSON
// ----- Example: 1 -----
// {
//  "admin" :
//      {
//          "Admin_ID": 5,
//          "Firstname": "Tunyarat",
//          "Surname": "Tong",
//          "Email": "tunyarat.nit@student.mahidol.edu",
//          "Username": "JaoDango",
//          "Password": 6487002
//      }
// }
// ----- Example: 2 -----
// {
//  "admin" :
//      {
//          "Admin_ID": 6,
//          "Firstname": "Pimnara",
//          "Surname": "Pim",
//          "Email": "pimnaara.pun@student.mahidol.edu",
//          "Username": "PimmyPim",
//          "Password": 6487085
//      }
// }
router.post('/admin/createadmin', function (req, res) {
    let admin = req.body.admin;
    console.log(admin);

    if (!admin) {
        return res.status(400).send({
            error: true, message: 'Please provide admin information'
        });
    }
    dbConn.query("INSERT INTO admin SET ? ", admin, function (error, results) {
        if (error) throw error;
        return res.send({
            error: false, data: results.affectedRows, message: 'New Admin has been created successfully.'
        });
    });
});


// Testing Update Admin (Update)
// method: put
// URL: localhost:3000/updateadmin
// body: raw JSON
// ----- Example: 1 -----
// {
//     "admin": 
//         {
//             "Admin_ID": 5,
//             "Firstname": "Tunyarat",
//             "Surname": "Jaodango",
//             "Email": "tunyarat.nit@student.mahidol.edu",
//             "Username": "Tong",
//             "Password": 6487002
//         }
// }
// ----- Example: 2 -----
// {
//  "admin" :
//      {
//          "Admin_ID": 6,
//          "Firstname": "Pimnara",
//          "Surname": "PimmyPim",
//          "Email": "pimnaara.pun@student.mahidol.edu",
//          "Username": "Pim",
//          "Password": 6487085
//      }
// }
router.put('/admin/updateadmin', function (req, res) {
    let admin = req.body.admin;
    let Admin_ID = req.body.admin.Admin_ID;

    console.log('Admin ID: ' + Admin_ID)
    console.log(Admin_ID + 'has been updated successfully')

    if (!Admin_ID) {
        return res.status(400).send({ error: admin, message: 'Please provide Admin information' });
    }
    dbConn.query("UPDATE admin SET ? WHERE Admin_ID = ?", [admin, Admin_ID], function (error,
        results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin ' + Admin_ID + ' has been updated successfully.' })
    });
});

// Testing Delete Admin by ID (Delete)
// method: delete
// URL: localhost:3000/deladmin/:id
// ----- Example 1 -----
// localhost:3000/deladmin/1
// ----- Example 2 -----
// localhost:3000/deladmin/2
router.delete('/admin/deladmin/:id', function (req, res) {
    let Admin_ID = req.params.id;
    if (!Admin_ID) {
        return res.status(400).send({ error: true, message: 'Please provide Admin_ID' });
    }
    dbConn.query('DELETE FROM admin WHERE Admin_ID=?', Admin_ID, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin ' + Admin_ID + ' has been deleted successfully.' });
    });
});


// ------ POSTMAN CONTENT ------ //

// Testing Select All Restaurant Contents
// method: get
// URL: localhost:3000/RestaurantName
router.get('/RestaurantName', function (req, res) {
    dbConn.query("SELECT * FROM ManageContent", function (error, result) {
        if (error) throw error;
        res.json(result);
    })
});

// Testing Create Review (Insert)
// method: post
// URL: localhost:3000/addreview
// body: raw JSON
// ----- Example: 1 -----
// {
//     "ManageContent": 
//             {
//         "Restaurant_ID": "D_001",
//         "Restaurant_Name": "เนื้อหนัง ",
//         "Day": "เปิดทุกวัน",
//         "Open": "10.30",
//         "Close": "22.00",
//         "Address": "135/960 ศาลายา นครปฐม ตรงข้ามมหาวิทยาลัยมหิดล",
//         "Phone_No": "062 653 9144",
//         "Point": 4,
//         "Category": "Food",
//         "Content": "ร้าน เนื้อหนัง ข้าวขาหมู เป็นร้าน ข้าวขาหมู ที่ไม่ได้มีดีแค่ขาหมู แต่มีเมนูให้เลือกเยอะมากกก และจะมีเพิ่มอีกเรื่อย ๆ ที่สำคัญคืออร่อยทุกเมนู!! เมนูเเนะนำ  ข้าวขาหมูสูตรแต้จิ๋ว คากิหนังหนึบ ขาหมูหมั่นโถว ข้าวหมูสามชั้นทอดน้ำปลา ข้าวคอหมูย่าง น้ำจิ้มแจ่วรสเด็ด ข้าวกะเพราขาหมู ต้มแซ่บ ต้มมะระ ต้มจืดสาหร่าย ขนมจีบ ซาลาเปา และเมนูอื่นๆ",
//         "Pic1": "https://i.ibb.co/mc4z8Lk/image.jpg",
//         "Pic2": "https://i.ibb.co/XjQDcMY/2.jpg",
//         "Pic3": "https://i.ibb.co/Yf1B2d7/3.jpg",
//         "Pic4": "https://i.ibb.co/XXr9F2z/4.jpg",
//         "Pic5": "https://i.ibb.co/rtKLxDP/5.jpg",
//         "Pic6": "https://i.ibb.co/9rtLC1R/6.jpg",
//         "Pic7": "https://i.ibb.co/bKknnDZ/1.jpg"
//     }
// }
// ----- Example: 2 -----
// {
//     "ManageContent": 
//             {
//         "Restaurant_ID": "D_002",
//         "Restaurant_Name": "อบทะเล ศาลายา",
//         "Day": "เปิดทุกวัน",
//         "Open": "11.00",
//         "Close": "21.00",
//         "Address": "135/307-309 หมูุ่6 ศาลายา นครปฐม ตรงข้ามมหาวิทยาลัยมหิดล",
//         "Phone_No": "095 735 6292",
//         "Point": 5,
//         "Category": "Food",
//         "Content": "อบทะเล ศาลายาตั้งอยู่ตรงข้ามมหาวิทยาลัยมหิดล ศาลายา ภายในร้านเป็นห้องแอร์นั่งสบาย พร้อมกับมีของอร่อยให้เลือกชิมหลากหลาย โดยจะเน้นที่ของทะเลสดๆ สั่งมาจากแพประมงที่จันทบุรีและประจวบคีรีขันธ์ เมนูของที่ร้านเป็นสูตรเฉพาะที่คิดขึ้นเอง เป็นพวกกับข้าว ทุกเมนูทางร้านได้ทำการคัดสรรวัตถุดิบมาอย่างดี เน้นเมนูอบ มาแล้วต้องสั่งขนมจีบมันกุ้งเสวย นำมันกุ้งสูตรของอาก๋ง มาประยุกต์ให้กับขนมจีบเกิดเป็นเมนูนี้ขึ้นมา หมูกรอบคั่วพริกเกลือ ซึ่งเป็นหมูกรอบสูตรเฉพาะของทางร้าน ผ่านขั้นตอนการทำหลายขั้นตอน ได้ออกมาเป็นหมูกรอบที่กรอบสมชื่อ มาม่าต้มยำยกหม้อรวมมิตร จะปรุงน้ำต้มยำเองหม้อต่อหม้อ รสชาติจัดจ้านเข้มข้นถึงเครื่อง เเละต้องปิดท้ายด้วยยำปลาเเซลมอนที่รสชาติจัดจ้านถึงพริกถึงเครื่อง",
//         "Pic1": "https://i.ibb.co/86dSGgz/image.jpg",
//         "Pic2": "https://i.ibb.co/yQY54pq/P1.jpg",
//         "Pic3": "https://i.ibb.co/mtxmH09/P2.jpg",
//         "Pic4": "https://i.ibb.co/VJVtSmC/P3.jpg",
//         "Pic5": "https://i.ibb.co/x1Q0bng/P4.jpg",
//         "Pic6": "https://i.ibb.co/SPDPcg8/w644.jpg",
//         "Pic7": "https://i.ibb.co/7VBPNP1/editor20190828012848-original.jpg"
//     }
// }
router.post('/addreview', function (req, res) {
    let Content = req.body.ManageContent;
    if (!Content) {
        return res.status(400).send({
            error: true, message: 'Please provide Content information'
        });
    }
    dbConn.query("INSERT INTO ManageContent SET ? ", Content, function (error, results) {
        if (error) throw error;
        return res.send({
            error: false, data: results.affectedRows, message: 'New Content has been created successfully.'
        });
    });
});


// Testing Update Content (Update)
// method: put
// URL: localhost:3000/updatecontent
// body: raw JSON
// ----- Example: 1 -----
// {
//     "ManageContent": 
//             {
//         "Restaurant_ID": "D_002",
//         "Restaurant_Name": "เนื้อหนัง ข้าวขาหมู",
//         "Day": "เปิดวันจันทร์ - วันศุกร์",
//         "Open": "10.30",
//         "Close": "22.00",
//         "Address": "135/960 ศาลายา นครปฐม ตรงข้ามมหาวิทยาลัยมหิดล",
//         "Phone_No": "062 653 9144",
//         "Point": 4,
//         "Category": "Food",
//         "Content": "ร้าน เนื้อหนัง ข้าวขาหมู เป็นร้าน ข้าวขาหมู ที่ไม่ได้มีดีแค่ขาหมู แต่มีเมนูให้เลือกเยอะมากกก และจะมีเพิ่มอีกเรื่อย ๆ ที่สำคัญคืออร่อยทุกเมนู!! เมนูเเนะนำ  ข้าวขาหมูสูตรแต้จิ๋ว คากิหนังหนึบ ขาหมูหมั่นโถว ข้าวหมูสามชั้นทอดน้ำปลา ข้าวคอหมูย่าง น้ำจิ้มแจ่วรสเด็ด ข้าวกะเพราขาหมู ต้มแซ่บ ต้มมะระ ต้มจืดสาหร่าย ขนมจีบ ซาลาเปา และเมนูอื่นๆ",
//         "Pic1": "https://i.ibb.co/mc4z8Lk/image.jpg",
//         "Pic2": "https://i.ibb.co/XjQDcMY/2.jpg",
//         "Pic3": "https://i.ibb.co/Yf1B2d7/3.jpg",
//         "Pic4": "https://i.ibb.co/XXr9F2z/4.jpg",
//         "Pic5": "https://i.ibb.co/rtKLxDP/5.jpg",
//         "Pic6": "https://i.ibb.co/9rtLC1R/6.jpg",
//         "Pic7": "https://i.ibb.co/bKknnDZ/1.jpg"
//     }
// }
// ----- Example: 2 -----
// {
//     "ManageContent": 
//             {
//         "Restaurant_ID": "D_001",
//         "Restaurant_Name": "อบทะเล ศาลายา (Aob Talay Salaya)",
//         "Day": "เปิดวันจันทร์ - วันเสาร์ หยุดทุกวันอาทิตย์",
//         "Open": "11.00",
//         "Close": "21.00",
//         "Address": "135/307-309 หมูุ่6 ศาลายา นครปฐม ตรงข้ามมหาวิทยาลัยมหิดล",
//         "Phone_No": "095 735 6292",
//         "Point": 5,
//         "Category": "Food",
//         "Content": "อบทะเล ศาลายาตั้งอยู่ตรงข้ามมหาวิทยาลัยมหิดล ศาลายา ภายในร้านเป็นห้องแอร์นั่งสบาย พร้อมกับมีของอร่อยให้เลือกชิมหลากหลาย โดยจะเน้นที่ของทะเลสดๆ สั่งมาจากแพประมงที่จันทบุรีและประจวบคีรีขันธ์ เมนูของที่ร้านเป็นสูตรเฉพาะที่คิดขึ้นเอง เป็นพวกกับข้าว ทุกเมนูทางร้านได้ทำการคัดสรรวัตถุดิบมาอย่างดี เน้นเมนูอบ มาแล้วต้องสั่งขนมจีบมันกุ้งเสวย นำมันกุ้งสูตรของอาก๋ง มาประยุกต์ให้กับขนมจีบเกิดเป็นเมนูนี้ขึ้นมา หมูกรอบคั่วพริกเกลือ ซึ่งเป็นหมูกรอบสูตรเฉพาะของทางร้าน ผ่านขั้นตอนการทำหลายขั้นตอน ได้ออกมาเป็นหมูกรอบที่กรอบสมชื่อ มาม่าต้มยำยกหม้อรวมมิตร จะปรุงน้ำต้มยำเองหม้อต่อหม้อ รสชาติจัดจ้านเข้มข้นถึงเครื่อง เเละต้องปิดท้ายด้วยยำปลาเเซลมอนที่รสชาติจัดจ้านถึงพริกถึงเครื่อง",
//         "Pic1": "https://i.ibb.co/86dSGgz/image.jpg",
//         "Pic2": "https://i.ibb.co/yQY54pq/P1.jpg",
//         "Pic3": "https://i.ibb.co/mtxmH09/P2.jpg",
//         "Pic4": "https://i.ibb.co/VJVtSmC/P3.jpg",
//         "Pic5": "https://i.ibb.co/x1Q0bng/P4.jpg",
//         "Pic6": "https://i.ibb.co/SPDPcg8/w644.jpg",
//         "Pic7": "https://i.ibb.co/7VBPNP1/editor20190828012848-original.jpg"
//     }
// }
router.put('/updatecontent', function (req, res) {
    let content = req.body.ManageContent;
    let Restaurant_ID = req.body.ManageContent.Restaurant_ID;

    console.log('Restaurant ID: ' + Restaurant_ID)
    console.log(Restaurant_ID + 'has been updated successfully')

    if (!Restaurant_ID) {
        return res.status(400).send({ error: content, message: 'Please provide Content information' });
    }
    dbConn.query("UPDATE ManageContent SET ? WHERE Restaurant_ID = ?", [content, Restaurant_ID], function (error,
        results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Content ' + Restaurant_ID + ' has been updated successfully.' })
    });
});


// Testing Delete Content by ID (Delete)
// method: delete
// URL: localhost:3000/delcontent/:id
// ----- Example 1 -----
// localhost:3000/deladmin/D_001
// ----- Example 2 -----
// localhost:3000/deladmin/D_002
router.delete('/delcontent/:id', function (req, res) {
    let Restaurant_ID = req.params.id;
    if (!Restaurant_ID) {
        return res.status(400).send({ error: true, message: 'Please provide Restaurant_ID' });
    }
    dbConn.query('DELETE FROM ManageContent WHERE Restaurant_ID=?', Restaurant_ID, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Content ' + Restaurant_ID + ' has been deleted successfully.' });
    });
});

// ------------ จบ POST MAN ------------ //


app.listen(port, () => {
    console.log('Server running at: ' + port)
})




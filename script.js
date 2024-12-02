const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
let loginEmail;
// 切換到註冊表單
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
    // 清空訊息
    const message = document.getElementById('registerMessage');
    message.textContent = '';
});

// 切換到登入表單
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
  
// 註冊功能
function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;
    const message = document.getElementById('registerMessage');

    // 檢查 email 是否已存在於本地儲存中
    // 檢查輸入
    if (username === '' || password === '' || email === '') {
        message.textContent = '請填寫所有欄位';
        return;
      }
    else if (localStorage.getItem(email)===email) {
        message.textContent = '使用者信箱已存在';
    } else {
        // 儲存使用者資料為 JSON 字串
        const userData = { email, username,  password };
        localStorage.setItem(email, JSON.stringify(userData));
        message.textContent = '註冊成功，請登入';
        // 切換到登入表單 
        container.classList.remove("active");
    }
}

  // 登入功能
function login() {
    loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');
  
    // 檢查輸入
    if (loginEmail === '' || loginPassword === '') {
      message.textContent = '請填寫所有欄位';
      return;
    }
    // 從 localStorage 取得該信箱的使用者資料
    const storedUserData = localStorage.getItem(loginEmail);

    // 確認資料存在
    if (storedUserData) {
        // 將取得的 JSON 字串解析為物件
        const { username, password: storedPassword } = JSON.parse(storedUserData);
        // 驗證密碼
        if (storedPassword && storedPassword === loginPassword) {
            message.textContent = `歡迎，${username}！登入成功`;
            sessionStorage.setItem('username', username);
            // someFunctionInScript1(loginEmail);
            window.location.assign("index1.html");
            
            
        } else {
            message.textContent = '密碼錯誤';
        }
    } else {
        message.textContent = '使用者信箱不存在';
    }
}
    
const { MongoClient } = require('mongodb');
 // MongoDB 連接字串
const uri = 'mongodb+srv://zeater:wass13033@userdata.q2i1l.mongodb.net/?retryWrites=true&w=majority&appName=userdata'; // 本機連線
const client = new MongoClient(uri);

async function main() {
     try {
         // 連接到 MongoDB
         await client.connect();
         console.log('成功連接到 MongoDB');

         // 選擇資料庫與集合
         const db = client.db('userdata'); // 替換為你的資料庫名稱
         const collection = db.collection('USERDATA'); // 替換為你的集合名稱

         // 插入文件
         const result = await collection.insertOne({ name: 'John', email: 'aaa@gmail.com', password: '11111111' });
         console.log('插入成功：', result.insertedId);

         // 查詢文件
         const documents = await collection.find({}).toArray();
         console.log('查詢結果：', documents);
     } catch (error) {
         console.error('連接失敗：', error);
     } finally {
         // 關閉連接
         await client.close();
     }
 }

 main();
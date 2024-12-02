// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 提供當前目錄作為靜態文件
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const rooms = new Map(); // 儲存房間信息

io.on('connection', (socket) => {
    console.log('使用者連接');

    // 加入房間
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        
        // 如果房間不存在，創建新房間
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                host: socket.id,
                users: new Set([socket.id]),
                isCountingDown: false
            });
        } else {
            rooms.get(roomId).users.add(socket.id);
        }

        // 通知房間內所有人有新使用者加入
        io.to(roomId).emit('userJoined', {
            totalUsers: rooms.get(roomId).users.size,
            isHost: rooms.get(roomId).host === socket.id
        });
    });

    // 開始倒數
    socket.on('startCountdown', (roomId) => {
        const room = rooms.get(roomId);
        
        // 確認是房主且還沒開始倒數
        if (room && room.host === socket.id && !room.isCountingDown) {
            room.isCountingDown = true;
            let countdown = 10;

            // 開始倒數
            const timer = setInterval(() => {
                io.to(roomId).emit('countdown', countdown);
                countdown--;

                if (countdown < 0) {
                    clearInterval(timer);
                    room.isCountingDown = false;
                    io.to(roomId).emit('countdownComplete');
                }
            }, 1000);
        }
    });

    // 離開房間
    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                
                // 如果是房主離開，指定新房主
                if (room.host === socket.id && room.users.size > 0) {
                    room.host = Array.from(room.users)[0];
                }

                // 如果房間沒人了，刪除房間
                if (room.users.size === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('userLeft', {
                        totalUsers: room.users.size,
                        newHost: room.host
                    });
                }
            }
        });
    });
});

http.listen(3000, () => {
    console.log('伺服器運行在 port 3000');
});



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

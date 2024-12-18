// Import các thư viện và module cần thiết
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// Import các route
const articleRoutes = require('./routes/articles');
const subscriberRoutes = require('./routes/subscribers');
const writerRoutes = require('./routes/writers');
const editorRoutes = require('./routes/editors');
const adminRoutes = require('./routes/admin');

// Tạo ứng dụng Express
const app = express();
const port = 3000;

// Kết nối MongoDB qua Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/newspaper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Định nghĩa các route
app.use('/articles', articleRoutes);
app.use('/subscribers', subscriberRoutes);
app.use('/writers', writerRoutes);
app.use('/editors', editorRoutes);
app.use('/admin', adminRoutes);

// Khởi chạy máy chủ
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Truy vấn MongoDB trực tiếp (Ví dụ sử dụng MongoClient)
(async () => {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB via MongoClient');

        const db = client.db('newspaper'); // Thay đổi thành tên cơ sở dữ liệu của bạn
        const collection = db.collection('articles'); // Thay đổi thành tên collection của bạn

        const data = await collection.find({}).toArray();
        console.log('Fetched data:', data); // In dữ liệu đã lấy được
    } catch (err) {
        console.error('Error during MongoDB operations:', err);
    } finally {
        await client.close(); // Đóng kết nối sau khi hoàn thành
    }
})();
// Đảm bảo rằng bạn đang trả về một file HTML cho người dùng truy cập vào trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const cors = require('cors');
app.use(cors());

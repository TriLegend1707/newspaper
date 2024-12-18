const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article'); // Điều chỉnh đường dẫn đến mô hình bài viết của bạn
const { MongoClient } = require('mongodb');

// Kết nối Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/newspaper')
    .then(() => console.log('Successfully connected to MongoDB via Mongoose'))
    .catch(err => console.error('Could not connect to MongoDB via Mongoose...', err));

app.use(express.json());

// Hàm kiểm tra cấu trúc bài viết
const validateArticleStructure = (article) => {
    return (
        typeof article.title === 'string' &&
        typeof article.content === 'string' &&
        typeof article.author === 'string' &&
        typeof article.views === 'number' &&
        Array.isArray(article.tags) &&
        article.tags.every(tag => typeof tag === 'string') &&
        article.publishedDate instanceof Date
    );
};

// Route API lấy danh sách bài viết
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().limit(10).sort({ views: -1 }); // Lấy 10 bài viết nhiều lượt xem nhất
        const validatedArticles = articles.filter(validateArticleStructure); // Chỉ giữ lại bài viết hợp lệ
        res.send(validatedArticles);
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Error fetching articles');
    }
});

// Chạy máy chủ Express
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

// Ví dụ truy vấn trực tiếp MongoDB với MongoClient
(async () => {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB via MongoClient');

        const db = client.db('yourDatabaseName'); // Thay 'yourDatabaseName' bằng tên cơ sở dữ liệu của bạn
        const collection = db.collection('yourCollectionName'); // Thay 'yourCollectionName' bằng tên collection của bạn

        const data = await collection.find({}).toArray();
        console.log('Fetched data:', data); // In dữ liệu đã lấy được
    } catch (err) {
        console.error('Error during MongoDB operations:', err);
    } finally {
        await client.close(); // Đóng kết nối sau khi hoàn thành
    }
})();

// Gửi yêu cầu HTTP tới API và kiểm tra dữ liệu
fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.every(validateArticleStructure)) {
            console.log('Data format is correct:', data);
        } else {
            console.error('Data format is incorrect:', data);
        }
    })
    .catch(error => console.error('Error during fetch:', error));
    const express = require('express');
    const mongoose = require('mongoose');
    const articleRoutes = require('./routes/articles');
    const subscriberRoutes = require('./routes/subscribers');
    
    const app = express();
    const port = 3000;
    
    // Connect to MongoDB
    mongoose.connect('mongodb://127.0.0.1:27017/newspaper', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('Successfully connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
    
    app.use(express.json());
    
    // Routes
    app.use('/articles', articleRoutes);
    app.use('/subscribers', subscriberRoutes);
    
    // Start the server
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articles');
const writerRoutes = require('./routes/writers');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/newspaper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/articles', articleRoutes);
app.use('/writers', writerRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const editorRoutes = require('./routes/editors');
const writerRoutes = require('./routes/writers');
const articleRoutes = require('./routes/articles');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/newspaper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/editors', editorRoutes);
app.use('/writers', writerRoutes);
app.use('/articles', articleRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

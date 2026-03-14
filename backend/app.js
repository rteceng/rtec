const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middlewares/error');
const products = require('./routes/product');
const auth = require('./routes/auth')

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.set('query parser', 'extended');

app.use('/api/v1/', products);
app.use('/api/v1/', auth);

// Error middleware (must be last)
app.use(errorMiddleware);

/*if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend',  'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
    });
}*/

module.exports = app;
const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const database = require('./config/database');

dotenv.config({path: path.join(__dirname, 'config', 'config.env')})

database();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening to Port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});

process.on('unhandledRejection', (err)=>{
    console.log(`Error : ${err.message}`);
    console.log('shutting down the server due to unhandledRejection');
    server.close(()=>{
        process.exit(1);
    })
});

process.on('uncaughtException', (err)=>{
    console.log(`Error : ${err.message}`);
    console.log('shutting down the server due to uncaughtError');
    server.close(()=>{
        process.exit(1);
    })
});



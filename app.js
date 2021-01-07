const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth.routes');


const app = express();

app.use('/api/auth', authRoute);


const PORT = config.get('port') || 5000;

async function start() {
    try {
await mongoose.connect(config.get('mongoURI'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
app.listen(PORT, () => console.log(`app has been started on port ${PORT}`));
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}



start();













// {
//     "port" : 5000,
//     "mongoURI" :"mongodb+srv://staskorotkiy92:qwerty1234@cluster0.tnhxq.mongodb.net/collections-management-app?retryWrites=true&w=majority",
//     "jwtSecret": "secretString"
// }
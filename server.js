const express = require('express'),
    port = 5000;

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const corsOptions = {
    origin: ['http://locallhost:8000'],
    credentials:true,
    optionsSuccessStatus:200,
}

app.use(cors(corsOptions));

const downloadRoutes = require('./server/api/youtube');
app.use('/youtube',downloadRoutes)


app.listen(port,function(){
    console.log(`sever started on port ${port}`);
});
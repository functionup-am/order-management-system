const express = require('express');
const mongoose = require('mongoose');
const route = require('./route/route')
const app = express();
app.use(express.json())

mongoose.connect('mongodb+srv://AkshayMakwana:Akshay123@cluster0.zmta9.mongodb.net/order-management-system-DB?retryWrites=true&w=majority',
{
    useNewUrlParser: true
})

.then(()=>{ console.log('mongodb is connected') })

.catch((err)=>{ console.log(err) })

app.use('/', route);

app.listen(3000,()=>{ console.log('server start') });
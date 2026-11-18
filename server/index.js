require('dotenv').config(); // импорт конфига из модуля dotenv чтобы сервер мог считывать файл ".env"
const sequelize = require('./db'); // импортируем обьект из файла db
const express = require('express') // импортируем express
const models = require('./models/models');
const cors = require('cors'); // для того чтобы мы могли отправлять запросы с браузера
const fileUpload = require('express-fileupload');
const path = require('path');
const router = require('./Routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware')

const PORT = process.env.PORT || 2000
const app = express() //создадим обьект вызвав функцию express

app.use(cors())
app.use(express.json()) // для того чтобы наше приложение могло парсить json формат
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)



const start = async () => { // функция для подключения к базе данных. Делаем функцию async поскольку все операции з бд являются асинхронными

    try{
        await sequelize.authenticate() // спомощу этой функции будет устанавливатся подключение к базе данных
        await sequelize.sync() // эта функция будет сверять состояние базы банных со схемой данных

        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`)) // у обьекта app вызываем функцию listen, передаём в нее значение порта и функцию которая должна быть выполнена при успешном подключении
    } catch (e){
        console.log(e)
    }

}

start() // вызов функции



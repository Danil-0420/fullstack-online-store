const {Sequelize} = require('sequelize') // деструктуризация, распаковка модуля Sequelize для обращения именно к нужной переменной


module.exports = new Sequelize( // new Sequelize(...) creates the connection/configuration for your PostgreSQL database.  module.exports = ... makes this object available outside this file.
    process.env.db_name, // название базы данных
    process.env.db_user, // имя пользователя
    process.env.db_password, // пароль к дб
    {
        dialect: 'postgres', // какая субд используется, mysql, postgres и тд.
        host: process.env.db_host, // хост
        port: process.env.db_port // порт
    }

)

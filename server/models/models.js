const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {primaryKey: true, type: DataTypes.INTEGER, autoIncrement: true},
    user_name: {type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    info: {type: DataTypes.STRING, allowNull: true},
    role: {type: DataTypes.STRING, defaultValue: 'USER', allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: true}
})

const Order = sequelize.define('order', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'Created'},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    payment_method: {type: DataTypes.STRING, allowNull: false},
    creation_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    total_price: {type: DataTypes.DECIMAL(10, 2),allowNull: false},
    payment_status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'Unpaid'}
})

const Delivery = sequelize.define('delivery', {
    company_name: {type: DataTypes.STRING, allowNull: false},
    delivery_method: {type: DataTypes.STRING, allowNull: false},
    delivery_price: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    delivery_address: {type: DataTypes.STRING, allowNull: false},
    tracking_number: {type: DataTypes.STRING(50), allowNull: true},
    shipped_at: {type: DataTypes.DATE, allowNull: true}
})

const Basket = sequelize.define('basket', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true}
})

const Basket_Item = sequelize.define('basket_item', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false}
})

const Rating = sequelize.define('rating', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    feedback:{type: DataTypes.TEXT, allowNull: true}
})

const Type = sequelize.define('type', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
})

const Brand = sequelize.define('brand', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
})

const Brand_type = sequelize.define('brand_type', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
})

const Product = sequelize.define('product', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true
    },
    name: {type: DataTypes.STRING, allowNull: false, unique: true
    },
    price: {type: DataTypes.DECIMAL(10, 2), allowNull: false
    },
    stock: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0
    }
});



const Order_item = sequelize.define('order_item', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.DECIMAL(10, 2), allowNull: false}
})

const Product_info = sequelize.define('Product_info', {
    id: {primaryKey: true, type: DataTypes.INTEGER, allowNull: false, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})

const Product_img = sequelize.define('product_img', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Product.hasMany(Product_img)
Product_img.belongsTo(Product)

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Order.hasOne(Delivery)
Delivery.belongsTo(Order)

Order.hasMany(Order_item)
Order_item.belongsTo(Order)

Basket.hasMany(Basket_Item)
Basket_Item.belongsTo(Basket)

Product.hasMany(Basket_Item)
Basket_Item.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'basketProduct'
})


Brand.hasMany(Product)
Product.belongsTo(Brand)

Type.hasMany(Product)
Product.belongsTo(Type)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(Order_item)
Order_item.belongsTo(Product)

Type.belongsToMany(Brand, {through: Brand_type})
Brand.belongsToMany(Type, {through: Brand_type})

Product.hasMany(Product_info, {as: 'info'})
Product_info.belongsTo(Product)


module.exports = {
    User,
    Order,
    Delivery,
    Type,
    Brand,
    Brand_type,
    Product,
    Order_item,
    Product_info,
    Rating,
    Basket,
    Basket_Item,
    Product_img
}





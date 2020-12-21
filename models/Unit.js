const { Schema, model, Types} = require('mongoose')


// Схема для добавления новой единицы измерения
const schema = new Schema({
    unit: {type: String, required: true},
    value: {type: Number, required: true}
})

module.exports = model("Unit", schema)
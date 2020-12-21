const { Schema, model, Types} = require('mongoose')


// Схема для получения запроса на конвертацию единиц измерения
const schema = new Schema({
    distance: { 
        name: {type: String, required: true},
        value: {type: Number, required: true}
    },
    convert_to: { type: String, required: true, default: "m"} 
})

module.exports = model("Query", schema)
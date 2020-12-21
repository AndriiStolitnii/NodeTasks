const { Router} = require('express')
const router = Router()
const { check, validationResult } = require('express-validator')
const Query = require('./models/Query')
const Unit = require('./models/Unit')

router.post(
    '/сhange',
    [
        check('distance').notEmpty(),
        check('convertTo').isString().notEmpty()
    ],
    async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: 'Некорректные входящие данные при конвертации единицы измерения'})
        }

        const {distance, convertTo} = req.body
        const {unit, value} = distance

        const exist = await Unit.findOne({ name: unit }) && await Unit.findOne({ name: convertTo })

        if(!exist) {
            return res.status(400).json({message: 'Такой единицы измерения не существует в базе данных'})
        }

        const convertFromValue = Unit.findOne({name: unit}).value
        const convertToValue = Unit.findOne({name: convertTo}).value

        const convertValue = +value*(convertFromValue/convertToValue).toFixed(2)

        res.json({ unit: convertTo, value: convertValue})

    } catch (error) {
        res.status(500).json({message: 'Произошла ошибка'})
    }
})

router.post(
    '/add',  
    [
        check('name', 'Некорректное название единицы измерения. Введите сокращенное название: 1-3 символа латиницей').isLength({ min: 1, max: 3 }).isString(),
        check('value', 'Введите число').isNumeric()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: 'Некорректные входящие данные при добавлении единицы измерения'})
        }

        const {name, value} = req.body

        const addingUnit = await Unit.findOne({ unit: name })

        if (addingUnit) {
            return res.status(400).json({ message: 'Такая единица измерения существует'})
        }

        const unit = new Unit({ unit: name, value })

        await unit.save()

        res.status(201).json({ message: 'Единица измерения добавлена'})

    } catch (error) {
        res.status(500).json({message: 'Не удалось добавить единицу измерения'})
    }
})

router.get(
    '/units',  
    async (req, res) => {
    try {
        const units = await Unit.find({})
        res.json(units)

    } catch (error) {
        res.status(500).json({message: 'запрос не получен'})
    }
})

module.exports = router
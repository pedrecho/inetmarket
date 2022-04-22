const {Device, DeviceInfo} = require("../models/models")
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')

class DeviceController {
    async create(req, res, next) {
        try {
            const {name, price, brandId, typeId} = req.body
            let {info} = req.body
            const {img} = req.files
            const fileName = uuid.v4() + '.jpg'
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName})
            if (info) {
                info = JSON.parse(info)
                info.forEach(item => {
                    DeviceInfo.create({
                        title: item.title,
                        description: item.description,
                        deviceId: device.id
                    })
                })
            }
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res) {
        const {brandId, typeId} = req.query
        let {limit, page} = req.query
        limit = limit || 10
        page =  page || 1
        const offset = (page - 1) * limit
        let devices
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }
    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne({
            where: {id},
            include: [{model: DeviceInfo, as: 'info'}]
        })
        return res.json(device)
    }
}

module.exports = new DeviceController
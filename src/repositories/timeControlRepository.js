const { ControlTime } = require("../db/models");

class TimeControlRepository{
    async getTimeControlById(id) { 
        return await ControlTime.findOne().where({ employee: id }).populate("employee").populate("location");  
    }
    async getAllTimeControls() { 
        return await ControlTime.find().populate("employee").populate("location");
    }   
    async createTimeControl(id, data) {
        return await ControlTime.findByIdAndUpdate(id, {
            $set: {
                [`${data.label}`]: data.time,
                location: data.location,
            },
        }, {new: true}).populate("location", "street");
    }   

    async deleteTimeControl(id) { 
        return await ControlTime.findByIdAndDelete(id);
    }
}

module.exports = TimeControlRepository;
import {  ControlTime  } from '../db/models/index.js';

class TimeControlRepository{
    async getTimeControlById(id) { 
        return await ControlTime.findOne().where({ employee: id }).populate("employee").populate("location","locations.street");  
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
        }, {new: true}).populate("location", "locations");
    }   

    async deleteTimeControl(id) { 
        return await ControlTime.findByIdAndDelete(id);
    }
}

export default TimeControlRepository;
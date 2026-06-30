import { createReport } from '../report/index.js';
import {  ControlTime  } from '../db/models/index.js';

class Report {
  async createReport() {
    const registers = await ControlTime.find().populate("locations", "street").populate("employee", "username");
    createReport(registers);
  }
}

export { Report,  };

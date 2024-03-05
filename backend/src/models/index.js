import {mongoose} from 'mongoose';

import { clientSchema } from '../schemas/index.js';

export const Client = mongoose.model('Client', clientSchema);
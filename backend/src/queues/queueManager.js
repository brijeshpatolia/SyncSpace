import Queue from 'bull';

import redisConfig from '../config/redisConfig.js';

// Define multiple queues
export const mailQueue = new Queue('mailQueue', { redis: redisConfig });


export default { mailQueue};

import Queue from 'bull'
import redisConfig from '../config/redisConfig.js'



export default new Queue('mailQueue', {
  redis: redisConfig
})




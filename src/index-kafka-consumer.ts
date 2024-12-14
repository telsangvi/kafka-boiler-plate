import express from 'express'
import { runConsumers } from './kafka/service/consumers/consumerRunner'

const app = express()


runConsumers()
    .catch((error) => {
        console.error('kafka consumers error!')
    })
    .then(() => {
        console.info('kafka consumers are initialized!')
    })


app.listen(3005, () => {
    console.info('Express server is running on port ' + 3005)
})

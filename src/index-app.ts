
import 'reflect-metadata'
import kafkaProducer from './kafka/service/producer/index'
import express from 'express'

const app = express()

const start = async () => {
    app.listen(3000, async () => {
        console.debug('Listening on Port ' + 3000)
    })
}

start()
    .then(() => {
        kafkaProducer
            .start()
            .then(() => {
                console.info('Successfully started kafka producer')
            })
            .catch((error) => {
                console.error('Error starting kafka producer')
            })
        console.info('Successfully started server ...')
    })
    .catch((error) => {
        console.error('error starting server', error)
    })

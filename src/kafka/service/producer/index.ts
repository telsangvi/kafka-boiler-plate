import { kafkaProducerMessage } from '../../config'
import KafkaService from '../index'

class Producer {

  private kafkaService: KafkaService

  constructor() {
    this.kafkaService = KafkaService.getInstance()
  }

  async start() {
    await this.kafkaService.start() // Ensure KafkaService is started
  }

  async produce(message: kafkaProducerMessage) {
    if (this.kafkaService) {
      await this.kafkaService.produce(message)
    } else {
      console.warn('Cannot produce, kafka service is not initialized')
    }
  }
}

export default new Producer()

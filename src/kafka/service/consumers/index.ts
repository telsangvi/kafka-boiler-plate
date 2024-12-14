
import { Consumer as KafkaConsumer } from 'kafkajs'
import { consumerConfigs, processMessage } from '../../config'
import { KafkaConsumers } from '../../interface/consumer'
import KafkaService from '../index'

export class BaseConsumer implements KafkaConsumers {
  protected kafkaService: KafkaService

  protected consumer: KafkaConsumer

  private retryCount: number

  protected groupId: string

  protected topics: string[]

  constructor(groupId: string, topics: string[]) {

    this.kafkaService = KafkaService.getInstance()

    this.consumer = this.kafkaService.getConsumer(groupId)

    this.retryCount = 0

    this.groupId = groupId

    this.topics = topics
  }

  async start() {
    // No need to call await this.kafkaService.start() here,
    // assuming it is called once during application initialization in kafka producer.
    await this.connect()
  }

  private async connect() {
    try {
      console.debug('Kafka connect retry count', this.retryCount)
      await this.consumer.connect()
      console.info('Connected to Kafka as a consumer')

      // Subscribe to topics
      for (const topic of this.topics) {
        console.debug(`Subscribing to topic`, topic)
        await this.consumer.subscribe({
          topic: topic,
          fromBeginning: true,
        })
      }

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.debug('Message recieved at kafka consumer is', {
            topic,
            partition,
            message,
          })
          const messageValue = message?.value?.toString()!
          const messageObj: processMessage = JSON.parse(messageValue)
          // Call the specific business logic for the topic
          await this.processMessage(topic, messageObj)
        },
      })
    } catch (error) {
      this.retryCount++
      if (this.retryCount === consumerConfigs.maxRetryConnectCount) {
        console.error(`Failed to connect to Kafka`)
        return false
      } else {
        console.error(
          `Failed to connect consumer to Kafka, retrying`
        )
        setTimeout(() => this.connect(), 5000)
      }
    }
  }

  // Placeholder method to be implemented by subclasses
  async processMessage(
    topic: string,
    messageValue: processMessage
  ): Promise<void> {
    throw new Error("Method 'processMessage()' must be implemented.")
  }

  getConsumerClassName() {
    throw new Error("Method 'getConsumerClassName()' must be implemented.")
  }
}

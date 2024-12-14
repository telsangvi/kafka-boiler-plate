
import { Kafka, Producer, Admin } from 'kafkajs'

import {
  kafkaTopicsWithConfig,
  kafkaConfig,
  topicCreateAdminConfig,
  kafkaProducerMessage,
} from '../config/index'

class KafkaService {
  private static instance: KafkaService

  private kafka: Kafka

  private admin: Admin

  private producer: Producer

  private isConnected: boolean

  private isInitialized: boolean

  private constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      requestTimeout: kafkaConfig.requestTimeout,
      retry: kafkaConfig.retry,
    })
    this.admin = this.kafka.admin()
    this.producer = this.kafka.producer()
    this.isConnected = false
    this.isInitialized = false
  }

  public static getInstance(): KafkaService {
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaService()
    }
    return KafkaService.instance
  }

  public async start(): Promise<void> {
    if (!this.isInitialized) {
      // Check if already initialized
      await this.connect()
      this.isInitialized = true // Set as initialized
    }
  }

  private async connect(): Promise<void> {
    try {
      await this.producer.connect()
      this.isConnected = true
      console.info('Connected to Kafka')
      await this.createTopics(kafkaTopicsWithConfig)
    } catch (error) {
      console.error(`Failed to connect to Kafka: ${error}`)
      setTimeout(() => this.connect(), 5000)
    }
  }

  private async topicExists(topicName: string): Promise<boolean> {
    try {
      const { topics } = await this.admin.fetchTopicMetadata({
        topics: [topicName],
      })
      const topicMetadata = topics.find((topic) => topic.name === topicName)
      return !!topicMetadata
    } catch (error) {
      console.error('Error checking topic existence:', error)
      return false
    }
  }

  private async createTopics(topicsToCreate: any[]): Promise<void> {
    try {
      console.debug('Creating topics', topicsToCreate)
      await this.admin.connect()
      const createTopics = []
      for (const topicConfig of topicsToCreate) {
        const topicName = topicConfig.topic
        const topicAlreadyExists = await this.topicExists(topicName)

        if (topicAlreadyExists) {
          console.warn(
            `Topic '${topicName}' already exists. Skipping creation.`
          )
          continue
        }

        createTopics.push(topicConfig)
      }

      if (createTopics.length > 0) {
        const result = await this.admin.createTopics({
          topics: createTopics,
          waitForLeaders: topicCreateAdminConfig.waitForLeaders,
          timeout: topicCreateAdminConfig.timeout,
        })
        console.info(
          `Topics '${JSON.stringify(createTopics)}' created successfully`,
          JSON.stringify(result)
        )
      }
    } catch (error) {
      console.error('Error creating topics:', error)
    } finally {
      await this.admin.disconnect()
    }
  }

  public async produce(producerMessage: kafkaProducerMessage): Promise<void> {
    const { topic, message } = producerMessage
    console.debug(
      `Message recieved to produce to Kafka topic ${topic} is`,
      message
    )
    try {
      if (!this.isConnected) {
        console.warn('Kafka producer is not connected yet')
        this.connect()
        return // exit the function if the producer is not connected
      }
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message.value) }],
      })
    } catch (error) {
      this.isConnected = false
      this.connect()
      console.error(`Failed to send message to Kafka: ${error}`)
    }
  }

  public getConsumer(groupId: string) {
    return this.kafka.consumer({ groupId })
  }
}

export default KafkaService

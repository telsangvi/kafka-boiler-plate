import { processMessage } from '../config'

export interface KafkaConsumers {
  processMessage(topic: string, messageValue: processMessage): any
  getConsumerClassName(): any
}

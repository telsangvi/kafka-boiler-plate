import { BaseConsumer } from '.'
import { ABCUserConsumer } from './ABC/user'
import { XYZUserConsumer } from './XYZ/user'


const startConsumer = async (
  ConsumerClass: any,
  consumerInstances: Promise<void>[]
) => {
  let consumer: BaseConsumer
  try {
    consumer = new ConsumerClass()
    consumerInstances.push(consumer.start())
    console.info(`Started ${consumer.getConsumerClassName()}`)
  } catch (error) {
    // Do nothing
  }
}

export const runConsumers = async () => {
  const consumerInstances: Promise<void>[] = []

  // List of consumers to start
  const consumers = [
    ABCUserConsumer,
    XYZUserConsumer,
  ]

  // Start all consumers
  for (const ConsumerClass of consumers) {
    await startConsumer(ConsumerClass, consumerInstances)
  }

  try {
    await Promise.all(consumerInstances)
    console.info('All consumers started successfully')
  } catch (error) {
    console.error('Error in running consumers:', error)
  }
}


import { kafkaConsumerGroups, kafkaTopics } from '../../../config'
import { BaseConsumer } from '../index'

export class ABCUserConsumer extends BaseConsumer {

  constructor() {
    super(kafkaConsumerGroups.ABC_USER_GROUP, [
      kafkaTopics.USER_CREATE,
      kafkaTopics.USER_UPDATE,
    ])
  }

  getConsumerClassName() {
    return 'ABCUserConsumer'
  }

  async processMessage(
    topic: string,
    messageValue: string | number[]
  ): Promise<void> {
    // Your business logic here
  }
}

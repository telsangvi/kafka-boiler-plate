import { kafkaConsumerGroups, kafkaTopics } from '../../../config'
import { BaseConsumer } from '../index'

export class XYZUserConsumer extends BaseConsumer {

  constructor() {
    super(kafkaConsumerGroups.XYZ_USER_GROUP, [
      kafkaTopics.USER_CREATE,
      kafkaTopics.USER_UPDATE,
    ])
  }

  getConsumerClassName() {
    return 'XYZUserConsumer'
  }

  async processMessage(
    topic: string,
    messageValue: string | number[]
  ): Promise<void> {
    // Your business logic here
  }
}

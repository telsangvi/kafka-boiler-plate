
export type kafkaProducerMessage = {
  topic: string
  message: {
    key?: any
    value: any
  }
}

export const kafkaConfig = {
  clientId: 'process.env.NODE_ENV' + 'process.env.KAFKA_CLIENT',
  brokers: 'process.env.KAFKA_BROKERS'.split(','),
  requestTimeout: 1000,
  retry: {
    initialRetryTime: 1000,
    retries: 10,
  },
}

export const topicCreateAdminConfig = {
  waitForLeaders: true,
  timeout: 10000,
}

export const consumerConfigs = {
  maxRetryConnectCount: 5,
}

export type processMessage = string | number[] | any

type KafkaTopicsType = {
  //Your your kafka topics here
  USER_CREATE: string
  USER_UPDATE: string
}

export const kafkaTopics: KafkaTopicsType = (() => {
  //append NODE_ENV prefix to every topic by default.
  const envPrefix = process.env.NODE_ENV ? process.env.NODE_ENV + '_' : ''

  const topics: KafkaTopicsType = {
    //Maintain the same topic defined in kafkaTopicsType
    USER_CREATE: 'user_create',
    USER_UPDATE: 'user_update',
  }

  return Object.fromEntries(
    Object.entries(topics).map(([key, value]) => [key, envPrefix + value])
  ) as KafkaTopicsType
})()

export const kafkaConsumerGroups = {
  //Your kafka user groups here
  ABC_USER_GROUP: 'abc-user-group',
  XYZ_USER_GROUP: 'xyz-user-group',
}

export const kafkaTopicsWithConfig = [
  // Your kafka topics configs here
  {
    topic: kafkaTopics.USER_CREATE,
    numPartitions: 1,
    replicationFactor: 1,
  },
  {
    topic: kafkaTopics.USER_UPDATE,
    numPartitions: 1,
    replicationFactor: 1,
  }
]

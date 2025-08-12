import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Partitioners, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private producer: Producer;
  private readonly logger = new Logger(KafkaService.name);

  async onModuleInit() { 
    const kafka = new Kafka({ brokers: [process.env.KAFKA_BOOTSTRAP] });
    this.producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner});
    await this.producer.connect();
  }

  async send(topic: string, message: object) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (err) {
      this.logger.error(`Kafka send error: ${err?.message || err}`);
      throw err;
    }
  }
}
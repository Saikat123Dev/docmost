import { Inject, Injectable } from '@nestjs/common';
import { MAIL_DRIVER_TOKEN } from './mail.constants';
import { MailDriver } from './drivers/interfaces/mail-driver.interface';
import { MailMessage } from './interfaces/mail.message';
import { EnvironmentService } from '../environment/environment.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName, QueueJob } from '../queue/constants';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_DRIVER_TOKEN) private mailDriver: MailDriver,
    private readonly environmentService: EnvironmentService,
    @InjectQueue(QueueName.EMAIL_QUEUE) private emailQueue: Queue,
  ) {}

  async sendEmail(message: Omit<MailMessage, 'from'>): Promise<void> {
    const sender = `${this.environmentService.getMailFromName()} <${this.environmentService.getMailFromAddress()}> `;
    await this.mailDriver.sendMail({ from: sender, ...message });
  }

  async sendToQueue(message: Omit<MailMessage, 'from'>): Promise<void> {
    await this.emailQueue.add(QueueJob.SEND_EMAIL, message);
  }
}

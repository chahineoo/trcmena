import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CalculateFeeResponseDTO,
  PaymentResponseDTO,
} from './dto/responses.dto';
import {
  CalculateFeeDTO,
  CreatePaymentDTO,
  GetPaymentDTO,
} from './dto/requests.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle()
  @Post('payment')
  async createPayment(
    @Body() dto: CreatePaymentDTO,
  ): Promise<PaymentResponseDTO> {
    return this.appService.createPayment(dto);
  }

  @SkipThrottle()
  @Get('payment')
  async getPayment(@Query() dto: GetPaymentDTO): Promise<PaymentResponseDTO> {
    return this.appService.getPayment(dto);
  }

  @SkipThrottle()
  @Get('calculate-fee')
  calculateFee(@Query() dto: CalculateFeeDTO): CalculateFeeResponseDTO {
    return this.appService.calculateFee(dto.amount);
  }
}

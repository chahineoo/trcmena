import { Type } from 'class-transformer';
import {
  IsEmail,
  IsLocale,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  currencyFrom: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(128)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  passport: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  clientName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  payerName: string;

  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/((0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01]).[12]\d{3})/, {
    message: `$property must be a valid date (Required format: MM.DD.YYYY)`,
  })
  dateBirthday: string;

  @IsLocale()
  @IsOptional()
  locale?: string;
}

export class GetPaymentDTO {
  @ValidateIf((dto) => !dto.timestamp || (dto.id && dto.timestamp))
  @IsNumberString()
  id?: string;

  @Type(() => Number)
  @ValidateIf((dto) => !dto.id || (dto.id && dto.timestamp))
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  timestamp?: number;
}

export class CalculateFeeDTO {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

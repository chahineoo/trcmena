import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { AxiosError } from 'axios';
import { Environments } from 'src/config/config.enum';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly nodeEnv: string) {}

  catch(
    exception:
      | HttpException
      | Error
      | AxiosError
      | PrismaClientInitializationError
      | PrismaClientRustPanicError
      | PrismaClientValidationError
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let statusCode: number = 500;
    let message: string = 'Internal Server Error';
    let error: string = 'Internal Server Error';

    const basicResponse = {
      statusCode,
      error,
      message,
    };

    const developResponse = {
      ...basicResponse,
      details: {
        env: this.nodeEnv,
        path: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
        body: request.body,
        haders: request.headers,
        stack: exception.stack,
      },
    };

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      const res =
        typeof errorResponse === 'string'
          ? { message: errorResponse }
          : { ...errorResponse };

      statusCode = exception.getStatus();
      error =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['error'] || error;
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['message'] || message;

      basicResponse.statusCode = statusCode;
      basicResponse.error = error;
      basicResponse.message = message;

      developResponse.statusCode = statusCode;
      developResponse.error = error;
      developResponse.message = message;
      developResponse.details['meta'] = res;
    } else if (exception instanceof AxiosError) {
      developResponse.details['meta'] = {
        type: exception.name,
        message: exception.message,
        requestUrl: exception.request?.res?.responseUrl,
        curl: exception.request?._header,
        response: exception.response?.data,
        body: exception.request?.body,
        params: exception.request?.params,
      };
    } else if (
      exception instanceof PrismaClientInitializationError ||
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientValidationError ||
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientUnknownRequestError
    ) {
      let code: string = '';
      if (exception instanceof PrismaClientKnownRequestError) {
        code = exception.code;
      } else if (exception instanceof PrismaClientInitializationError) {
        code = exception.errorCode;
      }
      developResponse.details['meta'] = {
        type: exception.name,
        message: exception.message,
        code: code,
        version: exception.clientVersion,
      };
    } else if (exception instanceof Error) {
      developResponse.details['meta'] = {
        name: exception.name,
        message: exception.message,
      };
    }

    Logger.error(`Request ${request.url} with statusCode ${statusCode}`);
    Logger.error(exception.stack);
    Logger.error(developResponse.details['meta']);

    response
      .status(statusCode)
      .json(
        this.nodeEnv === Environments.production
          ? basicResponse
          : developResponse,
      );
  }
}

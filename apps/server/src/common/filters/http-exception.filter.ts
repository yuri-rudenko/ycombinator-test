import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    else if (typeof exception === 'object' && exception !== null && 'errors' in exception) {
      const squareErrors = exception.errors;
      if (Array.isArray(squareErrors) && squareErrors.length > 0) {
        status = HttpStatus.BAD_REQUEST;
        message = `Square API Error: ${squareErrors[0].detail || squareErrors[0].category}`;
      }
    }
    else if (exception instanceof TypeError && exception.message.includes('BigInt')) {
      message = 'Serialization Error: BigInt cannot be serialized to JSON';
    }

    this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
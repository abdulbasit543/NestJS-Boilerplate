import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
  constructor(key: string = "errors.not_found", data?: any) {
    super({ key, data }, HttpStatus.NOT_FOUND);
  }
}
export class UnAuthorizedException extends HttpException {
  constructor(key: string = "errors.unauthorized", data?: any) {
    super({ key, data }, HttpStatus.UNAUTHORIZED);
  }
}
export class BadRequestException extends HttpException {
  constructor(key: string = "errors.bad_request", data?: any) {
    super({ key, data }, HttpStatus.BAD_REQUEST);
  }
}
export class ForbiddenException extends HttpException {
  constructor(key: string = "errors.forbidden", data?: any) {
    super({ key, data }, HttpStatus.FORBIDDEN);
  }
}
export class FatalErrorException extends HttpException {
  constructor(key: string = "errors.fatal", data?: any) {
    super({ key, data }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

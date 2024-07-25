import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export const Authorized = (roleOrRoles?: UserType | Array<UserType>) => {
    let authorizedRoles = [];
    if (roleOrRoles) authorizedRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return applyDecorators(
        SetMetadata('roles', authorizedRoles),
        SetMetadata('authorization', true),
        ApiSecurity('authorization'),
    );
};

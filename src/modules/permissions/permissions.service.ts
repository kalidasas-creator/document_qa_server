import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  getPermissionMatrix() {
    return {
      admin: ['create_user', 'delete_user', 'read_doc', 'edit_doc', 'delete_doc'],
      editor: ['read_doc', 'edit_doc'],
      viewer: ['read_doc'],
    };
  }
}
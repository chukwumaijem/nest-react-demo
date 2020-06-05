import { genSaltSync, hashSync } from 'bcryptjs';

export const hashPassword = function() {
  if (this.password) {
    const salt = genSaltSync(10);
    this.password = hashSync(this.password, salt);
  }
};

import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUserTokensRespository from '../repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRespository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findBytoken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}
export default ResetPasswordService;

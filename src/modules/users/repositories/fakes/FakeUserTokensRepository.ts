import { uuid } from 'uuidv4';

import IUserTokensRespository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRespository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }
  public async findBytoken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findtoken => findtoken.token === token,
    );

    return userToken;
  }
}

export default FakeUserTokensRepository;

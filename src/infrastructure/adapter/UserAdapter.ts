import { Repository, PrimaryGeneratedColumn } from 'typeorm';
import { User as UserDomain} from "../../domain/User";
import { UserPort } from "../../domain/UserPort";
import { User as UserEntity } from "../entities/User";

export class UserAdapter implements UserPort{

  constructor(private userRepository: Repository<UserEntity>){}

  private toDomain(user: UserEntity): UserDomain {
    return {
      id: user.id,
      first_name: user.first_name,
      second_name: user.second_name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      email: user.email,
      password: user.password
    }
  }

  private toEntity(user: Omit<UserDomain, "id">):UserEntity{
    const userEntity = new UserEntity();
    userEntity.first_name = user.first_name;
    userEntity.second_name = user.second_name;
    userEntity.last_name = user.last_name;
    userEntity.second_last_name = user.second_last_name;
    userEntity.email = user.email;
    userEntity.password = user.password;
    return userEntity;
  }

  async createUser(user: Omit<UserDomain, "id">): Promise<number> {
    try {
      const newUser = this.toEntity(user);
      const savedUser = await this.userRepository.save(newUser);
      return savedUser.id;
    } catch (error) {
      throw new Error("Error al crear el usuario");
    }
  }

  async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findOne({where: {id: id}});
      if (!existingUser) return false;

      Object.assign(existingUser, {
        first_name: user.first_name ?? existingUser.first_name,
        second_name: user.second_name ?? existingUser.second_name,
        last_name: user.last_name ?? existingUser.last_name,
        second_last_name: user.second_last_name ?? existingUser.second_last_name,
        email: user.email ?? existingUser.email,
        password: user.password ?? existingUser.password
      });

      await this.userRepository.save(existingUser);
      return true;
    } catch (error) {
      throw new Error("Error al actualizar el usuario");
    }
  }
  deleteUser(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getUserById(id: number): Promise<UserDomain | null> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): Promise<UserDomain | null> {
    throw new Error("Method not implemented.");
  }
  getAllUsers(): Promise<UserDomain[]> {
    throw new Error("Method not implemented.");
  }

}
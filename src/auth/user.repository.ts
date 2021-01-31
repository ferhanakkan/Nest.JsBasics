import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entitiy';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username , password } = authCredentialsDto;

        // //Daha onceden bu bilgiler var mi diye control ediliyor.
        // const exists = this.findOne({ username });
        //  if exists {
        //      // Burada islemlere devame et. Ancak bu yontemde 2 kere db cagrisi yapiliyor. Bundan dolayi 2ci cozum e gidiliyor.
                // Bu cozum icin user entitiy'e @Unique eklenerek db tarafinda kontrol yapilmasini sagliyoruz.
        //  }

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt(); // Crypted key olusturuyor.
        user.password = await this.hashPassword(password, user.salt);
        
        try {
            await user.save();
        } catch(error) {
            // console.log(error.code);
            if (error.code === '23505') { // Ayni username hali hazirda kullaniliyor.
                throw new ConflictException('Kullanici adi kullaniliyor');
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username , password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username
        } else {
            return null
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password,salt);
    }
}
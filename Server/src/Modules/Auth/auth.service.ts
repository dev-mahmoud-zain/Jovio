import { _default } from './../../../node_modules/@types/validator/index.d';
import { UserRepository } from './../../Database/Repository/user.repository';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { ExceptionFactory } from 'src/Common/Utils/Response/error.response';

const ErrorResponse = new ExceptionFactory();

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async signup(body: SignupDto) {


        await this.userRepository.findExistsUser({
            filter: [
                { key: 'email', value: body.email },
                { key: 'phoneNumber', value: body.phoneNumber || '' }
            ],
            throwError: true
        });

        //  للإيميل و الفون  Enc  الكومنت ده عشان لما أصحى أفتكر اني أعمل هاش للباسوورد و 

        const { confirmPassword, ...userData } = body

        await this.userRepository.create({
            data: [
                {
                    ...userData
                }
            ]
        })

        return { message: 'User signed up successfully' };
    }

}
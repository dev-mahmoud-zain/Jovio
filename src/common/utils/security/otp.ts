import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserDocument } from "src/DATABASE";
import { compareHash } from "./hash.security";

export const generateOTP = (): string => {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
};

// export const validateOTP_Code = async (user: UserDocument, OTP_Code: string):Promise<Boolean> => {

//   if (user.emailConfirmedAt) {
//     throw new BadRequestException("Email Is Already Confirmed");
//   }

//   if (! await compareHash(OTP_Code, user.OTP_Code)) {


//       console.log(OTP_Code,await compareHash(OTP_Code, user.OTP_Code))

      
//     throw new BadRequestException("Wrong OTP_Code")
//   }

//   if (new Date().getTime() >= new Date(user.OTP_CodeExpiresAt).getTime()) {
//     throw new BadRequestException("Expired OTP_Code")
//   }
  

//   return true

// }
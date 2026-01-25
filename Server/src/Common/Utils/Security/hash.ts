import bcrypt from "bcryptjs";

export const generateHash = async (
    {
        text,
        salt = process.env.HASH_SALT ? parseInt(process.env.HASH_SALT) : 10
    }: {
        text: string,
        salt?: number
    }
): Promise<string> => {
    return await bcrypt.hash(text, salt || 10);
  
};



export const compareHash = async ({
    plainText,
    hashText
}: {
    plainText: string,
    hashText: string
}) => {
    return await bcrypt.compare(plainText , hashText)
}
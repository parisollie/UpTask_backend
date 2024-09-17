import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    //Vid 532
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
//Vid 542
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash)
}
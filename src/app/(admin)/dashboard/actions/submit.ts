"use server"

export const submitLogin = async (email: string, password: string) => {
  console.log({ email, password });
if(email === process.env.EMAIL_DASHBOARD && password === process.env.PASSWORD_DASHBOARD) {
  return true
}
return false
};

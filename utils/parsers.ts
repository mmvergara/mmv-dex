export const emailToUsername = (email: string) => email.split("@").slice(0, -1)[0];
export const usernameToEmail = (username: string) => username + "@dexlocalhost.com";

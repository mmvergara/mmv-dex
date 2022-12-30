export const emailToUsername = (email: string | null | undefined) => {
  if (!email) return "";
  return email.split("@").slice(0, -1)[0];
};
export const usernameToEmail = (username: string | null | undefined) => {
  if (!username) return "";
  return username + "@dexlocalhost.com";
};

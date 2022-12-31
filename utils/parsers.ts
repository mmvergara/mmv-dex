export const emailToUsername = (email: string | any) => {
  if (email && typeof email === "string") {
    return email.split("@").slice(0, -1)[0];
  }
  return "";
};
export const usernameToEmail = (username: string | any) => {
  if (username && typeof username === "string") {
    return username + "@dexlocalhost.com";
  }
  return "";
};

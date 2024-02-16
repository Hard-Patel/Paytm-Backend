const bcrypt = require("bcrypt");

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword ?? "";
};

export const comparePassword = async (password: string, dbPassword: string) => {
  const passwordMatch = await bcrypt.compare(password, dbPassword);
  return passwordMatch ?? false;
};

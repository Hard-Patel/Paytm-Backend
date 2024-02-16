export const Routes = {
  //Root API route
  RootAPIRoute: "/api/v1/",

  // Users API routes
  usersRoute: "/users",
  getUserRoute: "/get-users",
  addUserRoute: "/signup",
  loginUserRoute: "/signin",
  updateUserRoute: "/update-user",
  deleteUserRoute: "/delete-user",

  // Account API Routes
  accountRoutes: "/account",
  checkAccountBalance: "/balance",
  transferFunds: '/transfer',
};

export const ErrorMessages = {
  insufficientBalance: "Insufficient Balance"
}
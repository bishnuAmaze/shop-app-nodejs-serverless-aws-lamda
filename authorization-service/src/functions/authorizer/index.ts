import { handlerPath } from "@libs/handler-resolver";

export const Authorizer = {
  handler: `${handlerPath(__dirname)}/handler.basicAuthorizer`,
  environment: {
    bishnuAmaze: "TEST_PASSWORD",
  },
};

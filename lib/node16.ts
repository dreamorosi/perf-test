import { STS } from "aws-sdk";

const client = new STS();

export const handler = async () => {
  console.log(await client.getCallerIdentity().promise());

  return { statusCode: 200, body: "ok" };
};

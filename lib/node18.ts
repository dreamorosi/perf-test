import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const client = new STSClient({});

export const handler = async () => {
  console.log(await client.send(new GetCallerIdentityCommand({})));

  return { statusCode: 200, body: "ok" };
};

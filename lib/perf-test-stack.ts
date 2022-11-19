import { Stack, StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
  BundlingOptions,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  RestApi,
  MethodLoggingLevel,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

export class PerfTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "demo-api", {
      restApiName: "demo-api",
      deployOptions: {
        tracingEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
    });
    const node16 = api.root.addResource("node16");
    const node18 = api.root.addResource("node18");

    const settings: Partial<NodejsFunctionProps> = {
      memorySize: 256,
      logRetention: RetentionDays.ONE_DAY,
      awsSdkConnectionReuse: true,
      timeout: Duration.seconds(15),
    };

    const bundling: Partial<BundlingOptions> = {
      minify: true,
    };

    const node16Fn = new NodejsFunction(this, "runtime16", {
      ...settings,
      entry: "lib/node16.ts",
      runtime: Runtime.NODEJS_16_X,
      functionName: "runtime16",
      handler: "handler",
      bundling: {
        ...bundling,
        externalModules: ["aws-sdk"],
      },
    });

    const node18Fn = new NodejsFunction(this, "runtime18", {
      ...settings,
      entry: "lib/node18.ts",
      runtime: Runtime.NODEJS_18_X,
      functionName: "runtime18",
      handler: "handler",
      bundling: {
        ...bundling,
        externalModules: ["@aws-sdk/client-sts"],
      },
    });

    node16.addMethod("GET", new LambdaIntegration(node16Fn));
    node18.addMethod("GET", new LambdaIntegration(node18Fn));

    new CfnOutput(this, "ApiURL", {
      value: `${api.url}`,
    });
  }
}

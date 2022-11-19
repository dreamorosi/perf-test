STACK_NAME=PerfTestStack

API_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiURL`].OutputValue' \
  --output text)

echo $API_URL

ROOT_FOLDER=$(pwd)

artillery run "$ROOT_FOLDER/load-test.yml" --target "$API_URL"
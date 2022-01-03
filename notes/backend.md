# Backend Notes
These are just some notes written up about how our backend might work.

## Helpful Links
- https://blog.expo.dev/how-to-build-cloud-powered-mobile-apps-with-expo-aws-amplify-2fddc898f9a2
- https://docs.amplify.aws/cli-legacy/graphql-transformer/relational/

## To Do
- [ ] Set up the UWFind app on AWS Amplify 
- [ ] Add the AWS Amplify configuration to our codebase
- [ ] Set up AWS Amplify locally
- [ ] Create a relational database on AWS RDS and add to our AWS amplify as a GraphQL datasource
- [ ] Set up the tables for the database
- [ ] Test that creating something using GraphQL on AWS AppSync is appearing in the AWS RDS database
- [ ] Create the GraphQL methods needed for the app

## Debugging
1. **Issue connecting to AWS Amplify**. Need to create an IAM user in the management console and have the person connecting do `amplify configure` and use the access key ID and the secret access key to create a profile. Might need to change the config under `amplify/.config/local-aws-info.json` to the following for it to work: 
```
{
  "staging": {
    "configLevel": "project",
    "useProfile": true,
    "profileName": "default"
  }
}
```

## GraphQL
`Endpoint`: https://dr75v5xwtnafddzwd2rksf4qmq.appsync-api.us-east-2.amazonaws.com/graphql
`Key`:  da2-i4ayhkiceve7necqwqqsvqpaqe
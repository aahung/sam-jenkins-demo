const assert = require("chai").assert;
const AWS = require("aws-sdk");
const axios = require("axios");
const cloudformation = new AWS.CloudFormation();

// Stack name provided through an environment variable.
const STACK_NAME = process.env["STACK_NAME"];
// Value declared in Outputs of template.yaml
const ENDPOINT_KEY = "HelloWorldApi";

describe("GET api test", async () => {
  let apiResponse;

  before(async () => {
    // Describe CFN stack to get the output.
    const response = await cloudformation
      .describeStacks({
        StackName: STACK_NAME,
      })
      .promise();
    // Filter for key containing API Endpoint
    const endpointOutput = response.Stacks[0].Outputs.find(
      (x) => x.OutputKey === ENDPOINT_KEY
    );
    // API Endpoint
    const apiEndpoint = endpointOutput.OutputValue;
    // Save GET response for testing.
    apiResponse = await axios.get(apiEndpoint);
  });

  it("verifies if response code is 200", async () => {
    assert.equal(apiResponse.status, 200);
  });

  it("verifies if response contains my username", async () => {
    assert.include(apiResponse.data.message, "Tarun"); // +1
  });
});

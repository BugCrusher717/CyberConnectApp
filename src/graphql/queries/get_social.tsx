import { gql } from "@apollo/client";

export const GET_SOCIAL = gql`
    query GetIdentity($address: String!) {
        identity(address: $address) {
            twitter {
                handle
                avatar
                verified
                tweetId
                source
                followerCount
            }

            github {
                username
                gistId
                userId
            }
        }
    }
`;

export const verifyTwitterGql = gql`
  mutation VerifyTwitter(
    $address: String!
    $handle: String!
    $namespace: String
  ) {
    verifyTwitter(address: $address, handle: $handle, namespace: $namespace) {
      result
    }
  }
`;

export const verifyGithubGql = gql`
  mutation VerifyGithub(
    $address: String!
    $gistId: String!
    $namespace: String
  ) {
    verifyGithub(address: $address, gistId: $gistId, namespace: $namespace) {
      result
    }
  }
`;
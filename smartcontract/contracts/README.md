# Twitter Smart Contract

## Overview

The "Twitter" smart contract, developed in Solidity, serves as the backend for a simplified social media platform with features inspired by Twitter. This contract facilitates user registration, following, posting, liking posts, direct messaging, and payment mechanisms based on user satisfaction.

## Key Features

- **User Registration**: Users can register with a unique username.

- **Instructor Registration**: Instructors can register with a unique username, and they can provide additional details such as a file hash and a QR code.

- **Following**: Users can follow instructors.

- **Posting**: Instructors can create posts.

- **Liking Posts**: Users can like posts.

- **Direct Messaging**: Users can initiate direct messages with instructors.

- **Payment**: Payment mechanisms are integrated into the chat system, and they are based on user satisfaction and instructor responses.

## Contract Structures

### User Struct
- Represents a user with fields like user ID, username, public key, and a list of instructors they follow..

### Instructor Struct
- Represents an instructor with fields like instructor ID, username, public key, number of followers, list of followers, post count, status (free/busy), file hash, and a QR code.

### Post Struct
- Represents a post with fields for post ID, content, number of likes, and upvotes.

### Message Struct
- Represents a message in the direct messaging system with sender's address, timestamp, and message content.

## Functions

### Withdraw Funds (`withdrawFunds`)

The `withdrawFunds` function allows users and instructors to withdraw funds based on their interactions, primarily in the context of the direct messaging system. Here's how it works:

- Users can initiate the withdrawal if they are satisfied with the instructor's responses in the direct messaging system. However, they can only withdraw if they have not already done so.
  
- Instructors can initiate the withdrawal if they have not already withdrawn and if they have not been rated by the user for all four questions.

- The amount to be withdrawn is calculated based on the number of questions that have been answered. Users can withdraw 0.25 ether for each question answered, while instructors can withdraw based on the number of unanswered questions.

- The `payable` keyword is used to enable the transfer of funds to the user or instructor.

- The function includes checks to ensure that the contract balance is sufficient and that the time for withdrawal has not expired.

### Review (`review`)

The `review` function is designed for instructors to review and rate their interactions with users in the direct messaging system. It is closely tied to the withdrawal of funds, as it influences the amount of funds that can be withdrawn. Here's how it works:

- Instructors can submit reviews and ratings for their interactions with users in the direct messaging system.

- If instructors choose to rate a user's interaction as satisfactory (indicated by the `check` parameter), the interaction receives a positive rating, and both the user and instructor receive a small amount of ether (0.001 ether) as a reward for their satisfactory interaction.

- If instructors choose not to rate the interaction as satisfactory (indicated by `check = false`), the interaction receives a negative rating, which does not trigger the reward.

- The function includes checks to ensure that the instructor has not already reviewed an interaction.

In summary, the `withdrawFunds` function allows users and instructors to withdraw funds based on their interactions, while the `review` function allows instructors to rate these interactions, influencing the withdrawal amounts. Together, these functions create an incentive for positive interactions and allow for the distribution of rewards within the direct messaging system.

## Why Blockchain?

The use of blockchain technology in this smart contract enhances security, transparency, and ownership of data and transactions. It ensures that user interactions are recorded and cannot be easily manipulated or lost.

## Getting Started

1. Clone this repository.

2. Install a Solidity development environment (e.g., Remix or Truffle).

3. Deploy the contract to an Ethereum testnet or a local development blockchain.

4. Interact with the contract using the provided functions to simulate the Twitter-like experience.

## License

This code is open-source and released under the MIT License.

Please note that this is a simplified and educational smart contract. In real-world applications, additional security and functionality considerations are necessary.

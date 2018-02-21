# Scatter Demos

This is a set of integration demos using `eosjs` and the Scatter extension.

Demos currently include 

## Demos Currently Available 

#### Shopping Demo
A small demo showing Scatter's ability to return transactions with private data such as shipping info, 
email, and full name. This can be used to collect data necessary for providing physical products without 
having to lead users through tedious forms.

#### Space Invaders
Showcase of the ability to upload high scores to the EOS blockchain and the use of Identity names as 
usernames instead of EOS account names which provides continuity and a level of abstraction over a 
user's private data.


## Developers

You will need an http server to run this project locally. We recommend `http-server`.

#### Installing Locally
- Clone the repo `git clone https://github.com/EOSEssentials/Scatter-Demos.git`
- Go into the directory and install the dependencies with `npm i`
- Copy the `.env.example` to `.env` and fill out the properties as you need. ( You will need a local EOS dawn x2 node 
running for this repository. You will also need to upload the contracts in the `contracts` folder )
- Build the project using `npm run build`
- Point your http server to the `build` directory.

#### Using http-server
- Run the `npm i -g http-server` command to install `http-server` globally.
- Go into the `build` directory.
- Run `http-server`
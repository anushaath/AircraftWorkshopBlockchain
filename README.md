Aircraft Workshop Factory - Hyperledger Fabric and Composer

This repo is the solution for the Hackathon usecase provided here:
https://github.com/hyperledger/composer/wiki/Hackathon-Exercise---Planes-and-Parts

UI Devs welcome to contribute.

NOTE :- TESTED ON UBUNTU 16.04 LTS AND HYPLEDGER FABRIC V1.1

Steps to Run:
1. Single Peer network

    a) Clone or download the repo.
    
    b) Stop and remove all running docker containers.
    
    c) Go to /fabric-tools in home directory, open the terminal and run ./startFabric.sh
    
    d) After the Fabric is running, type the ./createPeerAdminCard.sh command. This command will create a PeerAdmin@hlfv1 composer card.
    
    e)Open a new terminal in the directory of the downloaded repo  and type the following commands:
    
    `composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName aircraft-network`
    
    `composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile aircraft-network.bna --file networkadmin.card`
    
    `composer card import --file networkadmin.card`
    
    f) Start the Composer REST Server:
    
    `composer-rest-server` or `composer-rest-server aircraft-network -p 3030`
    
    g) Navigate to http://localhost:3030/explorer on your browser to find the exposed REST Service
    

2. Multi-Peer network

To be tested

This is the readme file for the Business Network Definition created in Playground

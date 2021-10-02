# **Coopilot**
A Helper tool built using the Coopilot Framework

You will need [**Docker** and **docker-compose**](https://www.docker.com) to build and run Coopilot using these instructions.

## Getting Coopilot
Clone the repository and submodules

    git clone --recurse-submodules https://github.com/ephedrandrox/coopilot.git  

 > The [dojo toolkit](https://dojotoolkit.org) is included as a submodule. If the `--recurse-submodules` 
 > flag is omitted durring cloning, you can run `git submodule update --init --recursive` in 
 > the root directory to download the dojo toolkit submodules.

## Building and Running Coopilot

_Enter commands in the repository root:_

### Build:
Will take a few minutes to complete

    docker-compose -f ./builds/coopilot/docker-compose.yml build

##Configure:
Coopilot needs a certificate and key placed in the `./builds/coopilot/conf/cert` directory

    ./builds/coopilot/conf/cert/cert.pem
    ./builds/coopilot/conf/cert/key.pem

### Run:
Start up the Coopilot containers in the background  

    docker-compose -f ./builds/coopilot/docker-compose.yml up -d

### Stop:
Stop the Coopilot containers  

    docker-compose -f ./builds/coopilot/docker-compose.yml down



## Accessing Coopilot  

Once the containers are up and running you can access your Coopilot instance by connecting through https at the host address. If set up on localhost then: [https://localhost/](https://localhost/)

To access the built/minified interface you can request the release directory. Localhost example [https://localhost/release/](https://localhost/release/)  This will load quicker, especially on slow devices.



## Certificates
### Webserver
You can place your own ssl certificates in the `builds/coopilot/conf/cert` directory and restart your containers to use them when connecting to the Interface.
### iOS 
To allow communication to iOS devices, self signed certificates and certificate authorities must be enabled on each device to be used. To get this working in a development environment, I followed [this guide](https://jaanus.com/ios-13-certificates/)




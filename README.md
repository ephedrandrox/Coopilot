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

### Run:
Start up the Coopilot containers in the background  

    docker-compose -f ./builds/coopilot/docker-compose.yml up -d

### Stop:
Stop the Coopilot containers  

    docker-compose -f ./builds/coopilot/docker-compose.yml down



## Accessing Coopilot  

Once the containers are up and running you can access your Coopilot instance through [https://localhost/](https://localhost/)

To access the built/minified interface you have to request [https://localhost/release/](https://localhost/release/)  

📝 _The release build will be improved in the future and this won't be the case._



## Modifying Coopilot
### SSL certificates
You can place your own ssl certificates in the `builds/coopilot/conf/cert` directory and restart your containers to use them.
### General Configuration
Modify [`builds/coopilot/conf/config.json`](builds/coopilot/conf/config.json) and restart containers.  
See the [`src/balek-server/etc/README.md`](src/balek-server/etc/README.md) for more info.


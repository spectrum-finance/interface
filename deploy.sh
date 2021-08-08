#!/bin/bash

echo "Start deploy"
ssh -tq root@144.76.60.105 '/bin/bash -l -c "source ~/.nvm/nvm.sh; cd /var/www/dev; git pull origin dev; yarn; yarn build;"'
echo "Deployed Successfully!"

exit 0


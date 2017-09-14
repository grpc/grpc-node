# Install NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

# Load NVM
source ~/.nvm/nvm.sh

node_versions=( 4 5 6 7 8 )

# TODO(mlumish): Add electron tests

# Install dependencies and link packages together
npm install
gulp setup

for version in ${node_versions[@]}
do
  nvm install $version
  # Rebuild libraries and run tests
  gulp native.test
done

#!/bin/bash

rsync -aivh --no-perms --delete /usr/src/app/storybook-static/ /mnt/seuso/seuso-ux/alcance-storybook/
echo Deploy realizado...
while sleep 1000; do :; done

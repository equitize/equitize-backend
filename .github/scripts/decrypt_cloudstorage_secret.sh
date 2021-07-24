#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$CLOUDSTORAGE_SECRET_PASSPHRASE" \
--output ./cloudStorage/keys.json ./cloudStorage/keys.json.gpg

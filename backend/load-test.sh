#!/bin/bash

max="1000"
date
START=$(date +%s)

request_cmd() {
    curl --location --request GET 'http://uwfind.us-east-2.elasticbeanstalk.com/graphql/' \
        --header 'Content-Type: application/json' \
        --data-raw '{"query":"query {\n lostItemPosts(filter: {}) {\n postId\n title\n categoryId {\n name\n categoryId\n }\n buildingId {\n name\n buildingId\n }\n date\n }\n}","variables":{}}'
}

while true; do
    sleep 1

    for i in $(seq 1 $max); do
        echo "Request #:" $i
        request_cmd
        echo ""
    done
done

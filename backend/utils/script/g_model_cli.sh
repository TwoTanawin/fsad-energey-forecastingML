#!/bin/bash

# Generate models with `bundle exec` to ensure the correct Rails environment is used
bundle exec rails generate model User userId:integer firstName:string lastName:string email:string password:string userImg:text
bundle exec rails generate model Login email:string password:string user:references
bundle exec rails generate model RegisterDevice registerDeviceID:integer address:string user:references
bundle exec rails generate model Device deviceID:integer isActive:boolean voltage:float power:float amp:float address:string electricPrice:float register_device:references user:references
bundle exec rails generate model MLPrediction mlID:integer voltage:float power:float amp:float address:string electricPrice:float device:references
bundle exec rails generate model Post postID:integer image:text content:string user:references
bundle exec rails generate model Comment commentID:integer content:string post:references user:references
bundle exec rails generate model Like likeID:integer isLiked:boolean post:references user:references
bundle exec rails generate model SavePost savePostID:integer post:references user:references

# Run all migrations
bundle exec rails db:migrate

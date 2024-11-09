#!/bin/bash

# Generate models with `bundle exec` to ensure the correct Rails environment is used
bundle exec rails generate model User firstName:string lastName:string email:string password:string userImg:text
bundle exec rails generate model Login email:string password:string user:references
bundle exec rails generate model RegisterDevice address:string token:string user:references
bundle exec rails generate model Device isActive:boolean voltage:float power:float current:float energy:float frequency:float PF:float electricPrice:float register_device:references user:references
bundle exec rails generate model MLPrediction voltage:float power:float current:float energy:float frequency:float PF:float electricPrice:float device:references
bundle exec rails generate model Post image:text content:text user:references
bundle exec rails generate model Comment content:text post:references user:references
bundle exec rails generate model Like isLiked:boolean post:references user:references
bundle exec rails generate model SavePost post:references user:references

# Run all migrations
bundle exec rails db:migrate

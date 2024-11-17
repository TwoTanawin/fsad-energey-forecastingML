curl -X POST http://localhost:3000/devices/data \
     -H "Authorization: Bearer 86a4e145aac7533c8f297c5cd236f2d5" \
     -H "Content-Type: application/json" \
     -d '{
           "device": {
             "isActive": true,
             "voltage": 400.5,
             "power": 1200.0,
             "current": 6.8,
             "energy": 102.3,
             "frequency": 50.0,
             "PF": 0.96,
             "electricPrice": 0.15
           }
         }'

curl -X POST http://localhost:3000/devices/data \
     -H "Authorization: Bearer d44a8b0cc770f2db409fbe6f7e5d20bb" \
     -H "Content-Type: application/json" \
     -d '{
           "device": {
             "isActive": true,
             "voltage": 400.5,
             "power": 1200.0,
             "current": 6.8,
             "energy": 102.3,
             "frequency": 50.0,
             "PF": 0.96,
             "electricPrice": 0.15
           }
         }'


# d44a8b0cc770f2db409fbe6f7e5d20bb
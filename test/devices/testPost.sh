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
     -H "Authorization: Bearer 426a55acdb5a16efea72ad1bdcbc37a3" \
     -H "Content-Type: application/json" \
     -d '{
           "device": {
             "isActive": true,
             "voltage": 1220.5,
             "power": 2222220.0,
             "current": 6.8,
             "energy": 102.3,
             "frequency": 50.0,
             "PF": 0.96,
             "electricPrice": 0.15
           }
         }'


# d44a8b0cc770f2db409fbe6f7e5d20bb

# 426a55acdb5a16efea72ad1bdcbc37a3

# f7370e83b38d57855c16dec42fc06330
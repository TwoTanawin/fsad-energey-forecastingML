curl -X POST http://localhost:3000/devices/data \
     -H "Authorization: Bearer 86a4e145aac7533c8f297c5cd236f2d5" \
     -H "Content-Type: application/json" \
     -d '{
           "device": {
             "isActive": true,
             "voltage": 220.5,
             "power": 1500.0,
             "current": 6.8,
             "energy": 102.3,
             "frequency": 50.0,
             "PF": 0.96,
             "electricPrice": 0.15
           }
         }'

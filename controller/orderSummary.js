const dbConnect = require('../connection');

const pipeline =  [
  {$group:
    {
      _id:{userId:"$userId", name:"$name"},
      totalBill:{$sum:"$current-bill"}, 
      totalPending:{$sum:"$amount-pending"},
      totalPaid:{$sum:"$amount-paid"},
      NumOrders:{$sum:1}
    }
  },
  {$project:
    { _id:1,
      NumOrders:1, 
      totalPaid:1, 
      totalBill: 1, 
      status: 
        {$cond:
          {if:
            {$gte:[0, {$subtract:["$totalBill","$totalPaid"]}]}, 
            then:"paid", 
            else:"pending"
           }
         },
        pending:
          {$cond:
            {if:
              {$lt:[0, {$subtract:["$totalBill","$totalPaid"]}]},
              then: {$subtract:["$totalBill","$totalPaid"]},
              else:"$$REMOVE"
            }
          
          }
      
      }
   }
]

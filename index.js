r = require('rethinkdb');
var moment = require('moment');
moment.locale('de');
function createNewOrder (ID, Contents, Company, Type, Priority) {
  var Order = function() {
  this.id = ID;
  this.Contents = Contents;
  this.Company = Company;
  this.Type = Type;
  this.Priority = Priority
  this.Time = moment().format('LT')
  this.Day = moment().format('LL')
  this.Fulfilled = false
  this.Status = "Received"
  // Future additions down below:

  }
  var neworder = new Order
  console.log(neworder)
  var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    r.table('orders').insert(neworder).run(connection, function(err, result) {
    if (err) throw err;
    //console.log(JSON.stringify(result, null, 2));
     console.log('Inserted')
        r.table('orders').
    filter(r.row("id").eq(ID)).
    update({Status: "Pending"}).
    run(connection, function(err, result) {
        if (err) throw err;
        // console.log(JSON.stringify(result, null, 2));
        console.log("Changed status to 'Pending'")
    });
    });
    console.log('')
    console.log('Successfully received order')
})
};
var testcontents = [{name: "Butter", amount: 2, type: "Food"}]
createNewOrder("00030", testcontents, "McBeauty", "Food", "0")
/*
Some statuses:
Added into System: Received
Inserted into database: Pending
*/

function fulfillOrder (ID) {
  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
      if (err) throw err;
      connection = conn;
          r.table('orders').
      filter(r.row("id").eq(ID)).
      update({Status: "In Delivery"}).
      run(connection, function(err, result) {
          if (err) throw err;
          // console.log(JSON.stringify(result, null, 2));
          console.log("Changed status to 'In Delivery'")
      });
      r.table('orders').
  filter(r.row("id").eq(ID)).
  update({Fulfilled: true}).
  run(connection, function(err, result) {
      if (err) throw err;
      // console.log(JSON.stringify(result, null, 2));
      console.log("Fulfilled order")
  });
      });
      console.log('')
      console.log('Successfully received order')
};
fulfillOrder("00020")

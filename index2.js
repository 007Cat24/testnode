r = require('rethinkdb');
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
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
createNewOrder("000000", testcontents, "McBeauty", "Food", "0")
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
};

function deliverOrder (ID) {
  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
      if (err) throw err;
      connection = conn;
          r.table('orders').
      filter(r.row("id").eq(ID)).
      update({Status: "Delivered"}).
      run(connection, function(err, result) {
          if (err) throw err;
          // console.log(JSON.stringify(result, null, 2));
          console.log("Changed status to 'Delivered'")
      });
      r.table('orders').
  filter(r.row("id").eq(ID)).
  update({Fulfilled: true}).
  run(connection, function(err, result) {
      if (err) throw err;
      // console.log(JSON.stringify(result, null, 2));
      console.log("Customer has received order")
  });
      });
      console.log('')
};
// setTimeout( function_reference, timeoutMillis );
//fulfillOrder("6666")
/* rl.question('Please scan the order to fulfill it: ', (answer) => {
  // TODO: Log the answer in a database
  fulfillOrder(answer)
  console.log(`Order ${answer} has been fulfilled.`);

  rl.close();
});

rl.question('Please scan the order to deliver it: ', (answer) => {
  // TODO: Log the answer in a database
  deliverOrder(answer)
  console.log(`Order ${answer} has been delivered.`);

  rl.close();
});
*/
rl.setPrompt('Scan the ID please: ');
rl.prompt();
rl.on('line', function(line) {
    if (line != "") {
      rl.question('Please choose between delivery (1) and shipping (2): ', (answer) => {
        if (answer == 1) {
        deliverOrder(line)
        console.log(`Order ${line} has been delivered.`);
      } else if (answer == 2) {
        fulfillOrder(line)
        console.log(`Order ${line} has been fulfilled.`);
      }
      });
    };
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});

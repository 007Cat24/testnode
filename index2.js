r = require('rethinkdb');
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var moment = require('moment');
moment.locale('de');
function createNewOrder (ID, Contents, Company, Type, Priority, Extra) {
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
  this.extraInformation = Extra;
  this.lastSeen = moment().format('LT')
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
//createNewOrder("000000", testcontents, "McBeauty", "Food", "0")
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
          if (result != null) {
          // console.log(JSON.stringify(result, null, 2));
          console.log("Changed status to 'In Delivery'")
        } else {
          console.log('Bestellung nicht gefunden')
        }
      });
      r.table('orders').
  filter(r.row("id").eq(ID)).
  update({Fulfilled: false}).
  run(connection, function(err, result) {
      if (err) throw err;
      // console.log(JSON.stringify(result, null, 2));
      if (result != null) {
      console.log("Order has been shipped")
    } else {
      console.log('')
    }
  });
  r.table('orders').
filter(r.row("id").eq(ID)).
update({lastSeen: moment().format('LT')}).
run(connection, function(err, result) {
  if (err) throw err;
  // console.log(JSON.stringify(result, null, 2));
});
      });
      console.log('')
};



function trackOrder (ID) {
  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
      if (err) throw err;
      connection = conn;
      r.table('orders').get(ID).
    run(connection, function(err, result) {
        if (err) throw err;
        if (result != null) {
        var received = String(result.Time)
        console.log('Die Bestellung sollte ' + moment().endOf('hour').fromNow() + ' ankommen. Wir haben sie um ' + received + ' erhalten (Rechne mit etwa 40 Minuten Lieferzeit).')
      //  console.log(JSON.stringify(result, null, 2));
    } else {
      //console.log('Diese Bestellung existiert nicht')
    }
    });
      });
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
  r.table('orders').
filter(r.row("id").eq(ID)).
update({lastSeen: moment().format('LT')}).
run(connection, function(err, result) {
  if (err) throw err;
  // console.log(JSON.stringify(result, null, 2));
  console.log("Fulfilled order")
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
      rl.question('Please choose between delivery (1), shipping (2), a new order (3) and tracking (4): ', (answer) => {
        if (answer == 1) {
        deliverOrder(line)
        console.log(`Order ${line} has been delivered.`);
      } else if (answer == 2) {
        fulfillOrder(line)
        console.log(`Order ${line} has been fulfilled.`);
      } else if (answer == 3) {
        console.log('Ok')
        rl.question('Enter the company: ', function (comp) {
          rl.question('Enter the priority: ', function (priority) {
            rl.question('Enter the type please: ', function (type) {
              rl.question('Enter the content(s) please: ', function (contents) {
              rl.question('Any extra information ? ', function (extra) {
            var testcontents = [{name: "Butter", amount: 2, type: "Food"}]
            console.log('Processing')
            createNewOrder(line, contents, comp, type, priority, extra)
          })
          })
        })
      })
    })
    } else if (answer == 4)
     console.log('Tracking...')
     trackOrder(line)
      });
    };
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});

var mongo = require('mongodb').MongoClient,

		//wait the client to connect
		client = require('socket.io').listen(8090).sockets;


 mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
 		if(err) throw err;

 		client.on('connection',function(socket){

 			var col = db.collection('messages'),

 				//create sendStatus funciton and s is string as a argument
 				sendStatus = function(s){

 					socket.emit('status',s);
 				};


 			//Emit all messages,,,_id is property, sort reverse order
 			col.find().limit(100).sort({_id:1}).toArray(function(err, res){
 					if(err) throw err;
 					socket.emit('output',res);
 			});

 			//wait for input
 			socket.on('input', function(data){

 					var name = data.name,
 							message = data.message;
              
              whitespacePatten = /^\s*$/;


              if(whitespacePatten.test(name)|| whitespacePatten.test(message)){

              	sendStatus('Name and message is require.')
              }else{

              	col.insert({name:name, message : message}, function(){

              		//call sendStatus function
 									sendStatus({

 										message:"Message sent",
 										clear: true
 									});
 							});

              }

 							

 			});
	  

		});


 });

console.log('worked');
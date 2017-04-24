var mongo = require('mongodb').MongoClient,

  //wait the client to connect server
  client = require('socket.io').listen(8090).sockets;

 mongo.connect('mongodb://127.0.0.1/chat',function(err,db){

  if(err) throw err;

  client.on('connection',function(socket){

    var col = db.collection('messages'),

    sendStatus = function(s){

      socket.emit('status',s);

    };

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

           //emit latest message to all cilents
           client.emit('output',[data]);

 	    sendStatus({

             message:"Message sent",
 	      clear: true
 	    
           });
 	
       });

     }

   });

  });
  
});

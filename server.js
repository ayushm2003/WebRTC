//require our websocket library 
var WebSocketServer = require('ws').Server; 

//creating a websocket server at port 9090 
var wss = new WebSocketServer({port: 9090}); 
 
// all users connected to server
var users = {};

//when a user connects to our sever 
wss.on('connection', function(connection) { 
    //console.log(connection)
   console.log("user connected");
	
   //when server gets a message from a connected user 
   connection.on('message', function(message){ 
       var data;

       try {
           data = JSON.parse(message);
       }
       catch (e) {
            console.log("Invalid JSON");
            data = {};
       }
      console.log("Got message from a user:", message); 


      switch (data.type) {
        case "login":
            console.log("User logged:", data.name)
    
            //if (users[data.name]) {
            if (data.name in users) {
                sendTo(connection, {
                    type: "login",
                    success: false
                });
            }
            else {
                users[data.name] = connection;
                connection.name = data.name
    
                sendTo(connection, {
                    type: "login",
                    success: true
                });
                console.log(users)
            }
    
        break;

        case "offer":
            console.log("Sending offer to: ", data.name); 
            if (users[data.name]) {
                sendTo(users[data.name], {
                    type: "offer",
                    offer: data.offer,
                    name: connection.name
                })
            }

        break;
        
        case "answer":
            console.log("Sending answer to: ", data.name);
            
            var conn = users[data.name];
            
            if (conn != null) {
                connection.othername = data.name;

                sendTo(users[data.name], {
                    type: "answer",
                    answer: data.answer
                })
            }
    
        break;
        
        case "candidate": 
            console.log("Sending candidate to:",data.name); 
            var conn = users[data.name]; 
	
            if(conn != null) {
                sendTo(conn, { 
                type: "candidate", 
                candidate: data.candidate 
                }); 
            }
        
        break;

        case "leave":
            console.log("Disconnecting from: ", users[data.name])

            var conn = users[data.name]  //connection info of the peer you want to disconnect with

            //remove the messaging peer for the the peer the messenger wants to disconnect with.
            conn.othername = null

            if (conn != null) {
                sendTo(conn, {
                    type: "leave"
                })
            }
        
        break;

        default:
            sendTo(connection, {
                type: "error",
                message: "Command not found: " + data.type
            })
    
    }
   });
   
   connection.on("close", function() { 
    if(connection.name) { 
       delete users[connection.name];
       console.log(users)
    }

    if (connection.othername) {
        console.log("Disconnecting from: ", connection.othername)
        var conn = users[connection.otherName]; 
        conn = null

        if (conn != null) {
            sendTo(conn, {
                type: "leave"
            });
        }
    }
 });

    connection.send("Hello from server");
});


function sendTo(connection, message) { 
    connection.send(JSON.stringify(message)); 
}

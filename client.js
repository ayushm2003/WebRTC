//var connection = new WebSocket({port: 9090}); 
const connection = new WebSocket("ws://localhost:9090/");
var name0 = "";

var loginInput = document.querySelector('#loginInput'); 
var loginBtn = document.querySelector('#loginBtn'); 
var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
var connectedUser, myConnection;

loginBtn.addEventListener("click", function(event) {
    name0 = loginInput.value;

    if (name0.length > 0) {
        send({
            type: "login",
            name: name0,            
        })
    }
})

connectToOtherUsernameBtn.addEventListener("click", function(event) {
    userToConnectTo = otherUsernameInput.value;
    console.log(userToConnectTo)

    if (userToConnectTo.length > 0) {
        send({
            name: userToConnectTo,
            type: "offer",
            offer: "I see you made it"
        })
    }
})

connection.onmessage = function (message) { 
    console.log("Got message", message.data);
    var data = JSON.parse(message.data); 
     
    switch(data.type) { 
       case "login": 
          onLogin(data.success); 
          break; 
       case "offer":
          onOffer(data.offer, data.name); 
          break; 
       case "answer": 
          onAnswer(data.answer); 
          break; 
       case "candidate": 
          onCandidate(data.candidate); 
          break; 
       default: 
          break; 
    } 
 };


 function onLogin(success) { 

    if (success === false) { 
       alert("oops...try a different username"); 
    } else { 
       //creating our RTCPeerConnection object 
         
       var configuration = { 
          "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
       };
         
       myConnection = new webkitRTCPeerConnection(configuration); 
       console.log("RTCPeerConnection object was created"); 
       console.log(myConnection); 
   
       //setup ice handling
       //when the browser finds an ice candidate we send it to another peer 
       myConnection.onicecandidate = function (event) { 
         
          if (event.candidate) { 
             send({ 
                type: "candidate", 
                candidate: event.candidate 
             }); 
          } 
       }; 
    } 
 };

connection.onopen = function () {
    console.log("Connected")
};

connection.onerror = function(e) {
    console.log("Error", e)
}

function send(message) { 

    if (connectedUser) { 
       message.name = connectedUser; 
    } 
     
    connection.send(JSON.stringify(message)); 
};
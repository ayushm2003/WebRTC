const constraints = {
	'video': false,
	'audio': true
}
let stream;
navigator.mediaDevices.getUserMedia(constraints)
	.then(s => {
		console.log('Got MediaStream:', s);
		const audioElement = document.querySelector("audio")
		audioElement.srcObject = s
		stream = s
	})
	.catch(error => {
		console.error('Error accessing media devices.', error)
	})

	btnGetAudioTracks.addEventListener("click", function(){ 
		console.log("getAudioTracks"); 
		console.log(stream.getAudioTracks()); 
	 });
	   
	 btnGetTrackById.addEventListener("click", function(){ 
		console.log("getTrackById"); 
		console.log(stream.getTrackById(stream.getAudioTracks()[0].id)); 
	 });
	   
	 btnGetTracks.addEventListener("click", function(){ 
		console.log("getTracks()"); 
		console.log(stream.getTracks()); 
	 });
	 btnRemoveAudioTrack.addEventListener("click", function(){ 
		console.log("removeAudioTrack()"); 
		stream.removeTrack(stream.getAudioTracks()[0]); 
	 });
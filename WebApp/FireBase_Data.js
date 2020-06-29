const Database = firebase.database();
const ref1 = Database.ref('/Right/Pitch/Pitch')

ref1.on('value', gotData);

 function gotData(data){
    var pitch = data.val();
    //document.write(pitch);
    console.log(pitch);
}

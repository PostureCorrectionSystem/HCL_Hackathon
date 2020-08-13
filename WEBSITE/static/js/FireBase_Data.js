const Database = firebase.database();
const ref1 = Database.ref('/Right/Pitch/Pitch')

ref1.on('value', gotData);

 function gotData(data){
    var pitch = data.val();
    console.log(pitch);
    //var element=document.createElement("div");
    //document.getElementsByTagName("body")[0].appendChild(element);
    //element.innerHTML+=pitch
}

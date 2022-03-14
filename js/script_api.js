
function getInputValue(){
    var inputVal = document.getElementById("myInput").value;
    inputVal = 'Su codigo es '+inputVal;
    alert(inputVal);
}

function httpGetList(theUrl){
    var xmlHttp = new XMLHttpRequest();
    console.log(theUrl)
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function validateCode(){
    var code = document.getElementById("Code").value;
    event = null;
    if( code.includes('-')){
        var event_code=code.split('-')[0]
        var invite_code=code.split('-')[1]
        var event = httpGetList("https://taxidriver-38912-default-rtdb.firebaseio.com/"+event_code+"/"+invite_code+".json");
    }

    console.log(code)
	if (event != null){
	    window.location.replace("./testing.html?ID="+code);
	}
	else{
        alert('El código ' + code + ' no es válido');
	}
}
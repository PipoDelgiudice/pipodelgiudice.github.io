
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

function analitics_post(){
    //https://www.taringa.net/+taringa_at_night/los-chorizos-invadieron-t_51de97
    var code = document.getElementById("Code").value;
    if (code.split('_').length > 1){
        var id = code.split('_')[(code.split('_').length) - 1]
        if (id.split('/?').length > 1){
            id = id.split('/?')[0]
        }
    }
    else{
        var id = code
    }
    var event = httpGetList("https://beta.taringa.net/api/story/"+id+"/voters/down");
	if (event != null){
        var Info = httpGetList("https://beta.taringa.net/api/story/"+id+"/voters/down");
        console.log(Info.items);
        var lista = ''

        lista += '<br><br><li class="list-group-item list-group-item-danger">'+'Negativos'+'</li>';

        if(Info.items.length > 0){
            console.log(Info.items.length)
            //if(List.Invitados.length>0){
            for (x of Info.items) {
              console.log(x.username);
              if (x != null){
              lista += '<li class="list-group-item">'+'<a href="https://www.taringa.net/'+x.username+'"> '+x.username+'</a>'+'</li>';
              }
            }
        }
        else{
              lista += '<li class="list-group-item">No hay negativos</li>';
        }
        document.getElementById("Lista").innerHTML = lista;
        var Info = httpGetList("https://beta.taringa.net/api/story/"+id+"/voters/up");
        console.log(Info.items);
        var lista = ''

        lista += '<li class="list-group-item list-group-item-info">'+'Positivos'+'</li>';

        if(Info.items.length > 0){
            console.log(Info.items.length)
            //if(List.Invitados.length>0){
            for (x of Info.items) {
              console.log(x.username);
              if (x != null){
              lista += '<li class="list-group-item">'+'<a href="https://www.taringa.net/'+x.username+'"> '+x.username+'</a>'+'</li>';
              }
            }
        }
        else{
              lista += '<li class="list-group-item">No hay positivos</li>';
        }
        document.getElementById("Lista-positivos").innerHTML = lista;
   }

    //inputVal = 'Su codigo es '+id;
    //alert(inputVal);

}



function text_process(){
   texto = document.getElementById("exampleFormControlTextarea1").value
   lista_variables = texto.split('{')
   const variables = []
   if (lista_variables.length > 1){

        var formulario = ''

        for (each of lista_variables){
            if (each.indexOf('}') > 0){
                variables.push(each.split('}')[0])
                variable = each.split('}')[0]
                formulario += '<div class="form-group"><label for="'+variable+'"'+variable+'</label><input type="text" class="form-control" id="'+variable+'" placeholder="'+variable+'"></div>'
            }
        }
        document.getElementById("Formulario").innerHTML = formulario;
   }
   else{
        alert("El texto contiene un error que no se puede procesar");

   }
}

function text_result(){
   texto = document.getElementById("exampleFormControlTextarea1").value
   input = document.getElementById("Formulario")
   var text_mod = texto.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
   if (input.length > 0){
       for(each of input){
           text_mod = text_mod.replace('{'+each.id+'}',each.value)
           console.log(each.id, each.value)
       }

       document.getElementById("result").innerHTML = text_mod;
   }
}
 function tformat(str, dict) {
    return str.replace(/\${(\w+)}/g, function(_,m) {
    return dict[m];
    });
}


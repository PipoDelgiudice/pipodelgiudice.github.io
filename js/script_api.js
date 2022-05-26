
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
        else if(id.split('?').length > 1){
            id = id.split('?')[0]
        }
    }
    else{
        var id = code
    }
    var Info = httpGetList("https://beta.taringa.net/api/story/"+id+"/voters/down?count=999");
	if (Info != null){
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
        var Info = httpGetList("https://beta.taringa.net/api/story/"+id+"/voters/up?count=999");
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


        var Info = httpGetList("https://beta.taringa.net/api/story/"+id);
        console.log(Info);

        positivos = Info.upvotes
        negativos = Info.downvotes
        favoritos = Info.bookmarks
        shared = Info.shares
        comentarios = Info.comments
        visitas = Info.visits

    	document.getElementById("stats").innerHTML ='<div class="container"><div class="rounded shadow p-5 bg-white"><div class="row"><div class="col-lg-4 col-md-6 mt-5 mt-md-0 text-center" id="stats_pos"></div><div class="col-lg-4 col-md-6 mt-5 mt-md-0 text-center" id="stats_neg"></div><div class="col-lg-4 col-md-6 mt-5 mt-md-0 text-center" id="stats_fav"></div><div class="col-lg-4 col-md-6 mt-5 mt-md-0 text-center" id="stats_share"></div><div class="col-lg-4 col-md-12 mt-5 mt-lg-0 text-center" id="stats_com"></div><div class="col-lg-4 col-md-12 mt-5 mt-lg-0 text-center" id="stats_visit"></div>'
        var stats_pos = '<i class="ti-arrow-up text-primary h1"></i><h3 class="mt-4 text-capitalize h5 ">Positivos</h3><p class="regular text-muted">A '+positivos+' taringueros le gusto el post.</p>'
        document.getElementById("stats_pos").innerHTML = stats_pos;

        var stats_neg ='<i class="ti-arrow-down text-primary h1"></i><h3 class="mt-4 text-capitalize h5 ">Negativos</h3><p class="regular text-muted">'+negativos+' taringueros odiaron el post.</p>'
        document.getElementById("stats_neg").innerHTML = stats_neg;

        var stats_fav = '<i class="ti-star text-primary h1"></i><h3 class="mt-4 text-capitalize h5 ">Favoritos</h3><p class="regular text-muted">'+favoritos+' taringueros lo guardaron en favoritos.</p>'
        document.getElementById("stats_fav").innerHTML = stats_fav;

        var stats_share = '<i class="ti-share text-primary h1"></i><h3 class="mt-4 text-capitalize h5 ">Recomendados</h3><p class="regular text-muted"> '+shared+' taringueros compartieron el post.</p>'
        document.getElementById("stats_share").innerHTML = stats_share;

        var stats_com = '<i class="ti-comments text-primary h1"></i><h3 class="mt-4 text-capitalize h5 ">Comentarios</h3><p class="regular text-muted">'+comentarios+' taringueros comentaron el post.</p>'
        document.getElementById("stats_com").innerHTML = stats_com;

        var stats_visit = '<i class="ti-bar-chart text-primary h1"></i><h3 class="mt-4 text-capitalize h5 ">Visitas</h3><p class="regular text-muted">'+visitas+' taringueros vieron el post.</p>'
        document.getElementById("stats_visit").innerHTML = stats_visit;
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
                if( !variables.includes(each.split('}')[0])){
                    variable = each.split('}')[0]
                    formulario += '<div class="form-group"><label for="'+variable+'"'+variable+'</label><input type="text" class="form-control" id="'+variable+'" placeholder="'+variable+'"></div>'
                }
                variables.push(each.split('}')[0])
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
           while(text_mod.indexOf('{'+each.id+'}') > 0){
            text_mod = text_mod.replace('{'+each.id+'}',each.value)
            console.log(each.id, each.value)
           }
       }

       document.getElementById("result").innerHTML = text_mod;
   }
}
function tformat(str, dict) {
    return str.replace(/\${(\w+)}/g, function(_,m) {
    return dict[m];
    });
}

function generar_oid(){
   var texto = document.getElementById("exampleFormControlTextarea1").value;
   var new_text = texto.replace(/(\t)/g,',').split('\n')
   console.log(new_text);
   if (new_text.length > 0){
       text_mod = ''
       text_raw = ''
       for(each of new_text){
            var data = each.split(',')
            if (data.length >= 5){
                text_mod += '<br><br>'+data[0] +"= SNMPModelObject(name='"+data[1]+"',oid='"+data[2]+"',type='"+data[3]+"',instanceOf='"+data[4]+"')"
                text_raw += '\r\n\r\n'+data[0] +"= SNMPModelObject(name='"+data[1]+"',oid='"+data[2]+"',type='"+data[3]+"',instanceOf='"+data[4]+"')"
            }
       }
       document.getElementById("result").innerHTML = text_mod;
       navigator.clipboard.writeText(text_raw).then(function() {
          console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
          console.error('Async: Could not copy text: ', err);
        });
   }
}


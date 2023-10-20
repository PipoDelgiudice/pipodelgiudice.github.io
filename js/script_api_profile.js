function httpGetList(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}
function getUserById(users, username) {
    return users.find(user => user.user == username);
}
function updateUser(user, username) {
    var usuarios = getUserById(user,username)
    if(usuarios){
        var index = user.indexOf(usuarios)

        console.log(index);
        user[index].value += 1;
    }
    else{
        var dict = {
            value: 1,
            user: username
        }
        user.push(dict)
    }
    return user
}

function analitics_profile(){
    var username_input = document.getElementById("Code").value;

    var User = httpGetList("https://api-user.taringa.net/user/username/"+username_input);
	if (!User.error){
	    var negativos = []
	    id_user = User.id
	    username = User.username
	    created = User.created
        firstname_user = User.firstname
        birthday_user = User.birthday

        var text_debug = 'El usuario '+ username + ' tiene el id:' + id_user + ' fue creado el dia '+created+'</br> cumpleaños el dia '+ birthday_user

        document.getElementById("debug").innerHTML = text_debug;
        console.log(User);

        url_posts = "https://api-user.taringa.net/user/"+username+"/feed?count=20&withTips=true&filter=article&sharedBy=true"
        var Posts = httpGetList(url_posts);
        if (!Posts.error){
            console.log(Posts.items)
            for (var post of Posts.items) {
              console.log("nombre: " + post.title);
              console.log("id: " + post.id);
              console.log("nombre: " + post.upvotes);


              url_down='https://beta.taringa.net/api/story/'+post.id+'/voters/down?count=999'
              var stats_post = httpGetList(url_down);
              if (!stats_post.error){
                console.log(stats_post)
                for (var vote of stats_post.items) {
                    negativos = updateUser(negativos, vote.username)
                }

              }
            }

            console.log(negativos)
            negativos.sort(function (a, b) {
                return a.value!=b.value ? (a.value < b.value ? 1 : -1) : 0;
            });

            console.log(negativos)
            negativos_filtered = []
            for (var neg of negativos) {
                if( neg.value >= 0){
                    negativos_filtered.push(neg)
                }
            }
            console.log(negativos_filtered)

            negativos = negativos_filtered
            var lista = '<br><br><li class="list-group-item list-group-item-danger">'+'Negativos'+'</li>';


            if(negativos.length > 0){

                for (x of negativos) {
                  console.log(x.username);
                  if (x != null){
                  //lista += '<li class="list-group-item">'+'<a href="https://www.taringa.net/'+x.user+'"> '+x.user+'</a>'+'</li>';
                  //lista += ' <tr><td class="">'+'<a href="https://www.taringa.net/'+x.user+'"> '+x.user+'</a>'+'</td><td>'+x.value+'</td> </tr>';
                  lista += '<li class="list-group-item">'+'<a href="https://www.taringa.net/'+x.user+'"> '+x.user+'</a>'+' Con '+x.value+' negativos.</li>';

                  }
                }
            }
            else{
                  //lista += ' <tr><td class="">Sin negativos</td><td>0</td> </tr>';
                  lista += '<li class="list-group-item">No hay negativos</li>';
            }
            document.getElementById("Lista").innerHTML = lista;

        }
    }
    else{
        inputVal = 'No encontramos el usuarioa '+ username_input;
        console.log(inputVal);
        alert(inputVal);
    }


}



function analitics_home(){
    var url_home = 'https://api-user.taringa.net/feed/list/globalHome?count=20&filter=article&sort=created-desc&page=0&globalSafe=true&nsfw=false&withTips=true'

}
function analitics_channel(){
    var url_channel = 'https://api-user.taringa.net/c/taringa_at_night/feed?count=20&filter=article&sort=bigbang1d&withTips=true'
}

function analitics_list_post(channel){

        url_posts = "https://api-user.taringa.net/c/"+channel+"/feed?count=50&filter=article&sort=created-desc&withTips=true"
        var Posts = httpGetList(url_posts);
        console.log(Posts)
        if (!Posts.error){
	        var negativos = []
            console.log(Posts.items)
            for (var post of Posts.items) {
              console.log("nombre: " + post.title);
              console.log("id: " + post.id);
              console.log("nombre: " + post.upvotes);


              url_down='https://beta.taringa.net/api/story/'+post.id+'/voters/down?count=999'
              var stats_post = httpGetList(url_down);
              if (!stats_post.error){
                console.log(stats_post)
                for (var vote of stats_post.items) {
                    negativos = updateUser(negativos, vote.username)
                }

              }
            }

            console.log(negativos)
            negativos.sort(function (a, b) {
                return a.value!=b.value ? (a.value < b.value ? 1 : -1) : 0;
            });

            console.log(negativos)
            negativos_filtered = []
            for (var neg of negativos) {
                if( neg.value >= 0){
                    negativos_filtered.push(neg)
                }
            }
            console.log(negativos_filtered)

            negativos = negativos_filtered
            var lista = '<tr><th>User</th><th>Negativos</th></tr>';

            if(negativos.length > 0){

                for (x of negativos) {
                  console.log(x.username);
                  if (x != null){
                  //lista += '<li class="list-group-item">'+'<a href="https://www.taringa.net/'+x.user+'"> '+x.user+'</a>'+'</li>';
                  lista += ' <tr><td class="">'+'<a href="https://www.taringa.net/'+x.user+'"> '+x.user+'</a>'+'</td><td>'+x.value+'</td> </tr>';
                  }
                }
            }
            else{
                  lista += ' <tr><td class="">Sin negativos</td><td>0</td> </tr>';
            }
            document.getElementById("Lista").innerHTML = lista;
        }


}





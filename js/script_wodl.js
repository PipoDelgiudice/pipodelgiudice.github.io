var letters = 0;
var letters_ok = [];
var list_words = ['pipo', 'test'];

var letters_3 = ['DAO', 'EIF', 'WEI', 'GAS', 'SBT']
var letters_4 =['VOTE', 'DAPP', 'NODE', 'DATA', 'SAFE', 'GWEI', 'BURN']
var letters_5 = ['BRIDE', 'POWER', 'LAYER', 'ETHER', 'SHIFT', 'SHARD']
var letters_6 = ['WALLET', 'REWARD', 'UPDATE', 'SERVER', 'ROLLUP', 'IMPACT', 'STABLE', 'CARBON']
var letters_7 = ['APPROVE', 'ROADMAP', 'UPGRADE', 'TESTING', 'SOCIETY', 'MONITOR']
var letters_8 = ['PROPOSAL', 'CONTRACT', 'SOLUTION', 'DESTRESS', 'VALIDATE', 'SECURITY']


var posible_words = [];
var imposible_words = [];
const selectElement = document.getElementById('selector_cant');
var Info = httpGetList("https://raw.githubusercontent.com/PipoDelgiudice/pipodelgiudice.github.io/create_project/data/words.json");
if (Info != null){
  console.log(Info.words);
}
selectElement.addEventListener('change', (event) => {
const result = document.getElementById('result');
 result.textContent = 'seleccionaste  ${event.target.value}';

  letters = event.target.value;

  switch(letters){
    case '3':
      //list_words = letters_3;
      list_words = Info.words.letters_3;
      break;
    case '4':
      //list_words = letters_4;
      list_words = Info.words.letters_4;
      break;
    case '5':
      //list_words = letters_5;
      list_words = Info.words.letters_5;
      break;
    case '6':
      //list_words = letters_6;
      list_words = Info.words.letters_6;
      break;
    case '7':
      //list_words = letters_7;
      list_words = Info.words.letters_7;
      break;
    case '8':
      //list_words = letters_8;
      list_words = Info.words.letters_8;
      break;
  }

  res = '<div class="grid-cards">'
  letters_ok = [];
  for(var i=1;  i<= event.target.value; i++){
    res += '<div class="card"> <div class="column"><input class="grid-letters" id="input_'+i+'" type="text" maxlength="1" onchange="myFunction(this.value)"><div><input type="checkbox" id="check_'+i+'" onchange="myFunction(this)">   <p>Correcta</p> </input></div></div></div>';
    letters_ok.push('');
  }
  res += '</div>';

  for( var j=0; j< list_words.length; j++ ){
    console.log(list_words[j]);
  }
  posible_words = list_words;
  document.getElementById("result").innerHTML = res;
  document.getElementById("words").innerHTML = '<h3>'+posible_words+'</h3>';
});

function myFunction(val) {
  var texto = 'text ';
  posible_words = [];
  imposible_words = [];

  var empty = true;
  for(var i=1;  i<= letters; i++){
    var value_input = document.getElementById('input_'+i).value.toUpperCase();
    if( value_input == null || value_input == '' ){
      texto += '_';
    }
    else{
      texto += document.getElementById('input_'+i).value.toUpperCase();
      empty = false;
    }
    console.log(texto);

    for( var j=0; j< list_words.length; j++ ){
      if(value_input != '' ){
        const removeStr = value_input //variable
        const regex =  new RegExp(removeStr,'g'); // correct way
        if(regex.test(list_words[j])){
          console.log('sabes que coincide con ' + list_words[j] );
          if(document.getElementById('check_'+i).checked){
            console.log('letra '+ i +' en string '+ list_words[j][i-1] + ' '+ list_words[j]);
            letters_ok[i-1] = value_input;
            if(list_words[j][i-1] == value_input){
              posible_words = add_array(posible_words, list_words[j])
            }
            else{
              posible_words = remove_array(posible_words, list_words[j]);
              imposible_words = add_array(imposible_words, list_words[j]);
            }

          }
          else{
            letters_ok[i-1] = '';
            posible_words = add_array(posible_words, list_words[j])
          }

        }
        else{
          console.log('No coincide con '+ list_words[j]);
          posible_words = remove_array(posible_words, list_words[j]);
          imposible_words = add_array(imposible_words, list_words[j]);
        }

      }

    }

  }
  for(var k=0; k<= imposible_words.length; k++ ){
    posible_words = remove_array(posible_words, imposible_words[k]);
  }


  if(empty) {
    posible_words = list_words;
  }
  console.log(posible_words);

  document.getElementById("words").innerHTML = '<h3>'+posible_words+'</h3>';

}


function remove_array(array, element){
  const index = array.indexOf(element);
  if (index > -1) { // only splice array when item is found
    array.splice(index, 1); // 2nd parameter means remove one item only
  }
  return array;
}

function add_array(array, element){
  const index = array.indexOf(element);
  if (index == -1) { // only splice array when item is found
    array.push(element); // 2nd parameter means remove one item only
  }
  return array;
}


function httpGetList(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}
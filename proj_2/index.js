var api_url = "http://pascal.fis.agh.edu.pl:1036"
var request;
var objJSON;
var id_mongo;
function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}
  
// Lista rekordow w bazie
function _list() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4){
         objJSON = JSON.parse(request.response);
         var txt = "";
         for ( var id in objJSON )  {
             txt +=  id+": {" ;
             for ( var prop in objJSON[id] ) {
                 txt += prop+":"+objJSON[id][prop]+",";
             }
             txt +="}<br/>";
         }
         document.getElementById('result').innerHTML = txt;
      }
   }
   request.open("GET", api_url +"/list", true);
   request.send(null);
}
  
// Wstawianie rekordow do bazy
function _ins_form() {
   var form1 = "<form name='add'><table>" ;
   form1    += "<tr><td>Imię</td><td><input type='text' name='fname' value='Imię' ></input></td></tr>";

   form1    += "<tr><td>Płeć</td><td><select name='sex'>";
   form1    += "<option value='mężczyzna' selected>mężczyzna</option>" 
   form1    += "<option value='kobieta'>kobieta</option>" 
   form1    += "</select></td></tr>"

   form1    += "<tr><td>Samopoczucie</td><td><select name='comfort'>";
   form1    += "<option value='1' selected>1</option>" 
   form1    += "<option value='2'>2</option>" 
   form1    += "<option value='3'>3</option>" 
   form1    += "<option value='4'>4</option>" 
   form1    += "<option value='5'>5</option>" 
   form1    += "<option value='6'>6</option>" 
   form1    += "<option value='7'>7</option>" 
   form1    += "<option value='8'>8</option>" 
   form1    += "<option value='9'>9</option>" 
   form1    += "<option value='10'>10</option>" 
   form1    += "</select></td></tr>"  

   form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='_insert(this.form)' ></input></td></tr>";
   form1    += "</table></form>";
   document.getElementById('data').innerHTML = form1;
   document.getElementById('result').innerHTML = ''; 
}
  
function _insert(form)  {
    var user = {};
    user.fname = form.fname.value;
    user.sex = form.sex.value;
    user.comfort = form.comfort.value;
    txt = JSON.stringify(user);
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4 && request.status == 200 )    {
          document.getElementById('result').innerHTML = request.response;
       }
    }
    request.open("POST", api_url + "/add", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(txt);
}
  
// Usuwanie rekordow z bazy danych
function _del_list() {
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4) { 
          objJSON = JSON.parse(request.response);
          var txt = "<form  name='data'><select class='check' name='del' size='10'>";
          for ( var id in objJSON ) {
              txt +=  "<option value="+objJSON[id]["_id"]+" >"+id+": {" ;
              for ( var prop in objJSON[id] ) {
                  txt += prop+":"+objJSON[id][prop]+",";
              }
              txt +="}</option>";
          }
          txt += "</select><br/><input type='button' value='usun' onclick='_delete(this.form)'/></form>";
          document.getElementById('data').innerHTML = txt;
       }
    }
    request.open("GET", api_url + "/list", true);
    request.send(null);
}
  
function _delete(form) {
    var rec = form.del.selectedIndex;
    var id = document.getElementsByTagName('option')[rec].value;
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4 )    {
           document.getElementById('result').innerHTML = request.response;
       }
    }
    request.open("DELETE", api_url + "/delete/"+id, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(null);
}
  
// Poprawa rekordow w bazie danych
function _upd_list() {
       document.getElementById('result').innerHTML = ''; 
       document.getElementById('data').innerHTML = '';  
       request = getRequestObject() ;
       request.onreadystatechange = function() {
         if (request.readyState == 4)    { 
           objJSON = JSON.parse(request.response);
           var txt = "<form  name='data'><select class='check' name='upd' size='10'>";
           for ( var id in objJSON )  {
              txt +=  "<option value="+objJSON[id]["_id"]+" >"+id+": {" ;
              for ( var prop in objJSON[id] ) {
                  txt += prop+":"+objJSON[id][prop]+",";
              }
              txt +="}</option>";
           }
           txt += "</select><br/><input type='button' value='popraw' onclick='_upd_form(this.form)'/></form>";
          document.getElementById('data').innerHTML = txt;
          }
       }
       request.open("GET", api_url + "/list", true);
       request.send(null);
  }
  
  
  
  
function _upd_form(form) {
    var rec = form.upd.selectedIndex;
    idmongo = document.getElementsByTagName('option')[rec].value;
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
  var form1 = "<form name='upd'><table>" ;

  form1    += "<tr><td>Imię</td><td><input type='text' name='fname' value='Imię' ></input></td></tr>";

  form1    += "<tr><td>Płeć</td><td><select name='sex'>";
  form1    += "<option value='mężczyzna' selected>mężczyzna</option>" 
  form1    += "<option value='kobieta'>kobieta</option>" 
  form1    += "</select></td></tr>"

  form1    += "<tr><td>Samopoczucie</td><td><select name='comfort'>";
  form1    += "<option value='1' selected>1</option>" 
  form1    += "<option value='2'>2</option>" 
  form1    += "<option value='3'>3</option>" 
  form1    += "<option value='4'>4</option>" 
  form1    += "<option value='5'>5</option>" 
  form1    += "<option value='6'>6</option>" 
  form1    += "<option value='7'>7</option>" 
  form1    += "<option value='8'>8</option>" 
  form1    += "<option value='9'>9</option>" 
  form1    += "<option value='10'>10</option>" 
  form1    += "</select></td></tr>"   
  
  form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='_update(this.form, \"" + idmongo + "\")' ></input></td></tr>";
  form1    += "</table></form>";
  document.getElementById('data').innerHTML = form1;
  document.getElementById('result').innerHTML = ''; 
}
  
function _update(form, idmongo) {
    var user = {};
    user.fname = form.fname.value;
    user.sex = form.sex.value;
    user.comfort = form.comfort.value;

    txt = JSON.stringify(user);
    console.log(txt)
    console.log(idmongo)
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
         if (request.readyState == 4 && request.status == 200 )    {
            document.getElementById('result').innerHTML = request.response;
          }
    }
    request.open("PUT", api_url + "/update/"+idmongo, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(txt);
}
var api_url = "http://pascal.fis.agh.edu.pl:1036"
var request;
var objJSON;
var id_mongo;
const dbName = "ML_indexed_DB"

function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}

function clear() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';  
   document.getElementById('myCanvas').innerHTML = '';
}

function show_row_tab(row) {
   var txt = "<tr>";
   for ( var prop in row  ) {
      if (prop != "_id"){
         txt += "<td>" + row[prop]+" </td>";
      }
   }
   txt += "</tr>";
   return txt;
}

function show_row(row) {
   var txt = "";
   for ( var prop in row  ) {
      if (prop != "_id"){
         txt +=row[prop]+" ";
      }
   }
   return txt;
}
  
// Lista rekordow w bazie
function _list() {
   clear() 
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4){
         objJSON = JSON.parse(request.response);
         var txt = "<table><thead>";
         txt += "<th>Imię</th><th>Płeć</th><th>Poziom komfortu</th>";
         txt += "</thead><tbody>";
         for ( var id in objJSON )  {
            txt += show_row_tab(objJSON[id]);
         }
         txt += "</tbody></table>"
         document.getElementById('result').innerHTML = txt;
      }
   }
   request.open("GET", api_url +"/list", true);
   request.send(null);
}
  
// Wstawianie rekordow do bazy
function _ins_form() {
   clear();
   var form1 = "<form name='add'><table>" ;
   form1    += "<tr><td>Imię</td><td><input type='text' name='fname' value='Imię' ></input></td></tr>";

   form1    += "<tr><td>Płeć</td><td><select name='sex'>";
   form1    += "<option value='mężczyzna' selected>mężczyzna</option>" 
   form1    += "<option value='kobieta'>kobieta</option>" 
   form1    += "</select></td></tr>"

   form1    += "<tr><td>Samopoczucie</td><td><select type='number' name='comfort'>";
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
    clear()  

    if( navigator.onLine ) { 
      result = JSON.stringify(user);
      request = getRequestObject() ;
      request.open("POST", api_url + "/add", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.send(result);
   } else {
         const connection = window.indexedDB.open(dbName, 4);
         connection.onupgradeneeded = function (event) {
          const db = event.target.result;
          const objectStore = db.createObjectStore('results', {autoIncrement: true});
          console.log(objectStore);
         };
         connection.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction('results', 'readwrite');
          const objectStore = transaction.objectStore('results');
          const objectRequest = objectStore.put(user);
          objectRequest.onerror = function (event) {
              console.log("error");
              console.log(event);
          };

          objectRequest.onsuccess = function (event) {
              console.log("success");
          };
      }
      
  }
}

  
// Usuwanie rekordow z bazy danych
function _del_list() {
   clear()  

    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4) { 
          objJSON = JSON.parse(request.response);
          

          var txt = "<form  name='data'>"
          txt += "<select class='check' name='del' size='10'>";

          for ( var id in objJSON ) {
               txt +=  "<option value="+objJSON[id]["_id"]+" >" ;
               txt += show_row(objJSON[id]);
               txt +="</option>";
          }
          txt += "</select><br/>";
          txt += "<input type='button' value='usun' onclick='_delete(this.form)'/></form>";

          document.getElementById('data').innerHTML = txt;
       }
    }
    request.open("GET", api_url + "/list", true);
    request.send(null);
}
  
function _delete(form) {
    var rec = form.del.selectedIndex;
    var id = document.getElementsByTagName('option')[rec].value;
    clear()  

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
   clear()  

       request = getRequestObject() ;
       request.onreadystatechange = function() {
         if (request.readyState == 4)    { 
           objJSON = JSON.parse(request.response);
           var txt = "<form  name='data'>"
           txt += "<select class='check' name='upd' size='10'>";
 
           for ( var id in objJSON ) {
                txt +=  "<option value="+objJSON[id]["_id"]+" >" ;
                txt += show_row(objJSON[id]);
                txt +="</option>";
           }
           txt += "</select><br/>";
           txt += "<input type='button' value='popraw' onclick='_upd_form(this.form)'/></form>";
          document.getElementById('data').innerHTML = txt;
          }
       }
       request.open("GET", api_url + "/list", true);
       request.send(null);
  }
  
  
  
  
function _upd_form(form) {
    var rec = form.upd.selectedIndex;
    idmongo = document.getElementsByTagName('option')[rec].value;
    clear()  

  var form1 = "<form name='upd'><table>" ;

  form1    += "<tr><td>Imię</td><td><input type='text' name='fname' value='Imię' ></input></td></tr>";

  form1    += "<tr><td>Płeć</td><td><select name='sex'>";
  form1    += "<option value='mężczyzna' selected>mężczyzna</option>" 
  form1    += "<option value='kobieta'>kobieta</option>" 
  form1    += "</select></td></tr>"

  form1    += "<tr><td>Samopoczucie</td><td><select type='number' name='comfort'>";
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
  document.getElementById('cnv').innerHTML = '';  

}
  
function _update(form, idmongo) {
    var user = {};
    user.fname = form.fname.value;
    user.sex = form.sex.value;
    user.comfort = form.comfort.value;

    txt = JSON.stringify(user);
    console.log(txt)
    console.log(idmongo)
    clear()  

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



function stats() {

   clear() 
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4){
         objJSON = JSON.parse(request.response);
         var k = 0;
         var m = 0;
         var sum_k = 0;
         var sum_m = 0;
         for ( var id in objJSON )  {
            if (objJSON[id].sex == 'kobieta') {
               k++;
               sum_k += objJSON[id].comfort;
            }
            else {
               m++;
               sum_m += objJSON[id].comfort;
            }

         }
         draw_stats(sum_k/k, sum_m/m);

      }
   }
   request.open("GET", api_url +"/list", true);
   request.send(null);

}

function draw_stats(srednia_k, srednia_m) {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';
   document.getElementById('myCanvas').innerHTML = '<canvas id="cnv" width="300" height="200"></canvas><legend for="myCanvas"></legend>'

   let myCanvas = document.getElementById('cnv');

   myCanvas.width = 300;
   myCanvas.height = 300;
      
   var ctx = myCanvas.getContext("2d");
    
   function drawLine(ctx, startX, startY, endX, endY,color){
       ctx.save();
       ctx.strokeStyle = color;
       ctx.beginPath();
       ctx.moveTo(startX,startY);
       ctx.lineTo(endX,endY);
       ctx.stroke();
       ctx.restore();
   }
    
   function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
       ctx.save();
       ctx.fillStyle=color;
       ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
       ctx.restore();
   }
    
   var kategorie = {
      "Kobiety": srednia_k,
      "Mężczyźni": srednia_m,
   };
    
   var Barchart = function(options){
       this.options = options;
       this.canvas = options.canvas;
       this.ctx = this.canvas.getContext("2d");
       this.colors = options.colors;
     
       this.draw = function(){
           var maxValue = 10;
           
           var canvasActualHeight = this.canvas.height - this.options.padding * 2;
           var canvasActualWidth = this.canvas.width - this.options.padding * 2;
    
           //drawing the grid lines
           var gridValue = 0;
           while (gridValue <= maxValue){
               var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
               drawLine(
                   this.ctx,
                   0,
                   gridY,
                   this.canvas.width,
                   gridY,
                   this.options.gridColor
               );
                
               //writing grid markers
               this.ctx.save();
               this.ctx.fillStyle = this.options.gridColor;
               this.ctx.textBaseline="bottom"; 
               this.ctx.font = "bold 10px Arial";
               this.ctx.fillText(gridValue, 10,gridY - 2);
               this.ctx.restore();
    
               gridValue+=this.options.gridScale;
           }      
     
           //drawing the bars
           var barIndex = 0;
           var numberOfBars = Object.keys(this.options.data).length;
           var barSize = (canvasActualWidth)/numberOfBars;
    
           for (categ in this.options.data){
               var val = this.options.data[categ];
               var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
               drawBar(
                   this.ctx,
                   this.options.padding + barIndex * barSize,
                   this.canvas.height - barHeight - this.options.padding,
                   barSize,
                   barHeight,
                   this.colors[barIndex%this.colors.length]
               );
    
               barIndex++;
           }
    
           //drawing series name
           this.ctx.save();
           this.ctx.textBaseline="bottom";
           this.ctx.textAlign="center";
           this.ctx.fillStyle = "#000000";
           this.ctx.font = "bold 14px Arial";
           this.ctx.fillText(this.options.seriesName, this.canvas.width/2,this.canvas.height);
           this.ctx.restore();  
            
           //draw legend
           barIndex = 0;
           var legend = document.querySelector("legend[for='myCanvas']");
           var ul = document.createElement("ul");
           legend.append(ul);
           for (categ in this.options.data){
               var li = document.createElement("li");
               li.style.listStyle = "none";
               li.style.borderLeft = "20px solid "+this.colors[barIndex%this.colors.length];
               li.style.padding = "5px";
               li.textContent = categ;
               ul.append(li);
               barIndex++;
           }
       }
   }
    
    
   var myBarchart = new Barchart(
       {
           canvas:myCanvas,
           seriesName:"Średnie samopoczucie",
           padding:20,
           gridScale:5,
           gridColor:"#eeeeee",
           data:kategorie,
           colors:["#a55ca5","#67b6c7", "#bccd7a","#eb9743"]
       }
   );
   myBarchart.draw();
}


function apply(response) {
   objJSON = JSON.parse(response);
   document.getElementById('for_logged').innerHTML = objJSON.for_logged;
   document.getElementById('login').innerHTML = objJSON.login;  
   document.getElementById('register').innerHTML = objJSON.register;
   document.getElementById('logout').innerHTML = objJSON.logout;  
   document.getElementById('result').innerHTML = objJSON.result;
}

function _login(form) {
   clear() 
   var user = {};
   user.nick = form.nick.value;
   user.password = form.password.value;
   txt = JSON.stringify(user);

   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4){
         _init()
      }
   }
   request.open("POST", api_url +"/login", true);
   request.withCredentials = true;
   request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   request.send(txt);
}

function _logout(form) {
   clear() 
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4){
         apply(request.response)
      }
   }
   request.open("POST", api_url +"/logout", true);
   request.withCredentials = true;
   request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   request.send(null);
}


function _register(form)  {
   var user = {};
   user.nick = form.nick.value;
   user.password = form.password.value;
   txt = JSON.stringify(user);
   clear()  

   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200 )    {
         document.getElementById('result').innerHTML = request.response;
      }
   }
   request.open("POST", api_url + "/register", true);
   request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   request.send(txt);
}

function _login_form() {
   clear();
   var form1 = "<form name='add'><table>" ;
   form1    += "<tr><td>nick</td><td><input type='text' name='nick' value='nick' ></input></td></tr>";
   form1    += "<tr><td>password</td><td><input type='password' name='password' value='password' ></input></td></tr>";
   form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='_login(this.form)' ></input></td></tr>";
   form1    += "</table></form>";
   document.getElementById('data').innerHTML = form1;
   document.getElementById('result').innerHTML = ''; 
}

function _register_form() {
   clear();
   var form1 = "<form name='add'><table>" ;
   form1    += "<tr><td>nick</td><td><input type='text' name='nick' value='nick' ></input></td></tr>";
   form1    += "<tr><td>password</td><td><input type='password' name='password' value='password' ></input></td></tr>";
   form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='_register(this.form)' ></input></td></tr>";
   form1    += "</table></form>";
   document.getElementById('data').innerHTML = form1;
   document.getElementById('result').innerHTML = ''; 
}



window.addEventListener('online', (event) => {
   const connection = window.indexedDB.open(dbName, 4);
   connection.onupgradeneeded = function (event) {
       event.target.transaction.abort();
       console.log(event);
   };
   connection.onsuccess = function (event) {
       const db = event.target.result;
       const transaction = db.transaction(['results'], "readwrite");
       const objectStore = transaction.objectStore('results');
       const objectRequest = objectStore.getAll();
       objectRequest.onerror = function (event) {
           console.log("error");
           console.log(event);
       };

       objectRequest.onsuccess = function (event) {
           console.log("success");
           objectRequest.result.forEach(element => {
               data = JSON.stringify(element);
               console.log(data);
               request = getRequestObject();
               request.onreadystatechange = function() {
                   if (request.readyState == 4 && request.status == 200 ) {}
               }
               request.open("POST", api_url + "/add", true);
               request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
               request.send(data);
           });
           objectStore.clear();
       };
   }
});


function _init() {
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4){
         objJSON = JSON.parse(request.response);
         document.getElementById('for_logged').innerHTML = objJSON.for_logged  
         document.getElementById('login').innerHTML = objJSON.login;  
         document.getElementById('register').innerHTML = objJSON.register;
         document.getElementById('logout').innerHTML = objJSON.logout;  
         document.getElementById('result').innerHTML = objJSON.result;
      }
   }
   request.open("GET", api_url +"/init", true);
   request.withCredentials = true;
   request.send(null);
}

_init()
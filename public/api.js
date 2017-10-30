

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('init');
  //create event listener for filter button
  var button = document.getElementById("add_locBtn");
  button.addEventListener('click', handleAddClick);
  

   //callback function that handles add location click
  function handleAddClick(evt){
    console.log("clicked");
    //prevent the form from carrying out its default action
    evt.preventDefault();
    //create a URLencoded string to be sent in the request body
    var urlString = "";
    //get the location data from the form by document id
    var name = document.getElementById('place_name').value;
    var type = document.getElementById('type').value;
    var google_maps_id = document.getElementById('google_maps_id').value;
    var description = document.getElementById('description').value;
    //concatenate urlencoded string
    urlString = 'name=' + name + '&' + 'type=' + type + '&' + 'google_maps_id=' + google_maps_id + '&' + 'description=' + description;
    //create new XMLHttpRequest
    var req = new XMLHttpRequest();
    //specify url
    var url = 'http://i6.cims.nyu.edu:17876/add-location';
    //open a post based on the above url
    req.open('POST', url, true);
    //set the request header content type to urlencoded
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');    
    //on load of the request
    req.addEventListener('load', function(){
      //if the request succeeds
      if (req.status >= 200 && req.status < 400) {
        //if the location has been added
        if(req.responseText === "success"){
          console.log('location added');
          
        }
        //if the location is not successfully added, say so
        else{
          console.log('location NOT added');
        }

      }
    });
    //send the request with the URLEncoded string
    req.send(urlString);
}
////////////////////////////////////////////////////////////////////

    var rest_button = document.getElementById("restaurants_but");
    var quick_button = document.getElementById("quick_but");
    var dess_button = document.getElementById("dessert_but");
    var coff_button = document.getElementById("coffee_but");
    var supp_button = document.getElementById("supplies_but");
    var gov_button = document.getElementById("gov_but");

    rest_button.addEventListener('click', handleTypleFilterClick('Restaurant'));
    quick_button.addEventListener('click', handleTypleFilterClick('Quick'));
    dess_button.addEventListener('click', handleTypleFilterClick('Dessert'));
    coff_button.addEventListener('click', handleTypleFilterClick('Coffee'));
    supp_button.addEventListener('click', handleTypleFilterClick('Supplies'));
    gov_button.addEventListener('click', handleTypleFilterClick('Government'));


     //callback function that handles add location click
  function handleTypleFilterClick(type){
    console.log("clicked");
    //prevent the form from carrying out its default action
    event.preventDefault();

    var req = new XMLHttpRequest();

    //if there is no filter director specified, the url query has no value
    if(type == "All"){
      var url = 'http://i6.cims.nyu.edu:17876/api/filter?type=';
    }
    //otherwise, the director is passed in through the url query
    else{

      var url = 'http://i6.cims.nyu.edu:17876/api/filter?type=' + type;
    }
    //open a GET request based on the above url
    req.open('GET', url, true);
    //on load of the request
    req.addEventListener('load', function() {
      //if the request completes
      if (req.status >= 200 && req.status < 400) {
        //get the movie list from the request responseText
        var locations = JSON.parse(req.responseText);

        //from stack overflow
        locations.sort(function(a, b) {
            return parseFloat(a.rating) - parseFloat(b.rating);
        });
        console.log(locations);

        function initMap() {
                  var uluru = {lat: -25.363, lng: 131.044};
                  var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 17,
                    center: {lat: 40.7173884, lng: -74.0030664},
                  });
                  

                  var marker = new google.maps.Marker({
                    map: map,
                    position: {lat: 40.717232, lng: -74.001902 },
                    placeId: 'ChIJBYvLuCBawokR6kDpj1J22yU',
                    title: "LAF!"

                  });
                  var contentString = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h1 id="firstHeading" class="firstHeading">NEW Lafayette Hall</h1>'+
                  '<div id="bodyContent">'+
                  '<p><b>Lafayette Hall</b> at NYU is home to over 1000 resdidents. Situated smack-dab between Chinatown and the Financial District, it belongs to a very diverse and exciting neighborhood. </p><p> Enjoy exploring the wealth of shops and restaurants the city has to offer but always remember you are always welcomed back home to Laf.</div>';
                  var infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });

                  marker.addListener('click', function() {
                    infowindow.open(map, marker);
                  });
              }
/*
        //get the document element by the table
        var table = document.getElementById('movie-list');
        //remove everything from the table
        while(table.firstChild){
          table.removeChild(table.firstChild);
        }
        //add new tr elements within the table for each movie in the list
        //this list has been filtered (or not) above
        for(var i = 0; i < movies.length; i++){
          var tr = document.createElement("tr");
          var title = document.createElement("td");
          var titleText = document.createTextNode(movies[i].title);
          title.appendChild(titleText);
          var director = document.createElement("td");
          var dirText = document.createTextNode(movies[i].director);
          director.appendChild(dirText);
          var year = document.createElement("td");
          var yrText = document.createTextNode(movies[i].year);
          year.appendChild(yrText);
          tr.appendChild(title);
          tr.appendChild(director);
          tr.appendChild(year);
          table.appendChild(tr);
        }
     */   
      }
    });
    //send the request
    req.send();


    /*
    urlString = 'type=' + type;
    //create new XMLHttpRequest
    var req = new XMLHttpRequest();
    //specify url
    var url = 'http://i6.cims.nyu.edu:17876/api/filter_type';
    //open a post based on the above url
    req.open('GET', url, true);
    //set the request header content type to urlencoded
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');    
    //on load of the request
    req.addEventListener('load', function(){
      //if the request succeeds
      if (req.status >= 200 && req.status < 400) {
      
          console.log('locations gotten');
          //create and send a new background request to re-load the table
          //with all movies in the database
          //(copied and truncated from above)
          var reqRefresh = new XMLHttpRequest();
        
          var url = 'http://i6.cims.nyu.edu:17876/home';

          reqRefresh.open('GET', url, true);

          reqRefresh.addEventListener('load', function() {
            if (reqRefresh.status >= 200 && req.status < 400) {
              
              var locations = JSON.parse(reqRefresh.responseText);
              console.log(locations);

              function initMap() {
                  var uluru = {lat: -25.363, lng: 131.044};
                  var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 17,
                    center: {lat: 40.7173884, lng: -74.0030664},
                  });
                  

                  var marker = new google.maps.Marker({
                    map: map,
                    position: {lat: 40.717232, lng: -74.001902 },
                    placeId: 'ChIJBYvLuCBawokR6kDpj1J22yU',
                    title: "LAF!"

                  });
                  var contentString = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h1 id="firstHeading" class="firstHeading">NEW Lafayette Hall</h1>'+
                  '<div id="bodyContent">'+
                  '<p><b>Lafayette Hall</b> at NYU is home to over 1000 resdidents. Situated smack-dab between Chinatown and the Financial District, it belongs to a very diverse and exciting neighborhood. </p><p> Enjoy exploring the wealth of shops and restaurants the city has to offer but always remember you are always welcomed back home to Laf.</div>';
                  var infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });

                  marker.addListener('click', function() {
                    infowindow.open(map, marker);
                  });
              }


              
              
            }
          });
          //send refresh background request
          reqRefresh.send();

      }
    });
    //send the request with the URLEncoded string
    req.send(urlString);


*/













   
    

  }
}
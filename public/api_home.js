

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('init');
  
////////////////////////////////////////////////////////////////////

  //get buttons
  var rest_button = document.getElementById("restaurants_but");
  var quick_button = document.getElementById("quick_but");
  var dess_button = document.getElementById("dessert_but");
  var coff_button = document.getElementById("coffee_but");
  var groc_button = document.getElementById("grocery_but");
  var other_button = document.getElementById("other_but");

  //add event listeners for each button
  rest_button.addEventListener('click', function(){handleTypeFilterClick('Restaurant')}, false);
  quick_button.addEventListener('click', function(){handleTypeFilterClick('Quick')}, false);
  dess_button.addEventListener('click', function(){handleTypeFilterClick('Dessert')}, false);
  coff_button.addEventListener('click', function(){handleTypeFilterClick('Coffee')}, false);
  groc_button.addEventListener('click', function(){handleTypeFilterClick('Grocery')}, false);
  other_button.addEventListener('click', function(){handleTypeFilterClick('Other')}, false);

  //callback function that handles filter click
  function handleTypeFilterClick(type){
    console.log("clicked");
    //prevent the form from carrying out its default action
    event.preventDefault();

    //change category list view//
    if(type == 'Restaurant'){
      document.getElementById("Restaurant").style.display = "block";
      document.getElementById("Quick").style.display = "none";
      document.getElementById("Dessert").style.display = "none";
      document.getElementById("Coffee").style.display = "none";
      document.getElementById("Grocery").style.display = "none";
      document.getElementById("Other").style.display = "none";
    }
    else if(type == 'Quick'){
      document.getElementById("Restaurant").style.display = "none";
      document.getElementById("Quick").style.display = "block";
      document.getElementById("Dessert").style.display = "none";
      document.getElementById("Coffee").style.display = "none";
      document.getElementById("Grocery").style.display = "none";
      document.getElementById("Other").style.display = "none";
    }
    else if(type == 'Dessert'){
      document.getElementById("Restaurant").style.display = "none";
      document.getElementById("Quick").style.display = "none";
      document.getElementById("Dessert").style.display = "block";
      document.getElementById("Coffee").style.display = "none";
      document.getElementById("Grocery").style.display = "none";
      document.getElementById("Other").style.display = "none";
    }
    else if(type == 'Coffee'){
      document.getElementById("Restaurant").style.display = "none";
      document.getElementById("Quick").style.display = "none";
      document.getElementById("Dessert").style.display = "none";
      document.getElementById("Coffee").style.display = "block";
      document.getElementById("Grocery").style.display = "none";
      document.getElementById("Other").style.display = "none";
    }
    else if(type == 'Grocery'){
      document.getElementById("Restaurant").style.display = "none";
      document.getElementById("Quick").style.display = "none";
      document.getElementById("Dessert").style.display = "none";
      document.getElementById("Coffee").style.display = "none";
      document.getElementById("Grocery").style.display = "block";
      document.getElementById("Other").style.display = "none";
    }
    else if(type == 'Other'){
      document.getElementById("Restaurant").style.display = "none";
      document.getElementById("Quick").style.display = "none";
      document.getElementById("Dessert").style.display = "none";
      document.getElementById("Coffee").style.display = "none";
      document.getElementById("Grocery").style.display = "none";
      document.getElementById("Other").style.display = "block";
    }
    else{
      //must filter by something
    }


    //setup request
    var req = new XMLHttpRequest();

    //if there is no filter type specified, the url query has no value
    if(type == "All"){
      var url = 'https://powerful-cliffs-42161.herokuapp.com/api/filter/type?type=';
    }
    //otherwise, the type is passed in through the url query
    else{

      var url = 'https://powerful-cliffs-42161.herokuapp.com/api/filter/type?type=' + type;
    }
    //open a GET request based on the above url
    req.open('GET', url, true);
    //on load of the request
    req.addEventListener('load', function() {
      //if the request completes
      if (req.status >= 200 && req.status < 400) {
        //get the location list from the request responseText
        var locations = JSON.parse(req.responseText);

        //from stack overflow
        locations.sort(function(a, b) {
            return parseFloat(b.loc.rating_disp) - parseFloat(a.loc.rating_disp);
        });

        //initialize map with LAF on it
        initMap();
        function initMap() {
          console.log("new map");
                  
                  var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: {lat: 40.7173884, lng: -74.0030664},
                  });

                  //LAF marker info///
                  var marker = new google.maps.Marker({
                    map: map,
                    position: {lat: 40.717232, lng: -74.001902 },
                    //placeId: 'ChIJBYvLuCBawokR6kDpj1J22yU',
                    title: "LAF!"

                  });
                  var contentString = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h1 id="firstHeading" class="firstHeading">Lafayette Hall</h1>'+
                  '<div id="bodyContent">'+
                  '<p><b>Lafayette Hall</b> at NYU is home to over 1000 resdidents. Situated smack-dab between Chinatown and the Financial District, it belongs to a very diverse and exciting neighborhood. </p><p> Enjoy exploring the wealth of shops and restaurants the city has to offer but always remember you are always welcomed back home to Laf.</div>';
                  var infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });

                  marker.addListener('click', function() {
                    infowindow.open(map, marker);
                  });
                  //LAF marker info
                
                //for each location in the filtered list of locations, create a marker and add it to the map
                locations.forEach( function( element ) {

                  var lbl = locations.indexOf(element) +1 + '';
                  var pos = {lat: element.loc.lat, lng: element.loc.lng};
                  var marker = new google.maps.Marker({
                    label: lbl,
                    position: pos,
                    map: map,
                    title: element.loc.name,
                    
                  });
                }); 

              }

        //get the document element by the places scroller
        var places = document.getElementById('places_scroll');
        //remove everything from the scroller
        while(places.firstChild){
          places.removeChild(places.firstChild);
        }
        //add new p elements within the table for each location in the list
        //this list has been filtered (or not) above
        for(var i = 0; i < locations.length; i++){
          //create space for this location
          var p = document.createElement("p");

          //location title
          var title = document.createElement("h3");
          var titleText = document.createTextNode((i+1)+ " " + locations[i].loc.name);
          title.appendChild(titleText);

          //location description
          var description = document.createElement("p");
          var descText = document.createTextNode(locations[i].loc.desc);
          description.appendChild(descText);

          //location rating
          var rating = document.createElement("p");
          var rtText = document.createTextNode(locations[i].loc.rating_disp);
          rating.appendChild(rtText);

          //random rating content
          var rand_rating = document.createElement("p");
          if(locations[i].reviews.length > 0){
            var num_reviews = locations[i].reviews.length;
            var rand_review = Math.floor(Math.random()*num_reviews);
            var rartText = document.createTextNode("Random Review: " + locations[i].reviews[rand_review].content);
          }
          else{

            var rartText = document.createTextNode("No Reviews! Add one below!");
          }
          rand_rating.appendChild(rartText);

          //review form
          var form = document.createElement("form");
            var element1 = document.createElement("input"); 
            var element2 = document.createElement("input");  
            var element3 = document.createElement("input"); 
            var element4 = document.createElement("input"); 

            form.method = "POST";
            form.action = "/review";   

            element1.value=locations[i].id;
            element1.name="id";
            element1.type="hidden"
            form.appendChild(element1);  

            element2.type="text";
            element2.name="rating";
            element2.placeholder="Rating(1-5)";
            form.appendChild(element2);

            element3.type="text";
            element3.name="review";
            element3.placeholder="Tell us what you think!";
            form.appendChild(element3);

            element4.type="submit";
            element4.name="Submit Review";
            form.appendChild(element4);

         
          //add each element created above onto the DOM
          p.appendChild(title);
          p.appendChild(description);
          p.appendChild(rating);
          p.appendChild(rand_rating);
          p.appendChild(form);
          places.appendChild(p);

        } 
      }
    });
    //send the request
    req.send();



  }
}
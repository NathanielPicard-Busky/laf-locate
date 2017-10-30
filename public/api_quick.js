

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('init quick');
  
////////////////////////////////////////////////////////////////////

    var quick_all_button = document.getElementById("quick_all");


    quick_all_button.addEventListener('click', function(){handleQuickFilterClick('All')}, false);
  
  //callback function that handles filter click
  function handleQuickFilterClick(category){
    console.log("clicked quick");
    //prevent the form from carrying out its default action
    event.preventDefault();

    var req = new XMLHttpRequest();

    //if there is no filter category specified, the url query has no value
    if(category == "All"){
      var url = 'http://i6.cims.nyu.edu:17876/api/filter/category?category=';
    }
    //otherwise, the category is passed in through the url query
    else{

      var url = 'http://i6.cims.nyu.edu:17876/api/filter/category?category=' + category;
    }

    //open a GET request based on the above url
    req.open('GET', url, true);
    //on load of the request
    req.addEventListener('load', function() {
      //if the request completes
      if (req.status >= 200 && req.status < 400) {
        //get the location list from the request responseText
        var locations = JSON.parse(req.responseText);

        //sort method sourced from stack overflow
        locations.sort(function(a, b) {
            return parseFloat(b.loc.rating_disp) - parseFloat(a.loc.rating_disp);
        });

        initMap();
        function initMap() {
          console.log("new map");
                  
                  var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: {lat: 40.7173884, lng: -74.0030664},
                  });

                  //create LAF marker//
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
                  //////////////////////
                
                  //for each filtered location, create a marker and add it to the map
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
        //add new p elements within the table for each movie in the list
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
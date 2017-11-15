

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
    var category = document.getElementById('category').value;
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var description = document.getElementById('description').value;
    //concatenate urlencoded string
    urlString = 'name=' + name + '&' + 'type=' + type + '&' + 'category=' + category + '&' + 'lat=' + lat + '&' + 'lng=' + lng + '&' + 'description=' + description;
    console.log("urlstring");
    console.log(urlString);

    //create new XMLHttpRequest
    var req = new XMLHttpRequest();
    //specify url
    var url = 'https://laflocate.herokuapp.com/add-location';
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
          var success = document.getElementById('success');
          var sText = document.createTextNode("Location Created");
          success.appendChild(sText);
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


}
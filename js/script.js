
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $("#street").val();
    var city = $("#city").val();
    
    var src = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location="+street+", "+city;
   
    var mapsrc = "<img class=\"bgimg\" src=\""+src+"\">";
    console.log(mapsrc);
    $body.append(mapsrc);

    var key = "8a2d107c15683642f43a71a4fe2e5f9f:0:60532505";
    var nytimesRequest = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+city+
    "&fq=source(\"New York Times\")&sort=newest&begin_date=20050101&api-key="+key;
    console.log(nytimesRequest);

   $.getJSON(nytimesRequest)
        .done(function(data) {
            var content = data.response.docs;
            
            $.each(content, function(val) {
                var web_url = content[val].web_url;
                var p = content[val].lead_paragraph;
                var headline = content[val].headline.main;
                var elem = "<li class='article'> <a href="+web_url+">"+headline+"</a><p>"+p+"</p></li>";
                //console.log(data.response.docs[val]);
                //console.log(web_url+":"+p);
                //console.log(elem);
                $nytElem.append(elem);
            });
        })
        .fail(function(jqxhr, textStatus, error){
            var errmsg = "Request failed: " + textStatus +":" +error+"jqx"+jqxhr.statusText+":"+jqxhr.status;
            console.log(errmsg);
            var elem = "<p>"+errmsg+"</p>";
            $nytHeaderElem.text(errmsg);
        })


   /* $.getJSON(nytimesRequest, function(data) {
        var content = data.response.docs;
        $.each(content, function(val) {
            var web_url = content[val].web_url;
            var p = content[val].lead_paragraph;
            var headline = content[val].headline.main;
            var elem = "<li class='article'> <a href="+web_url+">"+headline+"</a><p>"+p+"</p></li>";
                //console.log(data.response.docs[val]);
                //console.log(web_url+":"+p);
            //console.log(elem);
            $nytElem.append(elem);
        });
    });*/

    //There is no error handling for jsonp, so has to use window's setTimeout() to stop the function if fails
    var wikiTimeout = setTimeout(function() {
        var errmsg = "Not able to get wikipedia results";
        $("#wikipedia-header").text(errmsg);
    }, 8000);

    //It does not seem to matter if callback=wikiCallback needs to be specified or not
    //var wikipediaRequest = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&limit=5 &format=json&callback=wikiCallback";
    var wikipediaRequest = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&limit=5 &format=json";
    console.log(wikipediaRequest);
    $.ajax({
        url: wikipediaRequest,
        dataType: "jsonp",
        success: function(data) {
            $.each(data[2], function(val){
                place=data[1][val];
                title=data[2][val];
                link=data[3][val];
                //console.log(title+link);
                var elem="<li><a href="+link+">"+place+"</a></li>";
                $wikiElem.append(elem);
            });
            clearTimeout(wikiTimeout);
        }
    });



    return false;

    

};

$('#form-container').submit(loadData);

// loadData();

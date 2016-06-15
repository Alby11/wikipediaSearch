function main() {

   // FUNCTIONS 

  function buttonRandom() {
    // $('#input-1').val('');
    $('#buttonText').html("  Random Page...");
    $('.btn').css('background-color', '#939598');
    $('.btn').removeClass('btn-default btn-primary btn-warning btn-danger').addClass('btn-default');
    $('.btn .glyphicon').removeClass('glyphicon-eye-open glyphicon-search glyphicon-warning-sign glyphicon-refresh glyphicon-refresh-animate').addClass('glyphicon-eye-open');
    $('.btn').off();
    $('.btn').on('click', function(event) {
      randomSearch();
    });
  };

  function buttonSearch() {
    $('#buttonText').html('  Search...');
    $('.btn').css('background-color', '#636466');
    $('.btn').removeClass('btn-default btn-primary btn-warning btn-danger').addClass('btn-primary');
    $('.btn .glyphicon').removeClass('glyphicon-eye-open glyphicon-search glyphicon-warning-sign glyphicon-refresh glyphicon-refresh-animate').addClass('glyphicon-search');
    $('.btn').off();
    $('.btn').on('click', function(event) {
      searchWikipedia();
    });
  };

  function buttonLoading() {
    $('#input-1').val("");
    $('#buttonText').html("  Loading...");
    $('.btn').css('background-color', '#0055FF');
    $('.btn').removeClass('btn-default btn-primary btn-warning btn-danger').addClass('btn-warning');
    $('.btn .glyphicon').removeClass('glyphicon-eye-open glyphicon-search glyphicon-warning-sign glyphicon-refresh glyphicon-refresh-animate').addClass('glyphicon-refresh glyphicon-refresh-animate');
    $('.btn').off();
    $('.btn').on('click', function(event) {
      event.preventDefault();
      console.log("Loading...");
    });
  };

  function buttonError() {
    $('#input-1').val("");
    $('#buttonText').html("  Error...");
    $('.btn').css('background-color', '#FF0000');
    $('.btn').removeClass('btn-default btn-primary btn-warning btn-danger').addClass('btn-danger');
    $('.btn .glyphicon').removeClass('glyphicon-eye-open glyphicon-search glyphicon-warning-sign glyphicon-refresh glyphicon-refresh-animate').addClass('glyphicon-warning-sign');
    $('.btn').off();
    $('.btn').on('click', function(event) {
      location.reload();
    });
  }

  function showBox(attr, value) {
    var boxHTML = '<div class="content" id="box"><div class="embed-container"><iframe id="iframe" src="" frameborder="0"></iframe></div></div>';
    $(".webpage-box").append(boxHTML);
    buttonLoading();
    $("#iframe").attr(attr, value);
    $("#iframe").load(function(){
      $(".webpage-box").fadeIn('1000', buttonRandom());
    });
  };

  function hideBox() {
    $(".webpage-box").fadeOut('1000', function() {
      $(".webpage-box").html("");
    });
  };

  function randomSearch() {
    showBox('src', 'https://en.wikipedia.org/wiki/Special:Random');
  };

  function showClickedResult(element) {
    var wikiLink = $(element).find('a').attr('href');
    hideSearchResults();
    showBox('src', wikiLink);
  };

  function hideSearchResults() {
    $(".search-results").fadeOut(1000);
    $(".search-results").html("");
  };

  function wikiAjax(searchURL) {
    return $.ajax({
      url: searchURL,
      jsonp: "callback",
      dataType: 'jsonp',
      xhrFields: {
        withCredentials: true
      },
      beforeSend: function() {
        buttonLoading();
      }
    });
  };

  function searchWikipedia() {
    hideBox();
    hideSearchResults();
    var searchText = $('#input-1').val();
    var searchURL = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrsearch=" + searchText + "&gsrlimit=15&prop=extracts&exsentences=3&exintro=&explaintext&exlimit=max&callback=JSON_CALLBACK";
    console.log(searchURL);
    var wikiResponse = wikiAjax(searchURL);
    wikiResponse.done(function(data) {
      responseOK(data);
    }).fail(function(err) {
      responseKO(err);
    });
  };

  function responseOK(data) {
    buttonRandom();
    console.log(data);
    $.each(data.query.pages, function(index, value) {
      var wikiResultHTML = '<div class="linkable-div"><a href="https://en.wikipedia.org/?curid=' + value.pageid + '"<div class="container"><article class="search-result row well"><div class="col-xs-12 col-sm-12 col-md-7 excerpet"><h3>' + value.title + '</h3><p>' + value.extract + '</p></div><span class="clearfix borda"></span></article></div></a></div>';
      $(".search-results").append(wikiResultHTML);
    });
    $(".search-results").show(2000, function() {
      $('.linkable-div').on('click', function(event) {
        event.preventDefault();
        showClickedResult(this);
      });
    });
  };

  function responseKO(err) {
    alert("The call has been rejected:" + err);
    buttonError();
  };

  /* END OF FUNCTIONS */

  /* DEFAULT ACTIONS */

  $(".search-form").on('submit', function(event) {
    event.preventDefault();
    searchWikipedia();
  });

  buttonRandom();


  /* END OF DEFAULT ACTIONS */

  /* OVERRIDE */

  $("#input-1").on('focus click', function(event) {
    buttonSearch();
  });

  // $(document.body).on("click", ":not(.search-form, .search-form *, .search-results, .search-results *, .webpage-box, .webpage-box *, btn, btn *, span, span *)", function(event) {
  //   event.preventDefault();
  //   hideBox();
  //   hideSearchResults();
  //   buttonRandom();
  // });

}

$(document).ready(main);
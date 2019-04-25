$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(`${user.first_name}, ${user.last_name}`).appendTo($("body"));
    }
  });;
});

$(document).ready(function() {
  // $("#register-button").on("click", function () {
  //   $(".new-tweet").slideToggle("fast");
  //   if ($(".new-tweet").is(':visible')) 
  //   {
  //     $(".tweet-area").focus();
  //   }
  // });
  $("form").on("submit", function(event) {
    event.preventDefault();
    const userInput =  $(this).serialize();
    console.log(userInput);
      $.ajax({
        type: 'POST',
        url: "/api/users/register",
        data: userInput
      })
      .done ( () => {
        console.log(`${userInput}, Tweet uploaded`);
        $(".tweet-area").val("");
        $( ".tweet-area" ).trigger( "input", [ "" ] );
        autoRenderNewTweet();
      })
      .fail ( () => {
        console.log("Tweet upload failed.");
      })    
    });
$(function(){
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });

  $(window).resize(function(e) {
    if($(window).width()<=768){
      $("#wrapper").removeClass("toggled");
    }else{
      $("#wrapper").addClass("toggled");
    }
  });
});
});

$(document).ready(function() {
  // Handle registration showing JS
  $("#register_button").click(function () {
    $('#popup_register').css('display', 'block');
  });
  $(".reg_close_button").click(function () {
    $('#popup_register').css('display', 'none');
  })

  $("#profile_button").click(function () {
    $('#popup_profile').css('display', 'block');
  });
  $(".prof_close_button").click(function () {
    $('#popup_profile').css('display', 'none');
  })

  // Handle Form Submit
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

  // THIS FUNCTION IS FOR THE MENU TOGGLE SPECIFICALLY  //
  // ONLY CHANGE WHEN ADDING COLLAPSING SIDEBAR STRETCH //

  // $(function(){
  //   $("#menu-toggle").click(function(e) {
  //       e.preventDefault();
  //       $("#wrapper").toggleClass("toggled");
  //   });
  //
  //   $(window).resize(function(e) {
  //     if($(window).width()<=768){
  //       $("#wrapper").removeClass("toggled");
  //     }else{
  //       $("#wrapper").addClass("toggled");
  //     }
  //   });
  // });
});

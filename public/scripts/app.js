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

  let userInfo = {
    id: 15,
    first_name: 'Karl',
    last_name: 'Chvojka',
    username: 'karl.chvojka',
    email: 'karl.chvojka@gmail.com',
    password: 'thingsandstuff',
    avatar: 'https://avatars2.githubusercontent.com/u/4898500?s=460&v=4'
  }

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

  $(function profilePopulate () {
    $('#popup_profile input[name=first_name]').val(userInfo.first_name);
    $('#popup_profile input[name=last_name]').val(userInfo.last_name);
    $('#popup_profile input[name=username]').val(userInfo.username);
    $('#popup_profile input[name=email]').val(userInfo.email);
    $('#popup_profile input[name=password]').val(userInfo.password);
    $('#popup_profile input[name=avatar]').val(userInfo.avatar);
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

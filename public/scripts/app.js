$(document).ready(function() {
  // Handle registration showing JS
  $("#login_button").click(function () {
    $('#popup_login').css('display', 'block');
  });
  $(".login_close_button").click(function () {
    $('#popup_login').css('display', 'none');
  })
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

  // Functions
  const getResponseError = (XHR)=>{
    if(XHR.responseJSON){
      const { error, message } = XHR.responseJSON;
      return error;
    }
    return XHR.responseText;
  }

  // Handle Register Form Submit
  $(".register-form").on("submit", function(event) {
    event.preventDefault();
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const userInput =  $(this).serialize();
      $.ajax({
        type: "POST",
        url: "/api/users/register",
        data: userInput
      })
      .done ( () => {
        $(".register-form").trigger("reset");
        $(".reg_close_button").trigger("click");
      })
      .fail ( (response) => {
        $(".alert").slideDown("fast", () => {
          $(".alert").text(getResponseError(response));
        });      
        console.log(response);
      })
  });
  $(".login-form").on("submit", function(event) {
    event.preventDefault();
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const userInput =  $(this).serialize();
      $.ajax({
        type: "PUT",
        url: "/api/users/login",
        data: userInput
      })
      .done ( () => {
        $(".login-form").trigger("reset");
        $(".login_close_button").trigger("click");
      })
      .fail ( (response) => {
        $(".alert").slideDown("fast", () => {
          $(".alert").text(getResponseError(response));
        });      
        console.log(response);
      })
  });
  $("#logout_button").on("click", function(event) {
    event.preventDefault();
    console.log("logout clicked.");
    $.ajax({
      type: "POST",
      url: "/api/users/logout",
      data: ""
    })
    .done ( () => {
      console.log("Logout Succesful!");
    })
    .fail ( (response) => {   
      console.log("Logout failed!", response);
    })
  })



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

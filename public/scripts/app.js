// Global Variables
let frontuserInfo = {};


function createResourceElement (input) {
  // Create variables representing the individual elements in a resource.
  // Resource wrap creation.
  let resourceWrap = $('<div>').addClass('col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12');

  //Resource Inner Wrap creation
  let resourceInner = $('<div>').addClass('resource_mininmal_single mr-1 m1-1');

  //Resource Inner Top creation
  let resourceInnerHead = $('<div>').addClass('resource_min_top_wrap');

  // ****************************************************** //
  // Appending elements to facilitate the creation of a Resource.
  // ****************************************************** //

  // Create Resource wrapper
}
function renderResources (inputData) {
  for (let resource of inputData) {
    $('.main_section_wrap').prepend(createResourceElement(resource, addClasses))
  }
}

function createResourceElement (input, addClasses) {
  // Create variables representing the individual elements in a resource.
  // Resource wrap creation.
  let resWrap = $('<div>').addClass('single_wrap ' + addClasses);

  //Resource Inner Wrap creation
  let resInner = $('<div>').addClass('resource_minimal_single mr-1 m1-1');

  //Resource Inner Top creation
  let resInnerHead = $('<div>').addClass('resource_min_top_wrap');
  let resInnerHeadLink = $('<a>').addClass('fullLink');
  let resInnerHeadTitle = $('<h3>');
  let resInnerHeadDesc = $('<p>');
  let resInnerHeadCatTitle = $('<h4>');
  let resInnerHeadCat = $('<p>');

  //Resource Social Wrap
  let resInnerSoc = $('<div>').addClass('resource_minimal_social_wrap row');
  let resInnerSocLikes = $('<div>').addClass('col-3');
  let resInnerSocLikesTitle = $('<p>');
  let resInnerSocRate = $('<div>').addClass('col-3');
  let resInnerSocRateTitle = $('<p>');
  let resInnerSocCom = $('<div>').addClass('col-3');
  let resInnerSocComTitle = $('<p>');
  let resInnerSocUser = $('<div>').addClass('col-3 user_Controls hideElement');

  // ****************************************************** //
  // Appending elements to facilitate the creation of a Resource.
  // ****************************************************** //

  // Create Resource wrapper
  $(resWrap).append(resInner);

  $(resInner).append(resInnerHead);
  $(resInnerHead).append(resInnerHeadTitle);
  $(resInnerHeadTitle).text(input['title']);
  $(resInnerHead).append(resInnerHeadLink);
  $(resInnerHeadLink).attr('href', '#');
  $(resInnerHeadLink).text(input['url'])
  $(resInnerHead).append(resInnerHeadDesc);
  $(resInnerHeadDesc).text(input['description']);
  $(resInnerHead).append(resInnerHeadCatTitle);
  $(resInnerHeadCatTitle).text('Category');
  $(resInnerHead).append(resInnerHeadCat);
  $(resInnerHeadCat).text(input['category_description']);


  //Resource Social
  $(resInner).append(resInnerSoc);
  $(resInnerSoc).append(resInnerSocLikes);
  $(resInnerSocLikes).append(resInnerSocLikesTitle);
  $(resInnerSocLikesTitle).text('Likes: ' + input['likes']);
  $(resInnerSoc).append(resInnerSocRate);
  $(resInnerSocRate).append(resInnerSocRateTitle);
  $(resInnerSocRateTitle).text('Rating: ' + input['rate']);
  $(resInnerSoc).append(resInnerSocCom);
  $(resInnerSocCom).append(resInnerSocComTitle);
  $(resInnerSocComTitle).text('Comments: ' + input['comments']);
  $(resInnerSoc).append(resInnerSocUser);
  $(resInnerSocUser).append('<button><i class="fas fa-edit"></i></button><button><i class="fas fa-trash-alt"></i></button>');


  resInnerHeadLink.data('resource_id', input.id);
  return resWrap;
}


function callIndividualData(resourceID, element ) {
  const ident = $('#popup_fullDetailed').data('resource_id');
  $.ajax({
    type: "GET",
    url: "/api/resources/" + ident,
  })
  .then(resource => {
    $('.popupBoxContent').append(createResourceElement(resource[0], 'individualRes'));
  })

};

function renderResources (inputData) {
  for (let index of inputData) {
    $('.main_section_wrap').prepend(createResourceElement(index, 'col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12'))
  }
}

$(document).ready(function() {
  // Set default states for first load
  $("#register_button").parent().addClass('showElement');
  $("#login_button").parent().addClass('showElement');
  $("#logout_button").parent().addClass('hideElement');
  $("#profile_button").parent().addClass('hideElement');
  $("#add_button").parent().addClass('hideElement');

  $("#register_button").parent().removeClass('hideElement');
  $("#login_button").parent().removeClass('hideElement');
  $("#logout_button").parent().removeClass('showElement');
  $("#profile_button").parent().removeClass('showElement');
  $("#add_button").parent().removeClass('showElement');

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
  });
  $("#add_button").click(function () {
    $('#popup_addRes').css('display', 'block');
  });
  $(".addRes_close_button").click(function () {
    $('#popup_addRes').css('display', 'none');
  });

  $("#profile_button").on('click', function () {
    $('#popup_profile').css('display', 'block');
    let profileInfo = $('#profile_button').data();

    $.ajax({
      type: 'GET',
      url: 'api/users/:id'
    })
    .done( (data) => {
      console.log(data);
      // TO BE UPDATED WHEN WE HAVE A SINGLE USER ROUTE TO PULL INFO FROM.
      $('#popup_profile input[name=first_name]').val(data[0].first_name);
      $('#popup_profile input[name=last_name]').val(data[0].last_name);
      $('#popup_profile input[name=username]').val(data[0].username);
      $('#popup_profile input[name=email]').val(data[0].email);
      $('#popup_profile input[name=password]').val(data[0].password);
      $('#popup_profile input[name=avatar]').val(data[0].avatar);
    })
    .fail( (err) => {
      console.log('Failed', err)
    })


  });
  $(".prof_close_button").click(function () {
    $('#popup_profile').css('display', 'none');
  });

  $(".main_section_wrap").on('click', '.fullLink', function () {
    let thisStuff = $(this).data('resource_id');

    $('#popup_fullDetailed').css('display', 'block');
    $('#popup_fullDetailed').data('resource_id', thisStuff)
    callIndividualData(thisStuff, $(this));
  });

  $(".comment_add_button").click(function () {
    $(".comm_add_new").slideToggle("fast");
  })

  $(".full_close_button").click(function () {
    $('.individualRes').remove();
    $('#popup_fullDetailed').css('display', 'none');

  });

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
  $(".profile-form").on("submit", function(event) {
    event.preventDefault();
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const userInput =  $(this).serialize();
      $.ajax({
        type: "PUT",
        url: "/api/users/:id",
        data: userInput
      })
      .done ( () => {
        $(".prof_close_button").trigger("click");
      })
      .fail ( (response) => {
        $(".alert").slideDown("fast", () => {
          $(".alert").text(getResponseError(response));
        });
        console.log(response);
      })
  });
  $(".addRes-form").on("submit", function(event) {
    event.preventDefault();
    console.log("Submit add resource")
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const userInput =  $(this).serialize();
      $.ajax({
        type: "POST",
        url: '/api/resources/:id',
        data: userInput
      })
      .done ( () => {
        $(".addRes_close_button").trigger("click");
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
      .done ( (userInfo) => {
        frontuserInfo = userInfo.currentUser;
        $(".login-form").trigger("reset");
        $(".login_close_button").trigger("click");
        $("#register_button").parent().addClass('hideElement');
        $("#login_button").parent().addClass('hideElement');
        $("#logout_button").parent().addClass('showElement');
        $("#profile_button").parent().addClass('showElement');
        $("#add_button").parent().addClass('showElement');

        $("#register_button").parent().removeClass('showElement');
        $("#login_button").parent().removeClass('showElement');
        $("#logout_button").parent().removeClass('hideElement');
        $("#profile_button").parent().removeClass('hideElement');
        $("#add_button").parent().removeClass('hideElement');

        $.ajax({
          type: 'GET',
          url: `api/users/${frontuserInfo}/resources/?limit=20`,
        })
        .done( (data) => {
          renderResources(data);
        })
        .fail( (err) => {
          console.log('Failed', err)
        })

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
      $("#register_button").parent().addClass('showElement');
      $("#login_button").parent().addClass('showElement');
      $("#profile_button").parent().addClass('hideElement');
      $("#add_button").parent().addClass('hideElement');
      $("#logout_button").parent().addClass('hideElement');

      $("#register_button").parent().removeClass('hideElement');
      $("#login_button").parent().removeClass('hideElement');
      $("#profile_button").parent().removeClass('showElement');
      $("#add_button").parent().removeClass('showElement');
      $("#logout_button").parent().removeClass('showElement');
    })
    .fail ( (response) => {
      console.log("Logout failed!", response);
    })
  });


  $(function pagePopulate () {
    $.ajax({
      type: 'GET',
      url: 'api/resources/?limit=20'
    })
    .done( (data) => {
      console.log(data);
      renderResources(data);
    })
    .fail( (err) => {
      console.log('Failed', err)
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

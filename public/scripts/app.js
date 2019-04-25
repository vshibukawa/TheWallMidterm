
function createResourceElement (input) {
  // Create variables representing the individual elements in a resource.
  // Resource wrap creation.
  console.log('input', input);
  let resWrap = $('<div>').addClass('col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12');

  //Resource Inner Wrap creation
  let resInner = $('<div>').addClass('resource_minimal_single mr-1 m1-1');

  //Resource Inner Top creation
  let resInnerHead = $('<div>').addClass('resource_min_top_wrap');
  let resInnerHeadFullLink = $('<a>').addClass('resFullLink');
  let resInnerHeadTitle = $('<h3>');
  let resInnerHeadLink = $('<a>');
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
  let resInnerSocUser = $('<div>').addClass('col-3');

  // ****************************************************** //
  // Appending elements to facilitate the creation of a Resource.
  // ****************************************************** //

  // Create Resource wrapper
  $(resWrap).append(resInner);

  $(resInner).append(resInnerHead);
  $(resInnerHead).append(resInnerHeadFullLink);
  $(resInnerHeadFullLink).attr('src="#"');
  $(resInnerHeadFullLink).append(resInnerHeadTitle);
  $(resInnerHeadTitle).text(input['title']);
  $(resInnerHeadFullLink).append(resInnerHeadLink);
  $(resInnerHeadLink).attr('href', input['url']).text(input['url']);
  $(resInnerHeadFullLink).append(resInnerHeadDesc);
  $(resInnerHeadDesc).text(input['description']);
  $(resInnerHeadFullLink).append(resInnerHeadCatTitle);
  $(resInnerHeadCatTitle).text('Category');
  $(resInnerHeadFullLink).append(resInnerHeadCat);
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

  return resWrap;
}



function renderResources (inputData) {
  for (let index of inputData) {
    console.log('stuff', index);
    $('.main_section_wrap').prepend(createResourceElement(index))
  }
}

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


  // PROFILE PAGE FORM ON LOAD POPULATE FIELDS
  $(function profilePopulate () {
    $('#popup_profile input[name=first_name]').val(userInfo.first_name);
    $('#popup_profile input[name=last_name]').val(userInfo.last_name);
    $('#popup_profile input[name=username]').val(userInfo.username);
    $('#popup_profile input[name=email]').val(userInfo.email);
    $('#popup_profile input[name=password]').val(userInfo.password);
    $('#popup_profile input[name=avatar]').val(userInfo.avatar);
  });

  $(function pagePopulate () {
    let resourcesMain;
    $.ajax({
      type: 'GET',
      url: 'api/resources/?limit=20'
    })
    .done( (data) => {
      console.log('data', data);
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

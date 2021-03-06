// Global Variables

function pagePopulate () {
  getUsersCategies();

    $.ajax({
      type: 'GET',
      url: `api/resources/?limit=${globalVariables.limit}`
    })
    .done( (data) => {
      console.log(data);
      renderResources(data);
    })
    .fail( (err) => {
      console.log('Failed', err)
    })
  }
let frontuserInfo = {};

const globalVariables = {
  limit: 20
};

const getToken = () => $('#sidebar-wrapper').data('token') ;
const setToken = (token) => $('#sidebar-wrapper').data('token', token);

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
  let resInnerHeadDesc = $('<p>').addClass('description');
  let resInnerHeadCatTitle = $('<h4>');
  let resInnerHeadCat = $('<p>');

  //Resource Social Wrap
  let resInnerSoc = $('<div>').addClass('resource_minimal_social_wrap row');
  let resInnerSocLikes = $('<div>').addClass('col-3');
  let resInnerSocLikesTitle = $('<p>').addClass('likes');
  let resInnerSocRate = $('<div>').addClass('col-3');
  let resInnerSocRateTitle = $('<p>').addClass('rate');
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
  $(resInnerHeadLink).text(input['url'].substr(0, 50) + '...');
  $(resInnerHead).append(resInnerHeadDesc);
  $(resInnerHeadDesc).text(input['description'].substr(0, 50) + '...');
  $(resInnerHead).append(resInnerHeadCatTitle);
  $(resInnerHeadCatTitle).text('Categories');
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
  let rate = input['rate'];
  if(!input['rate']){ rate = 0; }
  $(resInnerSocRateTitle).text('Rating: ' + rate);
  $(resInnerSoc).append(resInnerSocCom);
  $(resInnerSocCom).append(resInnerSocComTitle);
  $(resInnerSocComTitle).text('Comments: ' + input['comments']);
  $(resInnerSoc).append(resInnerSocUser);
  $(resInnerSocUser).append('<button><i class="fas fa-edit"></i></button><button><i class="fas fa-trash-alt"></i></button>');


  resInnerHeadLink.data('resource_id', input.id);
  return resWrap;
}

function createCommentElement(input) {
  console.log("This is the comment input", input)
  let toDate = new Date(input['created_on']).toDateString();
  let comSingle = $('<div>').addClass('comment_single');
  let comInfoRow = $('<div>').addClass('row userName');
  let comInfoUser = $('<div>').addClass('col-8');
  let comInfoUserName = $('<h4>');
  let comInfoUserDate = $('<div>').addClass('comment_single_date col-4')
  let comInfoUserDateVal = $('<p>');
  let comInfoUserDateValSpan = $('<span>').addClass('comm_date');
  let comTextWrap = $('<div>').addClass('row');
  let comTextInner = $('<div>').addClass('col-12');
  let comTextValue = $('<p>');

  $(comSingle).append(comInfoRow);
  $(comInfoRow).append(comInfoUser);
  $(comInfoUser).append(comInfoUserName);
  $(comInfoUserName).text(input['username']);
  $(comInfoRow).append(comInfoUserDate);
  $(comInfoUserDate).append(comInfoUserDateVal);
  $(comInfoUserDateVal).append(comInfoUserDateValSpan);
  $(comInfoUserDateValSpan).text(toDate);

  $(comSingle).append(comTextWrap);
  $(comTextWrap).append(comTextInner);
  $(comTextInner).append(comTextValue);
  $(comTextValue).text(input['text']);



  return comSingle;


}

function addLikeAndRateandLink(reference, element, input) {

  $(`#popup_fullDetailed > .popupBoxWrapper > .popupBoxContent > .single_wrap >
  .resource_minimal_single > .resource_min_top_wrap > a`).attr('href', input['url']);
  $(`#popup_fullDetailed > .popupBoxWrapper > .popupBoxContent > .single_wrap >
  .resource_minimal_single > .resource_min_top_wrap > a`).attr('target', "_blank");


  $(`#popup_fullDetailed > .popupBoxWrapper > .popupBoxContent > .single_wrap >
  .resource_minimal_single > .resource_minimal_social_wrap `).data('call_elm', element)
  
  $('div:nth-child(2)',$(`#popup_fullDetailed > .popupBoxWrapper > .popupBoxContent > .single_wrap >
  .resource_minimal_single > .resource_minimal_social_wrap `)).append($('<span>').append(`<select class="form-control selcl" name="rates">
  <option></option>
  <option value="2">1</option>
  <option value="3">2</option>
  <option value="4">3</option>
  <option value="5">4</option>
  <option value="6">5</option>
  </select>`));

  $('div:nth-child(1)',$(`#popup_fullDetailed > .popupBoxWrapper > .popupBoxContent > .single_wrap >
  .resource_minimal_single > .resource_minimal_social_wrap`)).prepend($('<button class="like-mitten"><i class="fas fa-mitten"></i></button>'));

  if (reference.length === 1) {
    if (reference[0].liked) {
      $('div:nth-child(1) > button.like-mitten',$(`#popup_fullDetailed > .popupBoxWrapper > .popupBoxContent > .single_wrap >
      .resource_minimal_single > .resource_minimal_social_wrap`)).addClass("clicked");
    }

    $(`option[value="${reference[0].rate_id}"]`).attr('selected','selected');
  }
}


function callIndividualData(resourceID, element) {
  const ident = $('#popup_fullDetailed').data('resource_id');
  $('.comments_wrap').empty();
  $.ajax({
    type: "GET",
    url: "/api/resources/" + ident,
  })
  .then(resource => {
    $('.popupBoxContent').append(createResourceElement(resource[0], 'individualRes'));    
    $.ajax({
      type: "GET",
      url: "/api/resources/" + ident + "/references",
    })
    .then( reference => {
      addLikeAndRateandLink(reference, element, resource[0]);
    })

  })
  .then(() => {
    $.ajax({
      type: "GET",
      url: `/api/resources/${ident}/comments`
    })
    .then(comments => {
      renderComments(comments);
    })
  })

};

function renderComments(comments) {
  for (let c of comments) {
    $('.comments_wrap').prepend(createCommentElement(c));
  }
}

function renderResources (inputData) {
  for (let index of inputData) {
    $('.main_section_wrap').prepend(createResourceElement(index, 'col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12'))
  }
}

function pagePopulate () {
  $.ajax({
    type: 'GET',
    url: `api/resources/?limit=${globalVariables.limit}`
  })
  .done( (data) => {
    console.log(data);
    renderResources(data);
  })
  .fail( (err) => {
    console.log('Failed', err)
  })
}

$(document).ready(function() {
  // Set default states for first load
  $("#register_button").parent().addClass('showElement');
  $("#login_button").parent().addClass('showElement');
  $("#logout_button").parent().addClass('hideElement');
  $("#profile_button").parent().addClass('hideElement');
  $("#add_button").parent().addClass('hideElement');
  $('#fa-mitten').parent().addClass('hideElement');
  $('#sidebar-wrapper nav.navbar h3').addClass('hideElement');
  $('.comment_add_button').addClass('hideElement');

  $("#register_button").parent().removeClass('hideElement');
  $("#login_button").parent().removeClass('hideElement');
  $("#logout_button").parent().removeClass('showElement');
  $("#profile_button").parent().removeClass('showElement');
  $("#add_button").parent().removeClass('showElement');
  $('#fa-mitten').parent().removeClass('showElement');
  $('#sidebar-wrapper nav.navbar h3').removeClass('showElement');
  $('.comment_add_button').removeClass('showElement');


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
    getUsersCategies();
  });


  $('.myResourcesButton').on('click', function() {
    const token = getToken();
    $.ajax({
      type: 'GET',
      url: `api/users/${token}/resources`,
    })
    .done( (data) => {
      $('.main_section_wrap').empty();
      renderResources(data);
    })
    .fail( (err) => {
      console.log('My resources click Failed', err)
    })
  })

  $("#profile_button").on('click', function () {
    $('#popup_profile').css('display', 'block');
    let profileInfo = $('#profile_button').data();

    $.ajax({
      type: 'GET',
      url: 'api/users/'+ getToken()
    })
    .done( (data) => {
      console.log(data);
      // TO BE UPDATED WHEN WE HAVE A SINGLE USER ROUTE TO PULL INFO FROM.
      $('#popup_profile input[name=first_name]').val(data.first_name);
      $('#popup_profile input[name=last_name]').val(data.last_name);
      $('#popup_profile input[name=username]').val(data.username);
      $('#popup_profile input[name=email]').val(data.email);
      // $('#popup_profile input[name=password]').val(data.password);
      $('#popup_profile input[name=avatar]').val(data.avatar);
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

    if($(".comm_add_new").css('display') === 'block'){
      $(".comm_add_new textarea").focus();
    }
  })

  $(".full_close_button").click(function () {
    $('.individualRes').remove();
    $('#popup_fullDetailed').css('display', 'none');
    getUsersCategies();
  });

  // Functions
  const getResponseError = (XHR)=>{
    if(XHR.responseJSON){
      const { error, message } = XHR.responseJSON;
      return error;
    }
    return XHR.responseText;
  }

  const getUsersCategies = ()=>{
    const token = getToken();

    $('.navbar-nav.categories').empty();

    if(token){

      $.ajax('/api/users/categories')
      .done(categories => {
        $('.navbar-nav.categories').empty();
        const categoriesArray = [];
        categories.forEach(category => {

          const $a = $('<a>');
          $a.text(category.description);
          $a.data('category_id', category.id);
          $a.addClass('nav-link');
          const $li = $('<li>');
          $li.addClass('nav-item');
          $li.append($a);
          categoriesArray.push($li);
        })
        $('.navbar-nav.categories').append(categoriesArray);
      })
      .fail(response => loginFail( response ));
    }
  }

  const loginSuccess = function(user, form, closeButton){
    $(form).trigger("reset");
    $(closeButton).trigger("click");
    $('.avatar_wrap .avatar').attr('src', user.avatar);
    $('.avatar_wrap .avatar').toggle('.no-display');
    setToken(user.token);
    getUsersCategies();
    $("#register_button").parent().addClass('hideElement');
    $("#login_button").parent().addClass('hideElement');
    $("#logout_button").parent().addClass('showElement');
    $("#profile_button").parent().addClass('showElement');
    $("#add_button").parent().addClass('showElement');
    $('#fa-mitten').parent().addClass('showElement');
    $('#sidebar-wrapper nav.navbar h3').addClass('showElement');
    $('.comment_add_button').addClass('showElement');

    $("#register_button").parent().removeClass('showElement');
    $("#login_button").parent().removeClass('showElement');
    $("#logout_button").parent().removeClass('hideElement');
    $("#profile_button").parent().removeClass('hideElement');
    $("#add_button").parent().removeClass('hideElement');
    $('#fa-mitten').parent().removeClass('hideElement');
    $('#sidebar-wrapper nav.navbar h3').removeClass('hideElement');
    $('.comment_add_button').removeClass('hideElement');
    $('.main_section_wrap').empty();
  }

  const loginFail = function(response){
    $(".alert").slideDown("fast", () => $(".alert").text(getResponseError(response)));
  }
  const clearUsers = function(){
    $('.sidebar-nav .avatar').attr('src', '');
    $('.sidebar-nav .avatar').toggle('.no-display');
    $('.navbar-nav.categories').empty();
    setToken('');
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
      .done ( user =>  loginSuccess( user, ".register-form",  ".reg_close_button") )
      .fail ( response => loginFail( response ));
  });
  $(".profile-form").on("submit", function(event) {
    event.preventDefault();
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const userInput =  $(this).serialize();
      $.ajax({
        type: "PUT",
        url: "/api/users/" + getToken(),
        data: userInput
      })
      .done ( () => {
        $(".prof_close_button").trigger("click");
      })
      .fail (response => loginFail( response ))
  });
  $(".addRes-form").on("submit", function(event) {
    event.preventDefault();
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const userInput =  $(this).serialize();
      $.ajax({
        type: "POST",
        url: '/api/resources/',
        data: userInput
      })
      .done ( (result) => {
        // console.log(result);
        $(".addRes-form").trigger("reset");
        $(".addRes_close_button").trigger("click");
        $('.main_section_wrap').prepend(createResourceElement(result[0], 'col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12'))
      })
      .fail (response => loginFail( response ))
  });


  $(".addComment-form").on("submit", function(event) {
    event.preventDefault();
    $(".alert").slideUp("fast");
    $(".alert").text("");
    const resID = $('#popup_fullDetailed').data('resource_id');
    const userInput =  $(this).serialize();
      $.ajax({
        type: "POST",
        url: `/api/resources/${resID}/comments/`,
        data: userInput
      })
      .done ( (result) => {
        $(".addComment-form").trigger("reset");
        $(".comment_add_button button").trigger("click");
        $('.comments_wrap').prepend(createCommentElement(result));
        console.log("THis is the result of comment", result);
      })
      .fail (response => loginFail( response ))
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
        loginSuccess( frontuserInfo, ".login-form", ".login_close_but-un" )
        console.log('User INFO', userInfo)

        $.ajax({
          type: 'GET',
          url: `api/users/${frontuserInfo.token}/resources`,
        })
        .done( (data) => {
          renderResources(data);
        })
        .fail( (err) => {
          console.log('Failed', err)
        })
        $(".login_close_button").trigger("click");
      })
      .fail ( response => loginFail( response ))
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
      clearUsers();
      console.log("Logout Succesful!");
      $("#register_button").parent().addClass('showElement');
      $("#login_button").parent().addClass('showElement');
      $("#profile_button").parent().addClass('hideElement');
      $("#add_button").parent().addClass('hideElement');
      $("#logout_button").parent().addClass('hideElement');
      $('#fa-mitten').parent().addClass('hideElement');
      $('#sidebar-wrapper nav.navbar h3').addClass('hideElement');
      $('.comment_add_button').addClass('removeElement');

      $("#register_button").parent().removeClass('hideElement');
      $("#login_button").parent().removeClass('hideElement');
      $("#profile_button").parent().removeClass('showElement');
      $("#add_button").parent().removeClass('showElement');
      $("#logout_button").parent().removeClass('showElement');
      $('#fa-mitten').parent().removeClass('showElement');
      $('#sidebar-wrapper nav.navbar h3').removeClass('showElement');
      $('.comment_add_button').removeClass('showElement');

      $('.main_section_wrap').empty();

      $('.avatar_wrap .avatar').toggle('.no-display');
      pagePopulate();
    })
    .fail ( (response) => {
      console.log("Logout failed!", response);
    })
  });

  $('.navbar-nav.categories').on('click', 'a', function(event){
    event.preventDefault();
    const category_id = $(this).data('category_id');
    const user_token = getToken();
    $('.main_section_wrap').empty();
    $.ajax(`api/categories/${category_id}/resources/`)
    .done( (data) => renderResources(data) )
    .fail ( response => loginFail( response ));
  });

  $('.search-form').on('submit', function(event){
    event.preventDefault();
    const userInput =  $(this).serialize();

    $('.main_section_wrap').empty();
    $.ajax(`api/resources/?${userInput}&limit=${globalVariables.limit}`)
    .done( (data) => renderResources(data) )
    .fail ( response => loginFail( response ));
    $('.search-form').trigger("reset");
  });


  $("#popup_fullDetailed").on("click", "button.like-mitten", function (e) {

    const resource_id = $('.fullLink',$(this).parent().parent().parent()).data("resource_id");

    if ($(this).hasClass("clicked")) {
      $(this).removeClass("clicked");
    } else {
      $(this).addClass("clicked");
    }
    $.ajax({
      type: 'PUT',
      url: `api/resources/${resource_id}`,
      data: {"liked": true}
    })
    .done( response => {
      console.log(response);
      $(this).parent().parent().data('call_elm').parent().parent().children('.resource_minimal_social_wrap')
      .children('div:nth-child(1)').children('p').text(`Likes: ${response[0].likes}`);
      $('.likes', $(this).parent()).text(`Likes: ${response[0].likes}`);
      
    });

  });

  $("#popup_fullDetailed").on("change", "select", function (e) {

    const resource_id = $('.fullLink',$(this).parent().parent().parent().parent()).data("resource_id");

    $.ajax({
      type: 'PUT',
      url: `api/resources/${resource_id}`,
      data: {"rate_id": this.value}
    })
    .done( response => {
      $(this).parent().parent().parent().data('call_elm').parent().parent().children('.resource_minimal_social_wrap')
      .children('div:nth-child(2)').children('p').text(`Rating: ${response[0].rate}`);
      $('.rate', $(this).parent().parent()).text(`Rating: ${response[0].rate}`);
    });

  });




  // initial page populate at first load
  pagePopulate();

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

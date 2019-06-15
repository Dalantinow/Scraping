$.getJSON("/headlines", data => {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<button jawn=" + data[i]._id +  ">Save Article</button><button comment=" + data[i]._id +  ">Comment</button></p>" );
    }
  });

  $.getJSON("/headlines", data => {
    for (var i = 0; i < data.length; i++) {
      if (data.saved === true){ 
      $("#savedarticles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<button jawn=" + data[i]._id + "</p>");
    }
  }
  })
$(document).on("click", "#scrape", function(){
  $.get("/scrape").then(function(data){
    location.reload()
  })
})

$(document).on("click", "#favorites", function(){
  window.location.href = `/favorites`
})

$(document).on("click", "jawn", function(){
  let thisId = $(this).attr("data-id");
  $(this).parents("p").remove();
  $.ajax({
    method: "PUT",
    url: "/headlines/" + thisId,
    data: {saved: true}
  }).then(function(data){
    console.log(data)
    if (data.saved) {
      location.reload()
    }
  })
})
  
$(document).on("click", "comment", function() {
  $("#notes").empty();
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/headlines/" + thisId
  })
  .then(function(data){
    console.log(data);
    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<input id='titleinput' name='title'>");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Post Comment</button>");
    $("#notes").append("<button data-id='" + data._id + "'id='deletenote'>Delete Comment</button>")
  if(data.note) {
    $("#titleinput").val(data.note.title);
    $("#bodyinput").val(data.note.body);
  }
  });
});

$(document).on("click", "#savenote", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/headlines/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val(),
    }
  })
  .then(function(data){
    console.log(data);
    $("#notes").empty();
    $("#savednotes").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function(){
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/headlines/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data){
    console.log(data);
    $("#notes").empty();
    $("#savednotes").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
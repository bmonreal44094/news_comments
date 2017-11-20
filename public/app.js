
$(".btn-saved").on("click", function() {
  var thisId = $(this).attr("id");
  console.log("this id: " + thisId);
  $.ajax({
          method: "POST",
          url: "/saved/" + thisId,
          data: {
            saved: false
          }
  }).done(function(data) {
  });
});

$(".btn-article").on("click", function() {
  var thisId = $(this).attr("id");
  // console.log(thisId);
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
  }).done(function(data) {
        // console.log(data);
    $("#myModal").toggle("slow", function(){});
    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
      }
  });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  // console.log(thisId);
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
  }).done(function(data) {
      // console.log(data);
      $("#notes").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#myModal").toggle("slow", function(){});
});

$("span").on("click", function() { 
  $("#myModal").toggle("slow", function(){});
});

$(window).on("click", function() {
  if (event.target == modal) {
        $("#myModal").toggle("slow", function(){});
    }
});

var modal = document.getElementById('myModal');

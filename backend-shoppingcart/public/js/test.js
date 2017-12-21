// $('#disp_tmp_path').change( function(event) {
//     var tmppath = URL.createObjectURL(event.target.files[0]);
//     $("img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
//     $("#disp_tmp_path1").html(tmppath);
// });

// function myFunction() {
//     var x = document.getElementById("imagePath").value;
//     document.getElementById("demo").innerHTML = x;
    
//     }

$('#imagePath1').change( function(event) {
        var tmppath = URL.createObjectURL(event.target.files[0]);
        $("#disp_tmp_path").html(tmppath);
    });
    
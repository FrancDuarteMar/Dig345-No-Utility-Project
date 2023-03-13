"use strict";
function dragNdrop(event) {
    var fileName = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("preview");
    var previewImg = document.createElement("img");
    previewImg.setAttribute("src", fileName);
    previewImg.setAttribute("width", "100%");

    preview.innerHTML = "";
    preview.appendChild(previewImg);
    $("#uploadImage").hide()
}
function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}
function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

$('input:radio[name="encDec"]').change(
    function(){
        if ($(this).val() == 'decrypt'){
            $(".inputArea").prop("disabled",true);
            $("#submitButton").attr('formaction', "/decode")
        } 
        else{
            $(".inputArea").prop("disabled",false);
            $("#submitButton").attr('formaction', "/upload")

        }
        
        console.log("Changed")
    });

// $('#radioForm input').on("change",function(){
//     console.log("Change in radio form ")
//     // var radioValue = $("input[name='gender']:checked").val();
//     // if(radioValue){
//     //     alert("Your are a - " + radioValue);
//     // }
    
// })
// $('input[name=radioName]:checked', '#myForm').on("change",function(){
//     var radioValue = $("input[name='gender']:checked").val();
//     if(radioValue){
//         alert("Your are a - " + radioValue);
//     }
// })

// $("#radio_1").prop("checked", true);

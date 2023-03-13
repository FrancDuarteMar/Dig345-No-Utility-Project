"use strict";

// const { steg } = require("../../lib/handlers");
// const steganography = require("./steganography");
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var messageInput = $(".inputArea")
var textCanvas = document.getElementById('textCanvas');
var tctx = textCanvas.getContext('2d');


function uploadImage(blobFile, text) {
    //  Uploading image, this does all the magic!, the file variable can also be a blob file
    let form = new FormData(),
        // file = document.getElementById("fileInput").files[0],
        file = blobFile,
        
        request = new XMLHttpRequest();
    form.append("file", file, "file");
    form.append("textToEncode",text)
    request.open("POST", "/upload");
    request.send(form);
}

var imageBlob; 
var imageUrl;

function dragNdrop(event) {
    var fileName = URL.createObjectURL(event.target.files[0]);
    var preview= document.getElementById("preview");
    var previewImg = document.createElement("img");
    previewImg.setAttribute("src", fileName);
    previewImg.setAttribute("width", "100%");
    previewImg.id = "image"
    preview.innerHTML = "";
    preview.appendChild(previewImg);
    $("#uploadSubmit").hide()
    console.log(fileName)
    imageBlob = event.target.files[0]   
    imageUrl = fileName 
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
            $("#promptText").html("Text to Encode:")


        }

    });

    

$('#submitButton').click(function (e) { 
    e.preventDefault();
    // encode()
    console.log($("#encBubble").is(":checked"))
    if ($("#encBubble").is(":checked")){
        let test = stega.encode($(".inputArea").val(), imageUrl)
        $("#encrypted").attr("src",test)

    } 
    else{
        let message = stega.decode(imageUrl)
        $("#textFormArea").attr("placeholder",message)
        $("#promptText").html("Decoded Text: ")
        // console.log("Message: "+message)
    }    

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


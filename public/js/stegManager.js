"use strict";

var canvas = document.getElementById('imageCanvas');
var imageBlob; 
var imageUrl;


function uploadImage(blobFile, text) {
    let form = new FormData(),
        file = blobFile,
        request = new XMLHttpRequest();
    form.append("file", file, "file");
    form.append("textToEncode",text)
    request.open("POST", "/upload");
    request.send(form);
}

function dragNdrop(event) {
    var fileName = URL.createObjectURL(event.target.files[0]);
    var preview= document.getElementById("preview");
    var previewImg = document.createElement("img");
    previewImg.setAttribute("src", fileName);
    previewImg.setAttribute("width", "100%");
    previewImg.id = "image"
    preview.innerHTML = "";
    preview.appendChild(previewImg);
    $(".uploadContainer").css("display","none")
    imageBlob = event.target.files[0]   
    imageUrl = fileName 
    $("#firstImageTitle").css("visibility","visible")
}
function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}

function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

$('input:radio[name="encDec"]').change(
    function(){
        // Decrypt Text bubble
        if ($(this).val() == 'decrypt'){
            $(".inputArea").prop("disabled",true);
            // $(".inputArea").prop("readonly",true);
            $("#submitButton").attr('formaction', "/decode")
            $("#promptText").html("Decoding...")
            $("#textFormArea").attr("placeholder"," ")

        } 
        
        // Encrypt Text bubble
        else{
            $(".inputArea").prop("disabled",false);
            // $(".inputArea").prop("readonly",false);
            $("#textFormArea").attr("placeholder","Enter text to be encrypted")

            $("#submitButton").attr('formaction', "/upload")
            $("#promptText").html("Text to Encode")

        }
    });

$('#submitButton').click(function (e) { 
    e.preventDefault();
    console.log($("#encBubble").is(":checked"))
    // Encrypt Text to image
    if ($("#encBubble").is(":checked")){
        $(".inputArea").prop("disabled",false);
        $(".inputArea").prop("readonly",true);

        let test = stega.encode($(".inputArea").val(), imageUrl)
        $("#encryptedImage").attr("src",test)
        $("#encryptedDownload").css("visibility","visible")
        $("#downloadLink").attr("href",test)
        $("#secondImageTitle").css("visibility","visible")

    } 
    else{
        let message = stega.decode(imageUrl)
        $(".inputArea").prop("disabled",false);
        $(".inputArea").prop("readonly",true);
        $(".inputArea").val(message) 
        $("#promptText").html("Decoded Text ")

    }    

});

$(window).on('resize', function() {
    if($(window).width() < 576) {
        $(".radio-div").addClass("form-check-inline")
        // $(".main-radio-div").removeClass("col-sm-")

    }
    else{
        $(".radio-div").removeClass("form-check-inline")

    }
}
)

$(document).ready(function () {
    if($(window).width() < 576) {
        $(".radio-div").addClass("form-check-inline")
        // $(".main-radio-div").removeClass("col-sm-")

    }
    else{
        $(".radio-div").removeClass("form-check-inline")

    }
});

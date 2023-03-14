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
            $("#submitButton").attr('formaction', "/decode")
            $("#promptText").html("Decoded Text:")
        } 
        
        // Encrypt Text bubblge
        else{
            $(".inputArea").prop("disabled",false);
            $("#submitButton").attr('formaction', "/upload")
            $("#promptText").html("Text to Encode:")

        }
    });

$('#submitButton').click(function (e) { 
    e.preventDefault();
    console.log($("#encBubble").is(":checked"))
    // Encrypt Text to image
    if ($("#encBubble").is(":checked")){
        let test = stega.encode($(".inputArea").val(), imageUrl)
        $("#encryptedImage").attr("src",test)
        $("#encryptedDownload").css("visibility","visible")
        $("#downloadLink").attr("href",test)
        $("#secondImageTitle").css("visibility","visible")

    } 
    else{
        let message = stega.decode(imageUrl)
        $("#textFormArea").attr("placeholder",message)
        $("#promptText").html("Decoded Text: ")

    }    

});

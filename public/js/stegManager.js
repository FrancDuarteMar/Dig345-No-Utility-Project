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
    $("#uploadSubmit").hide()
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
    console.log($("#encBubble").is(":checked"))
    if ($("#encBubble").is(":checked")){
        let test = stega.encode($(".inputArea").val(), imageUrl)
        $("#encrypted").attr("src",test)
    } 
    else{
        let message = stega.decode(imageUrl)
        $("#textFormArea").attr("placeholder",message)
        $("#promptText").html("Decoded Text: ")
    }    

});

"use strict";

var canvas = document.getElementById('imageCanvas');
var imageBlob; 
var imageUrl;

function setDefaultState(switchOption){
    $("#uploadArea").removeClass("submittedYes")
    $("#uploadArea").addClass("submittedNo")
    
    $("#firstImageTitle").css("visibility","hidden")
    $("#secondImageTitle").css("visibility","hidden")
    $(".uploadContainer").css("display","")
    $("#encryptedDownload").css("visibility","hidden")
    $("#downloadLink").attr("href","")
    $(".inputArea").val("") 
    
    $("#previewMain").addClass("col-12")
    $("#encryptedMain").addClass("col-12")
    $("#previewMain").removeClass("col-6")
    $("#encryptedMain").removeClass("col-6")

    $("#image").attr("src", " ");
    $("#encryptedImage").attr("src"," ");

    // console.log("Switch option function: "+ switchOption)
    if (switchOption == ("encrypt")){
        // console.log("Switch ENcrypy ")
        $(".inputArea").prop("disabled",false);
        $("#textFormArea").attr("placeholder","Enter text to be encrypted")
        $("#submitButton").attr('formaction', "/upload")
        $("#promptText").html("Text to Encode")
        $(".inputArea").prop("readonly",false);

        
    }
    else{
        // console.log("Switch Decrypt ")

        $(".inputArea").prop("disabled",true);
        $("#submitButton").attr('formaction', "/decode")
        $("#promptText").html("Decoding...")
        $("#textFormArea").attr("placeholder"," ")

    }
}

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


$('input:radio[name="encDec"]').change(
    function(){
        // if($("uploadContainer").css("display"))
        // console.log("Status: "+ $(".uploadContainer").css("display"))
        if($("#uploadArea").hasClass("submittedYes")){
            setDefaultState($(this).val())
        }
        else{

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
    }
    });

$('#submitButton').click(function (e) { 
    e.preventDefault();
    
    $("#uploadArea").addClass("submittedYes")
    $("#uploadArea").removeClass("submittedNo")
    
    // console.log($("#encBubble").is(":checked"))
    // Encrypt Text to image
    if ($("#encBubble").is(":checked")){
        $(".inputArea").prop("disabled",false);
        $(".inputArea").prop("readonly",true);

        $("#previewMain").removeClass("col-12")
        $("#encryptedMain").removeClass("col-12")
        $("#previewMain").addClass("col-6")
        $("#encryptedMain").addClass("col-6")
        

        let test = stega.encode($(".inputArea").val(), imageUrl)
        $("#encryptedImage").attr("src",test)
        $("#encryptedDownload").css("visibility","visible")
        $("#downloadLink").attr("href",test)
        $("#secondImageTitle").css("visibility","visible")

    } 
    else{
        let message = stega.decode(imageUrl)
        $("#previewMain").addClass("col-12")
        $("#encryptedMain").addClass("col-12")
        $("#previewMain").removeClass("col-6")
        $("#encryptedMain").removeClass("col-6")

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

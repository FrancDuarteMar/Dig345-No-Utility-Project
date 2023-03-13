exports.encode = (message, original)=> {
    let imgData = original
    let newData = encMsg(imgData,message)
    return newData
}

getImageData = async function(blob) {
    const bitmap = await createImageBitmap(blob);
    const [width, height] = [bitmap.width, bitmap.height];
  
    // an intermediate "buffer" 2D context is necessary
    const ctx = DOM.context2d(width, height, 1);
    ctx.drawImage(bitmap, 0, 0);
  
    return ctx.getImageData(0, 0, width, height);
  }
function createImageBitmap(blob){
    let img = document.createElement("img");
    img.addEventListener("load", () => resolve(this));
    img.src = URL.createObjectURL(blob);
    }
function encMsg(imgLoc, message){
    let textData = message
    let imgData = getImageData(imgLoc)
    console.log(imgData)
    
    for (var i = 0; i < textData.length; i += 4) {
        if (textData.data[i+3] !== 0) {
            if (imgData.data[i+1]%10 == 7) {
                //do nothing, we're good
            }
            else if (imgData.data[i+1] > 247) {
                imgData.data[i+1] = 247;
            }
            else {
                while (imgData.data[i+1] % 10 != 7) {
                    imgData.data[i+1]++;
                }
            }
            pixelsInMsg++;
        }
        else {
            if (imgData.data[i+1]%10 == 7) {
                imgData.data[i+1]--;
            }
            pixelsOutMsg++;
        }
    }
}

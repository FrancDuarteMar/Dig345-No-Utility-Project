var base64Img = require('base64-img');
var Cover = function Cover() {};

exports.decode = (imgToDecode) =>{
  let imgData = imgToDecode
  let msg = decodeImg(imgData)
  console.log("Decoded Text at selfsteg = "+ msg)
  return msg
}

exports.encode = (message, original)=> {
    let imgData = original
    let newData = encMsg(imgData,message)
    return newData
}

function encMsg(colors, message) {
    console.log("Going to encode: "+ message)
    let messageBits = getBitsFromNumber(message.length);
    // console.log("message bits: "+messageBits)
    messageBits = messageBits.concat(getMessageBits(message));
    // console.log("message bits: "+messageBits)

    let history = [];
    let pos = 0;
    while (pos < messageBits.length) {
        let loc = getNextLocation(history, colors.length);
        colors[loc] = setBit(colors[loc], 0, messageBits[pos]);
        while ((loc + 1) % 4 !== 0) {
            loc++;
        }
        colors[loc] = 255;
        pos++;
    }
    return colors
}

function decodeImg(colors){
  let history = [];
  let messageSize = getNumberFromBits(colors, history);
  if ((messageSize + 1) * 16 > colors.length * 0.75) {
    return '';
  }
  if (messageSize === 0) {
    return '';
  }
  let message = [];
  for (let i = 0; i < messageSize; i++) {
    let code = getNumberFromBits(colors, history);
    message.push(String.fromCharCode(code));
  }
  return message.join('');
}

function getBit(number, location) {
  return ((number >> location) & 1);
};

function getBit(number, location) {
    return ((number >> location) & 1);
  };
  
  function setBit(number, location, bit) {
    return (number & ~(1 << location)) | (bit << location);
  };
  
  function getBitsFromNumber(number) {
    let bits = [];
    for (let i = 0; i < 16; i++) {
      bits.push(getBit(number, i));
    }
    return bits;
  };
  
  function getNumberFromBits(bytes, history) {
    let number = 0,
      pos = 0;
    while (pos < 16) {
      let loc = getNextLocation(history, bytes.length);
      let bit = getBit(bytes[loc], 0);
      number = setBit(number, pos, bit);
      pos++;
    }
    return number;
  };
  
  function getMessageBits(message) {
    let messageBits = [];
    for (let i = 0; i < message.length; i++) {
      let code = message.charCodeAt(i);
      messageBits = messageBits.concat(getBitsFromNumber(code));
    }
    return messageBits;
  };
  
  function getNextLocation(history, total) {
    let loc = 0;
    while (true) {
      if (history.indexOf(loc) >= 0) {
        loc++;
      } else if ((loc + 1) % 4 === 0) {
        loc++;
      } else {
        history.push(loc);
        return loc;
      }
    }
  };



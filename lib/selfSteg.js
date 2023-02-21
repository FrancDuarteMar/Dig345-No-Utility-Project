var base64Img = require('base64-img');
var Cover = function Cover() {};

exports.encode = (message, original, output)=> {
    let imgData = base64Img.base64Sync(original)
    encMsg(imgData,message)
    return imgData
}

function encMsg(colors, message) {
    let messageBits = getBitsFromNumber(message.length);
    messageBits = messageBits.concat(getMessageBits(message));
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

}

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




const checkHtml = (text) => {
    const pattern = new RegExp(/[A-z0-9\s@]*/, 'g'); 
    const textMatched = text.match(pattern).join('');

    if(textMatched.length === text.length){
        return true;
    } else{
        return false;
    }
};

module.exports = checkHtml;
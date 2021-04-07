// Jest Testing By Sinu Mathews
  function isRatingEmpty(value) {
    console.log("isRatingEmpty method value :"+value);
      if(value === '') return true;
      return false;
  };


  function isValidRating(value) {
    console.log("isValidRating method1:"+value);
    console.log("isValidRating method2:"+parseInt(value));
    var isValid=  false;
    if(parseInt(value)> 0 ) {
      console.log("isValidRating method condition passed");
      isValid =  true;
     
    }
    return isValid;
};

exports.isRatingEmpty = isRatingEmpty;
exports.isValidRating = isValidRating;

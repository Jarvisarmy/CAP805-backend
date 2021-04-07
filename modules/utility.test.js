// Jest Testing By Sinu Mathews
const { isValidRating } = require('./utility');
const { isRatingEmpty } = require('./utility');

const validRating = 2;
const invalidRating = -1;


test('isRatingEmpty() Success Test',() =>{
  let result = isRatingEmpty('');
  expect(result).toBeTruthy();
});


test('isRatingEmpty() Fail Test',() =>{
  let result = isRatingEmpty(validRating);
  expect(result).toBeFalsy();
});


test('isValidRating()  Valid Rate',() =>{
  console.log("isValidRating test input:"+validRating);
  let result = isValidRating(validRating);
  console.log("isValidRating test resul:"+result);
  expect(result).toBeTruthy();
});

test('isValidRating()  Invalid Rate',() =>{
  let result = isValidRating(invalidRating);
  expect(result).toBeFalsy();
});


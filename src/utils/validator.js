const validateData = (data) => {
  if (data === undefined || data === null || data === "") {
    return false;
  }
  return true;
};

const validateEmailRequest = (body) => {
  const errors = [];

  if (!validateData(body.sender)) errors.push("Enter Valid Sender Email Address");
  if (!validateData(body.recipient)) errors.push("Enter Valid Recipient Email Address");
  if (!validateData(body.app)) errors.push("Enter Valid App Name");
  if (!validateData(body.subject)) errors.push("Enter Valid Subject");

  return errors;
};

module.exports = {
  validateData,
  validateEmailRequest,
};

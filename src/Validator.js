
const validateData =  function (data) {
  if (data == undefined || data == "") {
    return false;
  }
  return true;
}

function validateRequest(req, res) {
  if (!validateData(req.sender)) {
    sendError(res, "Enter Valid Sender Email Address");
    return false;
  }

  if (!validateData(req.recipient)) {
    sendError(res, "Enter Valid recipient Email Address");
    return false;
  }

  if (!validateData(req.app)) {
    sendError(res, "Enter Valid App Name");
    return false;
  }

  if (!validateData(req.subject)) {
    sendError(res, "Enter Valid Subject");
    return false;
  }

  return true;
}


module.exports = {
  validateData,
  validateRequest,
};
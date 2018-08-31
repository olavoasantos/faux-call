/**
 *  mockResponse
 *  If you need to mock a response from the server,
 *  you can pass a 'status' and 'response' header
 *  with the request.
 *
 *  status: Number
 *  response: JSON
 */
const mockResponse = (req, res) => {
  if (req.get('status')) {
    res.status(req.get('status'));
  }
  if (req.get('response')) {
    res.send(req.get('response'));
    return true;
  }

  return false;
};

module.exports = mockResponse;

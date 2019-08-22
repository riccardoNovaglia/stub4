function addRoute(app, request, response) {
  const middlw = prepareResponse(response);
  request.method === 'GET' ? app.get(request.url, middlw) : app.post(request.url, middlw);
}

function prepareResponse({ body, contentType }) {
  return (_, res) => {
    return res.set('Content-Type', contentType).send(body);
  };
}

module.exports = addRoute;

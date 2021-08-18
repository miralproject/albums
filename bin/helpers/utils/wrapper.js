
const data = (data) => ({ err: null, data});

const error = (err) => ({ err, data: null });

const response = (res, code = 200, status = 'OK', data, message) => {
  res.send({
    'code': code,
    'status': status,
    'data': data,
    'message': message
  })
}

const responseSignin = (res, code = 200, status = 'OK', data, token, message) => {
  res.send({
    'code': code,
    'status': status,
    'data': data,
    'token': token,
    'message': message
  })
}

module.exports = {
  data,
  error,
  response,
  responseSignin,
}
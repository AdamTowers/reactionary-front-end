export default class AuthService {
  login(user, pass){
    return when(request({
      url: 'http://localhost:3001/sessions/create',
       method: ‘POST’,
       crossOrigin: true,
       headers:{
         'Content-Type':'application/json'
       }
       body: {
         user, pass
       }
    }).then(resp => {
      let jwt = resp.id_token
      debugger
    })
  )
  }
}

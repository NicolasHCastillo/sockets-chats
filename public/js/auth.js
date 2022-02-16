const miFormulario = document.querySelector('form')

const url = (window.location.hostname.includes('localhost')) 
            ? "//localhost:8080/api/auth/" 
            : "https://restserver-curso-nodejs-nhc.herokuapp.com/api/auth/"

miFormulario.addEventListener('submit', (evento) =>{
    evento.preventDefault()
    const formData = {};
    for(let el of miFormulario.elements){
        if(el.name.length>0){
            formData[el.name] = el.value
        }
    }
    fetch(url+'login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then( resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.error(msg)
        }
        localStorage.setItem('token', token)
        console.log('all done');
        window.location = 'chat.html'
    })
    .catch(err => console.log(err))
})

function handleCredentialResponse(response) {
           
    //google token: ID token

    const body= {id_token: response.credential}

    fetch(url+'google', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(body)
    })
    .then( resp => resp.json())
    .then(({token, usuario}) => {
        localStorage.setItem('token',token)
        localStorage.setItem('email', usuario.correo)
        window.location = 'chat.html'
    })
    .catch(err => {
        console.log('err----------',err);
        console.warn()
    })
}
const button = document.getElementById('google_signout')
button.onclick = () => {
    console.log(localStorage.getItem('token'));
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done =>{
        localStorage.setItem('token','')
        localStorage.setItem('email','')
        location.reload()
    })
}


//* Variables para la desencriptación
const base64ABuffer = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
const LONGITUD_SAL = 16;
const LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;
/**
 ** Clave basada en una contraseña dada, función ASYNC
 * @param {String} contraseña -> Contraseña dada
 * @param {Uint8Array} sal -> Variable randomizado para la derivaciones
 * @param {int} iteraciones -> Cantidad de iteraciones
 * @param {int} longitud -> longitud de la clave
 * @param {String} hash -> Método de encriptación
 * @param {String} algoritmo -> Algoritmo AES-CBC
 */
const derivacionDeClaveBasadaEnContrasenia = async (contraseña, sal, iteraciones, longitud, hash, algoritmo = 'AES-CBC') => {
    const encoder = new TextEncoder();
    let keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(contraseña),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(sal),
            iterations: iteraciones,
            hash
        },
        keyMaterial,
        { name: algoritmo, length: longitud },
        false,
        ['encrypt', 'decrypt']
    );
}
/**
 **Función para desencriptar la cookie
 * @param {String} contraseña -> Contraseña dada por el usuario, el que uso para la encriptación
 * @param {String} encriptadoEnBase64 -> Texto encriptado en Base 64 
 * @returns 
 */
const desencriptar = async (contraseña, encriptadoEnBase64) => {
    const decoder = new TextDecoder();
    const datosEncriptados = base64ABuffer(encriptadoEnBase64);
    const sal = datosEncriptados.slice(0, LONGITUD_SAL);
    const vectorInicializacion = datosEncriptados.slice(0 + LONGITUD_SAL, LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION);
    const clave = await derivacionDeClaveBasadaEnContrasenia(contraseña, sal, 100000, 256, 'SHA-256');
    const datosDesencriptadosComoBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv: vectorInicializacion },
        clave,
        datosEncriptados.slice(LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION)
    );
    return decoder.decode(datosDesencriptadosComoBuffer);
}
//* Variables que se necesitan para mostrar resultados
var formulario = document.getElementById("dataInformation");
var paymentResult = document.getElementById("paymentResult");
var paymentResult2 = document.getElementById("paymentResult2");
var paymentResult3 = document.getElementById("paymentResult3");

/**
 * *Función para obtener el valor de la cookie
 * @param {String} name -> Nombre de la Cookie
 * @returns {String, null} -> Regresa el valor de la cookie
 */
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

//* Evento submit para enviar los datos a Pay.php
formulario.addEventListener('submit', async function (e) {
    try {
        e.preventDefault();
        var datos = new FormData(formulario);
        //* Desencriptas la información
        const desencriptado = await desencriptar("secret", getCookie("paquete"));
        datos.append('membershipPack', desencriptado);
        fetch('../src/pay.php', {
            method: 'POST',
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === '200') {
                    document.cookie = "paquete=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                    window.location.href = "../index.html";
                }
            })
    } catch (error) {
        window.location.href = "../src/prevention.html";
    }

})

//* Método que se aplica cuando se carga la página web
const onLoad = async () => {
    try {
        var nameCookie = getCookie("paquete");
        if (nameCookie != null) {
            var datos = new FormData();
            const desencriptado = await desencriptar("secret", nameCookie);
            datos.append('membershipPack', desencriptado);
            fetch('../src/payDatos.php', {
                method: 'POST',
                body: datos
            })
                .then(response => response.json())
                .then(data => {
                    paymentResult.innerHTML = `
                <label style="font-size: 30px;"><strong>${data['Name-Pack']}</strong></label>
            `;
                    paymentResult2.innerHTML = `
                <h1><strong>Payment - ${data['Name-Pack']}</strong></h1>
            `;
                    paymentResult3.innerHTML = `
                <label><strong>Total Amount: $${data['Price']} MXN</strong></label>
            `;
                })
        }
        else {
            window.location.href = "../src/payFail.php";
        }
    } catch (error) {
        window.location.href = "../src/prevention.html";
    }
}

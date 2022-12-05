//* Variables convertidor de Buffer to Base64
const bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));

/**
 ** Clave basada en una contraseña dada, función ASYNC
 * @param {String} contraseña -> Contraseña dada
 * @param {Uint8Array} sal -> Variable randomizado para la derivaciones
 * @param {int} iteraciones -> Cantidad de iteraciones
 * @param {int} longitud -> longitud de la clave
 * @param {String} hash -> Método de encriptación
 * @param {String} algoritmo -> Algoritmo AES-CBC
 */
const derivacionDeClaveBasadaEnContraseña = async (contraseña, sal, iteraciones, longitud, hash, algoritmo = 'AES-CBC') => {
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
 ** Función para encriptar la cookie
 * @param {String} contraseña -> Contraseña dada para la encriptación
 * @param {String} textoPlano -> Texto que se quiere encriptar
 * @returns {String} -> Texto encriptado en base 64
 */
const encriptar = async (contraseña, textoPlano) => {
    const encoder = new TextEncoder();
    const sal = window.crypto.getRandomValues(new Uint8Array(16));
    const vectorInicializacion = window.crypto.getRandomValues(new Uint8Array(16));
    const bufferTextoPlano = encoder.encode(textoPlano);
    const clave = await derivacionDeClaveBasadaEnContraseña(contraseña, sal, 100000, 256, 'SHA-256');
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-CBC", iv: vectorInicializacion },
        clave,
        bufferTextoPlano
    );
    return bufferABase64([
        ...sal,
        ...vectorInicializacion,
        ...new Uint8Array(encrypted)
    ]);
};

//* Función ASYNC para detectar el Clic en el Botón del paquete Básico
const onClickBasic = async () => {
    //* Encriptación
    const encriptado = await encriptar("secret", "BASIC_PACK");
    document.cookie = "paquete=" + encriptado + "; samesite=lax";
    window.location.href = "../src/pay.html";
}

//* Función ASYNC para detectar el Clic en el Botón del paquete Premium
const onClickPremium = async () => {
    const encriptado = await encriptar("secret", "PREMI_PACK");
    document.cookie = "paquete=" + encriptado + "; samesite=lax";
    window.location.href = "../src/pay.html";
}

//* Función ASYNC para detectar el Clic en el Botón del paquete Pro
const onClickProGamer = async () => {
    const encriptado = await encriptar("secret", "PRGAM_PACK");
    document.cookie = "paquete=" + encriptado + "; samesite=lax";
    window.location.href = "../src/pay.html";
}


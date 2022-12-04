const bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));

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

const onClickBasic = async () => {
    const encriptado = await encriptar("secret", "BASIC_PACK");
    document.cookie = "paquete=" + encriptado + "; samesite=lax";
    window.location.href = "../src/pay.html";
}
const onClickPremium = async () =>  {
    const encriptado = await encriptar("secret", "PREMI_PACK");
    document.cookie = "paquete=" + encriptado + "; samesite=lax";
    window.location.href = "../src/pay.html";
}
const onClickProGamer = async () =>  {
    const encriptado = await encriptar("secret", "PRGAM_PACK");
    document.cookie = "paquete=" + encriptado + "; samesite=lax";
    window.location.href = "../src/pay.html";
}


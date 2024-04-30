import * as jose from "jose";

export const setToken = async (idCustomer: number) => {
    const secretKey = new TextEncoder().encode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI');
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ idCustomer })
        .setProtectedHeader({ alg })
        .sign(secretKey)
    localStorage.setItem("token", jwt);
}
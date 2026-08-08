const PREFIX = "sha256:";

function cryptoAvailable() {
  return (
    typeof crypto !== "undefined" &&
    !!crypto.subtle
  );
}

/**
 * تشفير كلمة المرور (SHA-256)
 * في حال عدم توفر Web Crypto تُرجع النص كما هو
 */
export async function hashPassword(password) {

  if (!cryptoAvailable()) {

    return password;

  }

  const data = new TextEncoder().encode(password);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  const hex = Array
    .from(new Uint8Array(digest))
    .map((b) =>
      b.toString(16).padStart(2, "0")
    )
    .join("");

  return PREFIX + hex;

}

/**
 * التحقق من كلمة المرور مقابل القيمة المخزنة
 * يدعم القيم القديمة المخزنة كنص عادي
 */
export async function verifyPassword(
  input,
  stored
) {

  if (typeof stored !== "string") {

    return false;

  }

  if (stored.startsWith(PREFIX)) {

    const hashedInput =
      await hashPassword(input);

    return hashedInput === stored;
  }

  return input === stored;

}
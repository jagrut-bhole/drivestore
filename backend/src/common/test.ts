import {
  generateToken,
  hashToken,
} from "./utils/crypto";

import {
  hashPassword,
  verifyPassword,
} from "./utils/password";

async function testUtilities() {
  const token = generateToken();

  const hashedToken = hashToken(token);

  console.log("Token generated:", !!token);
  console.log("Token hash:", hashedToken);

  const password = "MyStrongPassword123!";

  const passwordHash = await hashPassword(password);

  const valid = await verifyPassword(
    password,
    passwordHash,
  );

  const invalid = await verifyPassword(
    "WrongPassword",
    passwordHash,
  );

  console.log("Valid password:", valid);
  console.log("Invalid password:", invalid);
}

testUtilities();
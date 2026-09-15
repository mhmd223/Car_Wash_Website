import test from "node:test";
import assert from "node:assert/strict";

const enabled = process.env.RUN_LIVE_INTEGRATION === "true";
const apiUrl = process.env.LIVE_API_URL || "http://localhost:5173";
const email = process.env.LIVE_TEST_EMAIL;
const password = process.env.LIVE_TEST_PASSWORD;

function liveTest(name, callback) {
  return test(name, { skip: !enabled }, callback);
}

liveTest(
  "MariaDB-backed sessions persist through login and logout",
  async () => {
    assert.ok(email, "LIVE_TEST_EMAIL is required");
    assert.ok(password, "LIVE_TEST_PASSWORD is required");

    const loginResponse = await fetch(`${apiUrl}/account/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(loginResponse.status, 200);

    const cookie =
      loginResponse.headers.getSetCookie?.()[0] ||
      loginResponse.headers.get("set-cookie");
    assert.ok(cookie, "login should return a session cookie");
    const sessionCookie = cookie.split(";")[0];

    const meResponse = await fetch(`${apiUrl}/account/me`, {
      headers: { cookie: sessionCookie },
    });
    assert.equal(meResponse.status, 200);

    const logoutResponse = await fetch(`${apiUrl}/account/logout`, {
      headers: { cookie: sessionCookie },
    });
    assert.equal(logoutResponse.status, 200);

    const afterLogout = await fetch(`${apiUrl}/account/me`, {
      headers: { cookie: sessionCookie },
    });
    assert.equal(afterLogout.status, 401);
  },
);

liveTest("SMTP verification endpoint sends a real message", async () => {
  assert.ok(email, "LIVE_TEST_EMAIL is required");

  const response = await fetch(`${apiUrl}/account/resend-verification`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
});

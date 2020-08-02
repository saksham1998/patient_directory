const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const Patient = require("../db/models/Patient");
require("dotenv").config();

let patientId = 1;
const patient = {
  id: patientId,
  name: "Saksham Manocha",
  mail: "sakshammanocha@yahoo.com",
  age: 22,
  gender: "male",
  walletAmount: 1000,
  password: "saksham",
  token: jwt.sign({ id: patientId }, process.env.JWT_SECRET),
};

beforeEach(async () => {
  await Patient.destroy({
    where: {},
  });
  await Patient.create(patient);
});

test("it should register new user", async () => {
  await request(app)
    .post("/patient/register")
    .send({
      name: "Soham Manocha",
      mail: "soahm@yahoo.com",
      age: 22,
      gender: "male",
      walletAmount: 1000,
      password: "soahm123",
    })
    .expect(201);
});

test("it should sign in with correct credentials", async () => {
  await request(app)
    .post("/patient/signin")
    .send({ mail: patient.mail, password: patient.password })
    .expect(201);
});

test("should fail for wrong signin credentials", async () => {
  await request(app)
    .post("/patient/sigin")
    .send({ mail: patient.mail, password: "1234567" })
    .expect(404);
});

test("it should return my profile", async () => {
  await request(app)
    .get("/patient/me")
    .set("Authorization", `Bearer ${patient.token}`)
    .send()
    .expect(200);
});

test("it should update my details", async () => {
  await request(app)
    .patch("/patient/me/update")
    .set("Authorization", `Bearer ${patient.token}`)
    .send({ age: 23 })
    .expect(201);
});

test("it should logout me of my session", async () => {
  await request(app)
    .delete("/patient/logout")
    .set("Authorization", `Bearer ${patient.token}`)
    .expect(200);
});

test("it should delete my profile", async () => {
  await request(app)
    .delete("/patient/delete")
    .set("Authorization", `Bearer ${patient.token}`)
    .expect(200);
});

test("it should give me list of patients with particular walletAmount", async () => {
    await request(app)
      .get("/patient/patientsWithAmount/1000")
      .set("Authorization", `Bearer ${patient.token}`)
      .expect(200);
  });

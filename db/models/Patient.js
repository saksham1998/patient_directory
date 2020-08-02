// Load Libraries
const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sequelize = require("../sequelize");

// Create Model
const Patient = sequelize.define("patient", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [2, 15],
    },
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
    min: 0,
    max: 100,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [["male", "female", "others"]],
    },
  },
  walletAmount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    min: 0,
    defaultValue: 0,
  },
  mail: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull:false,
    validate: {
      len: [6, ],
      notIn:[['password','default']],
    },
  },
  token: {
    type: Sequelize.STRING,
  }
});

// Generate JWT Token

Patient.prototype.generateToken = async function () {
  console.log(this.dataValues);
  const token = jwt.sign({ id: this.dataValues.id }, process.env.JWT_SECRET);
  await this.update({ token: token });
  return token;
};

// Authentication

Patient.checkCredentials = async (mail, password) => {
  const user = await Patient.findOne({
    where: {
      mail:mail
    },
  });
  if (!user) throw new Error("Email is not Correct");
  if (!(await bcrypt.compare(password, user.password)))
    throw new Error("Password is not correct");

  return user;
};

// Hash Password

Patient.beforeCreate((user) => {
  return bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
    })
    .catch((err) => {
      throw new Error("Error Occured while saving the Data");
    });
});

Patient.beforeUpdate((user) => {
  if (user.changed([user.password])) {
    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        throw new Error("Error Occured while saving the Data");
      });
  }
});

module.exports = Patient;

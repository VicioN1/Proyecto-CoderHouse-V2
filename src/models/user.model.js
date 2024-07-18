const mongoose = require("mongoose");
const bcrypt  = require("bcrypt");

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    carts: [{
        cart_id: String,
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Carts' 
        }
      }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const firstCollection = mongoose.model(userCollection, userSchema);

module.exports = firstCollection;


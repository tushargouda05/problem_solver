const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },
       

        role: {
            type: String,
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

// Keep the User model name so existing Mongoose refs continue to populate,
// while isolating this app's accounts from other projects in the same database.
module.exports = mongoose.model("User", userSchema, "psusers");

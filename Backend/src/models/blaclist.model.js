const mongoose = require("mongoose")


const blacklistTokenSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "token is a required to be added in blacklist"]
    }
}, {
    timestamps: true
});
const tokenBlacklistModel = mongoose.model("blacklistToken",blacklistTokenSchema)


module.exports = tokenBlacklistModel





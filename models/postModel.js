const mongoose = require("mongoose");

const constSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    header: {
       type: String,
    },
    details: {
        type: String,
    },
    imageLink: {
        type: String,
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("Post", constSchema);
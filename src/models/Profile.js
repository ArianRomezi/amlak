import { Schema, model, models } from "mongoose";

const profileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    realState: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    constructionDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["villa", "apartment", "store", "office"], //darune in harchi benevisam haminaro bishtar nemigire.ba enum mitunim mahdudehs konim.
      required: true,
    },
    amenities: {
      type: [String], //chon chand ta hastan bayad tu array bezarimesh.
      default: [], //baraye mavaghe ee ke karbar hichi neminevise.
    },
    rules: {
      type: [String],
      default: [],
    },
    //id karbari ke in profile to ijad karde ast.
    userId: {
      //id ke khode mongoDB ijad mikone.
      type: Schema.Types.ObjectId,
      //in id eja dade mishe be modele user.yani in id ke daram midam dar khate bala ro az modele user bardar.
      ref: "User",
    },
    //baraye har agahi ye vaziat tarif mikonim
    published: {
      type: Boolean,
      default: false,
    },
  },
  //khate payyen daghighan kare createdAt va updateAt ro anjam mide.
  { timestamps: true }
);

const Profile = models.Profile || model("Profile", profileSchema);

export default Profile;

import mongoose, { Schema } from "mongoose";

import { IShop } from "../types/shop.types";

const shopSchema = new Schema<IShop>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    services: {
      type: [String],
      default: [],
    },

    gstin: {
      type: String,
      required: function (this: { isNew: boolean }) {
        return this.isNew;
      },
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },

    legalBusinessName: {
      type: String,
      trim: true,
    },

    gst: {
      type: new Schema(
        {
          gstin: {
            type: String,
            trim: true,
            uppercase: true,
          },
          legalBusinessName: {
            type: String,
            trim: true,
          },
          tradeName: {
            type: String,
            trim: true,
            default: null,
          },
          status: {
            type: String,
            trim: true,
          },
          taxpayerType: {
            type: String,
            trim: true,
            default: null,
          },
          businessConstitution: {
            type: String,
            trim: true,
            default: null,
          },
          registrationDate: {
            type: String,
            trim: true,
            default: null,
          },
          cancellationDate: {
            type: String,
            trim: true,
            default: null,
          },
          stateCode: {
            type: String,
            trim: true,
            default: null,
          },
          stateJurisdiction: {
            type: String,
            trim: true,
            default: null,
          },
          address: {
            type: String,
            trim: true,
            default: null,
          },
          pincode: {
            type: String,
            trim: true,
            default: null,
          },
          natureOfBusiness: {
            type: [String],
            default: [],
          },
          blockStatus: {
            type: String,
            trim: true,
            default: null,
          },
        },
        { _id: false },
      ),
    },

    status: {
        type: Number,
        enum: [-1, 0, 1],
        default: 0
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.index({
  location: "2dsphere",
});

const Shop = mongoose.model<IShop>("Shop", shopSchema);

export default Shop;
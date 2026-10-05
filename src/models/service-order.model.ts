import mongoose, { Schema } from "mongoose";

import { SERVICE_ORDER_STATUS, SHOP_SERVICES } from "../constants";
import { IServiceOrder } from "../types/service-order.types";

const serviceOrderSchema = new Schema<IServiceOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    shopOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      enum: SHOP_SERVICES,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(SERVICE_ORDER_STATUS),
      default: SERVICE_ORDER_STATUS.PENDING,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
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

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

serviceOrderSchema.index({ shopOwner: 1, createdAt: -1 });
serviceOrderSchema.index({ customer: 1, createdAt: -1 });
serviceOrderSchema.index({ shop: 1, status: 1 });
serviceOrderSchema.index({ location: "2dsphere" });

const ServiceOrder = mongoose.model<IServiceOrder>(
  "ServiceOrder",
  serviceOrderSchema,
);

export default ServiceOrder;

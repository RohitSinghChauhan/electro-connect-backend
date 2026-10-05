import { Document, Types } from "mongoose";

import { ServiceOrderStatus, ShopService } from "../constants";

export interface IServiceOrder extends Document {
  customer: Types.ObjectId;
  shop: Types.ObjectId;
  shopOwner: Types.ObjectId;
  shopName: string;
  service: ShopService;
  status: ServiceOrderStatus;
  customerName: string;
  phone: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceOrderInput {
  customerId: string;
  shopId: string;
  service: ShopService;
  address: string;
  latitude: number;
  longitude: number;
  customerName?: string;
  phone?: string;
  notes?: string;
}

export interface ServiceOrderResponse {
  id: string;
  customerId: string;
  shopId: string;
  shopOwnerId: string;
  shopName: string;
  service: ShopService;
  status: ServiceOrderStatus;
  customerName: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

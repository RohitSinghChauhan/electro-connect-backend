import { Document, Types } from "mongoose";

export type LearnStatus = "draft" | "published";

export interface ILearn extends Document {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  status: LearnStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLearnInput {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  status?: LearnStatus;
  createdBy: string;
}

export interface UpdateLearnInput {
  title?: string;
  slug?: string;
  content?: string;
  thumbnail?: string;
  videoUrl?: string;
  status?: LearnStatus;
}

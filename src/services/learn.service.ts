import { LEARN_STATUS } from "../constants";
import Learn from "../models/learn.model";
import { CreateLearnInput, UpdateLearnInput } from "../types/learn.types";
import { ApiError } from "../utils/api-error";

export const getPublistedLearnList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const filter = { status: LEARN_STATUS.PUBLISHED };

  const [items, total] = await Promise.all([
    Learn.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Learn.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getPublishedLearnDetails = async (id: string) => {
  const item = await Learn.findOne({
    _id: id,
    status: LEARN_STATUS.PUBLISHED,
  });

  if (!item) {
    throw new ApiError(404, "Learn content not found");
  }

  return item;
};

export const createLearn = async (input: CreateLearnInput) => {
  const existing = await Learn.findOne({ slug: input.slug.toLowerCase() });

  if (existing) {
    throw new ApiError(409, "Slug already exists");
  }

  try {
    const item = await Learn.create({
      title: input.title,
      slug: input.slug,
      content: input.content,
      thumbnail: input.thumbnail,
      videoUrl: input.videoUrl,
      status: input.status ?? LEARN_STATUS.DRAFT,
      createdBy: input.createdBy,
    });

    return item;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      throw new ApiError(409, "Slug already exists");
    }

    throw error;
  }
};

export const getAdminLearnList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Learn.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Learn.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getAdminLearnDetails = async (id: string) => {
  const item = await Learn.findById(id);

  if (!item) {
    throw new ApiError(404, "Learn content not found");
  }

  return item;
};

export const updateLearn = async (id: string, data: UpdateLearnInput) => {
  const item = await Learn.findById(id);

  if (!item) {
    throw new ApiError(404, "Learn content not found");
  }

  if (data.slug !== undefined) {
    const slug = data.slug.toLowerCase();
    const existing = await Learn.findOne({
      slug,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(409, "Slug already exists");
    }

    item.slug = slug;
  }

  if (data.title !== undefined) {
    item.title = data.title;
  }

  if (data.content !== undefined) {
    item.content = data.content;
  }

  if (data.thumbnail !== undefined) {
    item.thumbnail = data.thumbnail;
  }

  if (data.videoUrl !== undefined) {
    item.videoUrl = data.videoUrl;
  }

  if (data.status !== undefined) {
    item.status = data.status;
  }

  try {
    await item.save();
    return item;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      throw new ApiError(409, "Slug already exists");
    }

    throw error;
  }
};

export const deleteLearn = async (id: string) => {
  const item = await Learn.findByIdAndDelete(id);

  if (!item) {
    throw new ApiError(404, "Learn content not found");
  }

  return item;
};

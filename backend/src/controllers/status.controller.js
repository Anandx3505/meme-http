import prisma from '../config/prisma.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const defaultFallbackGif = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTVudmVndDV0cHRwdnE5Zmx6eHpsbmVldnZrcGhzOHJ1ZzdkMmZsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g01ZnwAUvutuK8GIQn/giphy.gif';

// Returns the list of all supported status codes
const getAllCodes = asyncHandler(async (req, res) => {
  const codes = await prisma.statusCode.findMany({
    orderBy: { code: 'asc' },
  });
  
  res.status(200).json(new ApiResponse(200, codes, 'Status codes fetched successfully'));
});

// Returns JSON for a specific code
const getCodeJson = asyncHandler(async (req, res) => {
  const code = parseInt(req.params.code, 10);
  
  if (isNaN(code)) {
    throw new ApiError(400, 'Invalid status code format');
  }

  const statusCodeData = await prisma.statusCode.update({
    where: { code },
    data: { hits: { increment: 1 } }
  }).catch(() => null);

  if (!statusCodeData) {
    throw new ApiError(404, 'Status code not found');
  }

  res.status(200).json(new ApiResponse(200, statusCodeData, 'Status code fetched successfully'));
});

// Returns the image for that code directly
const getCodeImage = asyncHandler(async (req, res) => {
  const code = parseInt(req.params.code, 10);

  if (isNaN(code)) {
    return res.redirect(defaultFallbackGif);
  }

  const statusCodeData = await prisma.statusCode.update({
    where: { code },
    data: { hits: { increment: 1 } }
  }).catch(() => null);

  if (statusCodeData && statusCodeData.imageUrl) {
    if (statusCodeData.imageUrl.startsWith('/images/')) {
      const filePath = path.join(__dirname, '..', '..', 'public', statusCodeData.imageUrl);
      return res.sendFile(filePath);
    }
    res.redirect(statusCodeData.imageUrl);
  } else {
    res.redirect(defaultFallbackGif);
  }
});

// Returns the top 5 most viewed status codes
const getTrendingCodes = asyncHandler(async (req, res) => {
  const trending = await prisma.statusCode.findMany({
    orderBy: { hits: 'desc' },
    take: 5
  });

  res.status(200).json(new ApiResponse(200, trending, 'Trending codes fetched successfully'));
});

export {
  getAllCodes,
  getCodeJson,
  getCodeImage,
  getTrendingCodes
};

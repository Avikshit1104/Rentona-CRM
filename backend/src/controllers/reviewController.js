const prisma = require("../prisma");

const createReview = async (req, res) => {
  try {
    const {
      jobId,
      rating,
      comment,
    } = req.body;

    const job =
      await prisma.workerJob.findUnique({
        where: {
          id: jobId,
        },
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.status !== "DONE") {
      return res.status(400).json({
        message:
          "Job not completed yet",
      });
    }

    const existingReview =
      await prisma.review.findUnique({
        where: {
          jobId,
        },
      });

    if (existingReview) {
      return res.status(400).json({
        message:
          "Review already exists",
      });
    }

    const review =
      await prisma.review.create({
        data: {
          rating,
          comment,
          workerId: job.workerId,
          reviewerId: req.user.id,
          jobId,
        },
      });

    // Update worker rating stats
    const workerReviews =
      await prisma.review.findMany({
        where: {
          workerId: job.workerId,
        },
      });

    const totalRatings =
      workerReviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      );

    const averageRating =
      totalRatings /
      workerReviews.length;

    await prisma.user.update({
      where: {
        id: job.workerId,
      },
      data: {
        rating: averageRating,
        totalReviews:
          workerReviews.length,
      },
    });

    res.status(201).json({
      message: "Review added",
      review,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getWorkerReviews = async (
  req,
  res
) => {
  try {
    const { workerId } = req.params;

    const reviews =
      await prisma.review.findMany({
        where: {
          workerId,
        },
        include: {
          reviewer: true,
        },
      });

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createReview,
  getWorkerReviews,
};
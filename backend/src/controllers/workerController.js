const getDistance = require("../utils/distance");
const prisma = require("../prisma");

const getWorkers = async (req, res) => {
  try {
    const { skill } = req.query;

    const workers = await prisma.user.findMany({
      where: {
        role: "WORKER",
        skill,
      },
      select: {
        id: true,
        name: true,
        email: true,
        skill: true,
        rating: true,
        completedJobs: true,
        acceptedJobs: true,
        latitude: true,
        longitude: true,
      },
    });

    res.status(200).json(workers);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getNearbyWorkers = async (
  req,
  res
) => {
  try {
    const {
      latitude,
      longitude,
      skill,
    } = req.query;

    const workers =
      await prisma.user.findMany({
        where: {
          role: "WORKER",
          skill,
        },
        select: {
          id: true,
          name: true,
          email: true,
          skill: true,
          rating: true,
          completedJobs: true,
          acceptedJobs: true,
          latitude: true,
          longitude: true,
        },
      });

    const nearbyWorkers =
      workers.map((worker) => {
        const distance = getDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          worker.latitude || 0,
          worker.longitude || 0
        );

        return {
          ...worker,
          distance: distance.toFixed(2),
        };
      });

    nearbyWorkers.sort(
      (a, b) =>
        parseFloat(a.distance) -
        parseFloat(b.distance)
    );

    res.status(200).json(
      nearbyWorkers
    );
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const recommendWorkers = async (
  req,
  res
) => {
  try {
    const {
      latitude,
      longitude,
      skill,
    } = req.query;

    const workers =
      await prisma.user.findMany({
        where: {
          role: "WORKER",
          skill,
        },
        select: {
          id: true,
          name: true,
          email: true,
          skill: true,
          rating: true,
          completedJobs: true,
          acceptedJobs: true,
          latitude: true,
          longitude: true,
        },
      });

    const scoredWorkers =
      workers.map((worker) => {
        const distance =
          getDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            worker.latitude || 0,
            worker.longitude || 0
          );

        const score =
          (worker.rating || 0) * 0.4 +
          (worker.completedJobs || 0) * 0.3 +
          (worker.acceptedJobs || 0) * 0.2 -
          distance * 0.1;

        return {
          ...worker,
          distance:
            distance.toFixed(2),
          score:
            score.toFixed(2),
        };
      });

    scoredWorkers.sort(
      (a, b) =>
        parseFloat(b.score) -
        parseFloat(a.score)
    );

    res.status(200).json(
      scoredWorkers
    );
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const assignWorker = async (req, res) => {
  try {
    const {
      complaintId,
      workerId,
    } = req.body;

    const job =
      await prisma.workerJob.create({
        data: {
          complaintId,
          workerId,
        },
      });

    await prisma.complaint.update({
      where: {
        id: complaintId,
      },
      data: {
        status: "ASSIGNED",
      },
    });

    res.status(201).json({
      message: "Worker assigned",
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const workerDecision = async (req, res) => {
  try {
    const {
      jobId,
      status,
    } = req.body;

    if (
      status !== "ACCEPTED" &&
      status !== "REJECTED"
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const job =
      await prisma.workerJob.update({
        where: {
          id: jobId,
        },
        data: {
          status,
        },
      });

    if (status === "ACCEPTED") {
      await prisma.user.update({
        where: {
          id: job.workerId,
        },
        data: {
          acceptedJobs: {
            increment: 1,
          },
        },
      });
    }

    res.status(200).json({
      message: "Job updated",
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getWorkerJobs = async (req, res) => {
  try {
    if (req.user.role !== "WORKER") {
      return res.status(403).json({
        message: "Only workers allowed",
      });
    }

    const jobs =
      await prisma.workerJob.findMany({
        where: {
          workerId: req.user.id,
        },
        include: {
          complaint: true,
        },
      });

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const markJobDone = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job =
      await prisma.workerJob.update({
        where: {
          id: jobId,
        },
        data: {
          status: "DONE",
        },
      });

    await prisma.user.update({
      where: {
        id: job.workerId,
      },
      data: {
        completedJobs: {
          increment: 1,
        },
      },
    });

    await prisma.complaint.update({
      where: {
        id: job.complaintId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    res.status(200).json({
      message: "Job completed",
      job,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.workerJob.findUnique({
      where: {
        id: jobId,
      },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            skill: true,
            rating: true,
            completedJobs: true,
          },
        },

        review: true,

        complaint: {
          include: {
            property: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },

        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getWorkers,
  getNearbyWorkers,
  recommendWorkers,
  assignWorker,
  workerDecision,
  getWorkerJobs,
  markJobDone,
  getJobDetails,
};